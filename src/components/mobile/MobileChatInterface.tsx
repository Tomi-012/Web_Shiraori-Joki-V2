'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Menu, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message, ChatSession } from '@/types';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { formatDate, generateId } from '@/lib/utils';

export default function MobileChatInterface() {
  const [sessions, setSessions] = useLocalStorage<ChatSession[]>('chat-sessions', []);
  const [currentSessionId, setCurrentSessionId] = useLocalStorage<string>('current-session', '');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId) || {
    id: generateId(),
    title: 'Chat Baru',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession.messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'Chat Baru',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    setShowSidebar(false);
  };

  const updateSessionTitle = (session: ChatSession, firstMessage: string) => {
    const title = firstMessage.slice(0, 20) + (firstMessage.length > 20 ? '...' : '');
    const updatedSession = { ...session, title };
    setSessions(sessions.map(s => s.id === session.id ? updatedSession : s));
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    const updatedSession = { ...currentSession };
    updatedSession.messages = [...currentSession.messages, userMessage];
    updatedSession.updatedAt = new Date();

    try {
      // Update session with user message immediately
      if (currentSession.messages.length === 0) {
        updateSessionTitle(updatedSession, input.trim());
      }
      setSessions(sessions.map(s => s.id === currentSession.id ? updatedSession : s));
      setInput('');

      // Send request to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedSession.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: data.content && data.content[0]
            ? data.content[0].text
            : 'Maaf, saya tidak dapat memberikan respons saat ini.',
          timestamp: new Date()
        };

        updatedSession.messages = [...updatedSession.messages, assistantMessage];
        updatedSession.updatedAt = new Date();
        setSessions(sessions.map(s => s.id === currentSession.id ? updatedSession : s));
      } else {
        // Handle API errors
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: data.error || 'Maaf, terjadi kesalahan. Silakan coba lagi.',
          timestamp: new Date()
        };

        updatedSession.messages = [...updatedSession.messages, errorMessage];
        updatedSession.updatedAt = new Date();
        setSessions(sessions.map(s => s.id === currentSession.id ? updatedSession : s));

        // Show error to user
        setError(data.error || 'Terjadi kesalahan');
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Maaf, tidak dapat terhubung ke server. Silakan periksa koneksi Anda dan coba lagi.',
        timestamp: new Date()
      };

      updatedSession.messages = [...updatedSession.messages, errorMessage];
      updatedSession.updatedAt = new Date();
      setSessions(sessions.map(s => s.id === currentSession.id ? updatedSession : s));

      setError('Koneksi gagal. Periksa internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const formEvent = new Event('submit', { cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>;
      handleSubmit(formEvent);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 flex-col mobile-full-height">
      {/* Header */}
      <div className="gradient-primary text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <button
          onClick={() => setShowSidebar(true)}
          className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 mobile-tappable"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold flex items-center justify-center gap-2">
            <Bot className="w-5 h-5" />
            Z.ai Assistant
          </h1>
        </div>
        <div className="w-11" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white">
        {currentSession.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4">
              <Bot className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Selamat datang!
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Asisten AI profesional untuk Shiraori Joki Pro
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentSession.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] px-4 py-3 relative group transition-all duration-200",
                    message.role === 'user'
                      ? 'message-user'
                      : 'message-assistant'
                  )}
                >
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">
                    {message.content}
                  </p>
                  <p className={cn(
                    "text-xs mt-2",
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  )}>
                    {formatDate(message.timestamp)}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="message-assistant px-4 py-3">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
        {error && (
          <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white shadow-lg mobile-safe-area">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(null); // Clear error when user starts typing
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan..."
                className="form-input resize-none min-h-[44px] max-h-32 text-sm"
                disabled={isLoading}
                rows={1}
                maxLength={4000}
              />
              <div className="mt-1 text-xs text-gray-500 text-right">
                {input.length}/4000
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn btn-primary mobile-tappable"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex">
          <div className="bg-white w-80 h-full flex flex-col shadow-2xl">
            <div className="sidebar-header flex items-center justify-between">
              <h2 className="font-semibold text-lg">Chat Sessions</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 mobile-tappable"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="sidebar-header">
              <button
                onClick={createNewSession}
                className="btn btn-primary w-full"
              >
                <Plus className="w-4 h-4" />
                Chat Baru
              </button>
            </div>

            <div className="sidebar-content">
              <div className="space-y-1 p-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all duration-200",
                      currentSessionId === session.id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => {
                      setCurrentSessionId(session.id);
                      setShowSidebar(false);
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 truncate leading-tight">
                        {session.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 leading-tight">
                        {formatDate(session.updatedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}