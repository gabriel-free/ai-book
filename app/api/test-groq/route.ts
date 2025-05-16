import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2-70b-4096',
          messages: [{ role: 'user', content: 'Hello' }],
          temperature: 0.7,
          max_tokens: 100,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error:', error);
      return NextResponse.json(
        {
          error: 'API key test failed',
          details: error,
          status: response.status,
          statusText: response.statusText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      message: 'API key is working correctly',
      response: data,
    });
  } catch (error) {
    console.error('Request Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to test API key',
        details: error,
      },
      { status: 500 }
    );
  }
}
