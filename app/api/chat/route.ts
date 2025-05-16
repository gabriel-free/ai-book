import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    // Debug: Log all environment variables (excluding sensitive data)
    console.log('Environment variables loaded:', {
      hasGroqApiKey: !!process.env.GROQ_API_KEY,
      groqApiKeyLength: process.env.GROQ_API_KEY?.length,
      groqApiKeyPrefix: process.env.GROQ_API_KEY?.substring(0, 4),
      nodeEnv: process.env.NODE_ENV,
    });

    const body = await req.json();
    console.log('Raw request body:', body);

    // Handle GraphQL availableAgents query
    if (body.operationName === 'availableAgents') {
      return NextResponse.json({
        data: {
          availableAgents: {
            agents: [
              {
                name: 'Book Assistant',
                id: 'book-assistant',
                description:
                  'AI-powered book recommendation and management assistant',
                __typename: 'Agent',
              },
            ],
            __typename: 'AvailableAgents',
          },
        },
      });
    }

    // Handle GraphQL generateCopilotResponse mutation
    if (body.operationName === 'generateCopilotResponse') {
      console.log('Processing generateCopilotResponse mutation');
      console.log('Variables:', body.variables);

      // Extract messages from the correct location in the GraphQL request
      const messages = body.variables?.data?.messages || [];
      console.log('Extracted messages:', messages);

      if (!Array.isArray(messages) || messages.length === 0) {
        console.error('No valid messages found in GraphQL request');
        return NextResponse.json({
          data: {
            generateCopilotResponse: {
              threadId: body.variables?.data?.threadId || null,
              runId: null,
              messages: [],
              metaEvents: [],
              status: {
                code: 'ERROR',
                reason: 'No valid messages found in request',
                details: 'The request must include a non-empty messages array',
                __typename: 'FailedResponseStatus',
              },
              __typename: 'CopilotResponse',
            },
          },
        });
      }

      const groqApiKey = process.env.GROQ_API_KEY;
      if (!groqApiKey) {
        console.error('GROQ_API_KEY is not set');
        return NextResponse.json({
          data: {
            generateCopilotResponse: {
              threadId: body.variables?.data?.threadId || null,
              runId: null,
              messages: [],
              metaEvents: [],
              status: {
                code: 'ERROR',
                reason: 'API key not configured',
                details: 'GROQ_API_KEY environment variable is not set',
                __typename: 'FailedResponseStatus',
              },
              __typename: 'CopilotResponse',
            },
          },
        });
      }

      // Format messages for Groq API
      const formattedMessages = messages
        .map((msg: any) => {
          // Handle both nested and flat message structures
          const role = msg.textMessage?.role || msg.role || 'user';
          const content = msg.textMessage?.content || msg.content;

          if (!content) {
            console.error('Message missing content:', msg);
            return null;
          }

          return { role, content };
        })
        .filter(Boolean); // Remove any null messages

      console.log('Formatted messages for Groq:', formattedMessages);

      if (formattedMessages.length === 0) {
        console.error('No valid messages after formatting');
        return NextResponse.json({
          data: {
            generateCopilotResponse: {
              threadId: body.variables?.data?.threadId || null,
              runId: null,
              messages: [],
              metaEvents: [],
              status: {
                code: 'ERROR',
                reason: 'Invalid message format',
                details: 'No valid messages found after formatting',
                __typename: 'FailedResponseStatus',
              },
              __typename: 'CopilotResponse',
            },
          },
        });
      }

      try {
        // First, let's check if the API key is valid by making a test request
        console.log('Making test request to Groq API...');
        const testResponse = await fetch(
          'https://api.groq.com/openai/v1/models',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Test response status:', testResponse.status);
        console.log(
          'Test response headers:',
          Object.fromEntries(testResponse.headers.entries())
        );

        if (!testResponse.ok) {
          const errorText = await testResponse.text();
          console.error('Groq API Key validation failed:', errorText);
          return NextResponse.json({
            data: {
              generateCopilotResponse: {
                threadId: body.variables?.data?.threadId || null,
                runId: null,
                messages: [],
                metaEvents: [],
                status: {
                  code: 'ERROR',
                  reason: 'Invalid API key',
                  details: `The provided Groq API key is invalid or has expired. Response: ${errorText}`,
                  __typename: 'FailedResponseStatus',
                },
                __typename: 'CopilotResponse',
              },
            },
          });
        }

        // If the API key is valid, proceed with the chat completion request
        console.log('Making chat completion request to Groq API...');
        const response = await fetch(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama2-70b-4096',
              messages: formattedMessages,
              temperature: 0.7,
              max_tokens: 1000,
              stream: false,
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          console.error('Groq API Error:', error);
          console.error('Response status:', response.status);
          console.error(
            'Response headers:',
            Object.fromEntries(response.headers.entries())
          );

          return NextResponse.json({
            data: {
              generateCopilotResponse: {
                threadId: body.variables?.data?.threadId || null,
                runId: null,
                messages: [],
                metaEvents: [],
                status: {
                  code: 'ERROR',
                  reason: 'Failed to get response from Groq',
                  details: {
                    status: response.status,
                    statusText: response.statusText,
                    error: error,
                  },
                  __typename: 'FailedResponseStatus',
                },
                __typename: 'CopilotResponse',
              },
            },
          });
        }

        const data = await response.json();
        console.log('Groq API response:', data);

        // Format response for GraphQL
        return NextResponse.json({
          data: {
            generateCopilotResponse: {
              threadId: body.variables?.data?.threadId || null,
              runId: null,
              messages: [
                {
                  __typename: 'TextMessageOutput',
                  content: data.choices[0].message.content,
                  role: 'assistant',
                  parentMessageId: null,
                  status: {
                    code: 'SUCCESS',
                    __typename: 'SuccessMessageStatus',
                  },
                },
              ],
              metaEvents: [],
              status: {
                code: 'SUCCESS',
                __typename: 'BaseResponseStatus',
              },
              __typename: 'CopilotResponse',
            },
          },
        });
      } catch (error) {
        console.error('Groq API request failed:', error);
        return NextResponse.json({
          data: {
            generateCopilotResponse: {
              threadId: body.variables?.data?.threadId || null,
              runId: null,
              messages: [],
              metaEvents: [],
              status: {
                code: 'ERROR',
                reason: 'Failed to connect to Groq API',
                details: error,
                __typename: 'FailedResponseStatus',
              },
              __typename: 'CopilotResponse',
            },
          },
        });
      }
    }

    // Handle regular chat requests
    if (!body.messages || !Array.isArray(body.messages)) {
      console.error('Invalid messages format:', body);
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.error('GROQ_API_KEY is not set');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    try {
      const response = await fetch('https://api.groq.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: body.messages.map((msg: any) => ({
            role: msg.role || 'user',
            content: msg.content,
          })),
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Groq API Error:', error);
        console.error('Response status:', response.status);
        console.error(
          'Response headers:',
          Object.fromEntries(response.headers.entries())
        );

        return NextResponse.json(
          {
            error: 'Failed to get response from Groq',
            details: {
              status: response.status,
              statusText: response.statusText,
              error: error,
            },
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('Groq API response:', data);

      return NextResponse.json({
        id: data.id,
        object: data.object,
        created: data.created,
        model: data.model,
        choices: data.choices.map((choice: any) => ({
          index: choice.index,
          message: choice.message,
          finish_reason: choice.finish_reason,
        })),
        usage: data.usage,
      });
    } catch (error) {
      console.error('Groq API request failed:', error);
      return NextResponse.json(
        {
          error: 'Failed to connect to Groq API',
          details: error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request', details: error },
      { status: 500 }
    );
  }
}
