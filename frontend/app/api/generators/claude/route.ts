import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';

interface ClaudeRequestBody {
  prompt: string;
  model: string;
  maxTokens: number;
  systemPrompt: string;
}

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not configured' },
      { status: 401 }
    );
  }

  try {
    const body: ClaudeRequestBody = await request.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: body.maxTokens || 4000,
        system: body.systemPrompt,
        messages: [
          {
            role: 'user',
            content: body.prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error:', errorData);

      if (response.status === 429) {
        return NextResponse.json(
          { error: 'API rate limited. Please try again in a moment.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: errorData.error?.message || 'Claude API error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.content[0]?.text || '';

    return NextResponse.json({
      content,
      model: CLAUDE_MODEL,
      usage: data.usage,
    });
  } catch (error) {
    console.error('Generation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Generation failed: ${message}` },
      { status: 500 }
    );
  }
}
