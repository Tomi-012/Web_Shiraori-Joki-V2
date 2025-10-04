import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_AUTH_TOKEN || '',
  baseURL: process.env.ANTHROPIC_BASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.ANTHROPIC_AUTH_TOKEN) {
      console.error('ANTHROPIC_AUTH_TOKEN is not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500, headers: corsHeaders }
      );
    }

    if (!process.env.ANTHROPIC_BASE_URL) {
      console.error('ANTHROPIC_BASE_URL is not configured');
      return NextResponse.json(
        { error: 'API base URL not configured' },
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { messages } = body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'At least one message is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate message format
    const isValidMessage = messages.every(msg =>
      msg &&
      typeof msg.role === 'string' &&
      ['user', 'assistant'].includes(msg.role) &&
      typeof msg.content === 'string' &&
      msg.content.trim().length > 0
    );

    if (!isValidMessage) {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('Sending request to Z.ai API:', {
      model: 'claude-3-sonnet-20240229',
      messagesCount: messages.length,
      baseURL: process.env.ANTHROPIC_BASE_URL
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: messages,
    });

    console.log('Z.ai API Response received successfully');

    return NextResponse.json(response, {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Z.ai API Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        hasToken: !!process.env.ANTHROPIC_AUTH_TOKEN,
        hasBaseUrl: !!process.env.ANTHROPIC_BASE_URL,
        tokenLength: process.env.ANTHROPIC_AUTH_TOKEN?.length || 0
      }
    });

    // Provide more specific error messages
    let errorMessage = 'Failed to process request';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'Invalid API key or unauthorized access';
        statusCode = 401;
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded. Please try again later';
        statusCode = 429;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please try again';
        statusCode = 408;
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Network error. Please check your connection';
        statusCode = 503;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: statusCode,
        headers: corsHeaders
      }
    );
  }
}