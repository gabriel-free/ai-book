import { NextResponse } from 'next/server';
import { getBooks } from '@/app/llm-query';

export async function POST(request: Request) {
  try {
    console.log('Received search request-Search Route');
    const { text } = await request.json();
    console.log('Search text:', text);
    
    if (!text) {
      return NextResponse.json(
        { error: 'Search text is required' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set in environment variables');
      return NextResponse.json(
        { 
          error: 'API configuration error',
          details: 'GROQ_API_KEY is missing. Please add it to your .env file.',
          solution: 'Add GROQ_API_KEY=your_api_key to your .env file and restart the server'
        },
        { status: 500 }
      );
    }

    console.log('Calling getBooks with text:', text);
    const books = await getBooks(text);
    console.log('Search results:', books);
    
    if (!books || books.length === 0) {
      return NextResponse.json({
        books: [],
        message: 'No books found matching your criteria. Try adjusting your search terms.',
        suggestions: [
          'Try a different genre',
          'Search by a different author',
          'Use more general terms',
          'Check the spelling of author names or book titles'
        ]
      });
    }
    
    return NextResponse.json({ books });
  } catch (error) {
    console.error('Detailed search error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { 
            error: 'API configuration error',
            details: error.message,
            solution: 'Please check your GROQ_API_KEY in the .env file'
          },
          { status: 500 }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            details: error.message,
            solution: 'Please try again in a few minutes'
          },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to process search request',
        details: error instanceof Error ? error.message : 'Unknown error',
        solution: 'Please try again or contact support if the issue persists'
      },
      { status: 500 }
    );
  }
} 