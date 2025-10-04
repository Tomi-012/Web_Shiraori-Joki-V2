'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Copy, Check, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message, ChatSession } from '@/types';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { formatDate, generateId } from '@/lib/utils';

export default function ChatInterface() {
  const [sessions, setSessions] = useLocalStorage<ChatSession[]>('chat-sessions', []);
  const [currentSessionId, setCurrentSessionId] = useLocalStorage<string>('current-session', '');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    try {
      const newSession: ChatSession = {
        id: generateId(),
        title: 'Chat Baru',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(newSession.id);
      setError(null);
    } catch (error) {
      console.error('Failed to create new session:', error);
      setError('Gagal membuat sesi baru');
    }
  };

  const deleteSession = (sessionId: string) => {
    try {
      const newSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(newSessions);

      if (currentSessionId === sessionId) {
        if (newSessions.length > 0) {
          setCurrentSessionId(newSessions[0].id);
        } else {
          createNewSession();
        }
      }
      setError(null);
    } catch (error) {
      console.error('Failed to delete session:', error);
      setError('Gagal menghapus sesi');
    }
  };

  const updateSessionTitle = (session: ChatSession, firstMessage: string) => {
    try {
      const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
      const updatedSession = { ...session, title };
      setSessions(sessions.map(s => s.id === session.id ? updatedSession : s));
    } catch (error) {
      console.error('Failed to update session title:', error);
    }
  };

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

  const copyMessage = async (content: string, messageId: string) => {
    try {
      if (!navigator.clipboard) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setCopiedMessageId(messageId);
            setTimeout(() => setCopiedMessageId(null), 2000);
          } else {
            throw new Error('Copy command failed');
          }
        } catch (fallbackError) {
          throw fallbackError;
        } finally {
          document.body.removeChild(textArea);
        }
      } else {
        await navigator.clipboard.writeText(content);
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      // Show user feedback about copy failure
      setError('Gagal menyalin teks');
      setTimeout(() => setError(null), 3000);
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="sidebar-header">
          <button
            onClick={createNewSession}
            className="btn btn-primary w-full"
          >
            <Plus className="w-4 h-4" />
            Chat Baru
          </button>
        </div>

        <div className="sidebar-content scrollbar-hide">
          <div className="space-y-1 p-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all duration-200",
                  currentSessionId === session.id
                    ? "bg-blue-50 border border-blue-200 shadow-sm"
                    : "hover:bg-gray-50"
                )}
                onClick={() => setCurrentSessionId(session.id)}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-gray-900 truncate leading-tight">
                    {session.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-tight">
                    {formatDate(session.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all duration-200 mobile-tappable"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="gradient-primary text-white px-6 py-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">Z.ai Chat Assistant</h1>
              <p className="text-blue-100 text-sm mt-0.5">Shiraori Joki Pro - Professional Gaming Assistant</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-50">
          {currentSession.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-6">
                <Bot className="w-16 h-16 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Selamat datang di Z.ai Assistant!
              </h2>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Saya adalah asisten AI profesional untuk Shiraori Joki Pro.
                Ada yang bisa saya bantu terkait jasa gaming dan portfolio kami?
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-2xl px-5 py-4 relative group transition-all duration-200",
                    message.role === 'user'
                      ? 'message-user'
                      : 'message-assistant'
                  )}>
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <p className={cn(
                        "text-xs",
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      )}>
                        {formatDate(message.timestamp)}
                      </p>
                      <button
                        onClick={() => copyMessage(message.content, message.id)}
                        className={cn(
                          "opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all duration-200",
                          message.role === 'user'
                            ? 'hover:bg-blue-700/20 text-blue-100'
                            : 'hover:bg-gray-100 text-gray-500'
                        )}
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-10 h-10 rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="message-assistant px-5 py-4">
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
          <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white shadow-lg">
          <div className="flex gap-3 items-end max-w-4xl mx-auto">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(null); // Clear error when user starts typing
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan Anda... (Enter untuk kirim, Shift+Enter untuk baris baru)"
                className="form-input resize-none min-h-[48px] max-h-32 text-sm"
                disabled={isLoading}
                rows={1}
                maxLength={4000}
              />
              <div className="mt-1 text-xs text-gray-500 text-right">
                {input.length}/4000 karakter
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn btn-primary btn-lg"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}