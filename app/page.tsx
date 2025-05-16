'use client';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';
import BookModal from './components/BookModal';
import TextInput from './components/TextInput';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchBooks, addBook, setSelectedBook, setBooks } from './store/booksSlice';
import { Book } from './types/basic';

// Helper function to convert ISO strings back to Date objects
const deserializeBook = (book: any): Book => ({
  ...book,
  createdAt: new Date(book.createdAt),
  updatedAt: new Date(book.updatedAt),
});

// Helper function to convert dates to ISO strings
const serializeBook = (book: Book) => ({
  ...book,
  createdAt: book.createdAt.toISOString(),
  updatedAt: book.updatedAt.toISOString(),
});

export default function Home() {
  const dispatch = useAppDispatch();
  const {
    items: books,
    status,
    selectedBook,
  } = useAppSelector(state => state.books);
  const [notes, setNotes] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [status, dispatch]);

  const handleAddBook = async (book: any) => {
    try {
      await dispatch(addBook(book)).unwrap();
      // After adding a book, fetch the latest data
      dispatch(fetchBooks());
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  const handleBookClick = (book: Book) => {
    // Serialize the book before dispatching
    const serializedBook = serializeBook(book);
    dispatch(setSelectedBook(serializedBook));
  };

  // Convert serialized books back to proper Date objects for components
  const deserializedBooks = books.map(deserializeBook);
  const deserializedSelectedBook = selectedBook
    ? deserializeBook(selectedBook)
    : null;

  const handleSearch = async () => {
    if (!notes.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchMessage(null);
    setSearchSuggestions([]);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Search failed';
        const errorDetails = data.details ? `\nDetails: ${data.details}` : '';
        const errorSolution = data.solution ? `\nSolution: ${data.solution}` : '';
        throw new Error(`${errorMessage}${errorDetails}${errorSolution}`);
      }

      console.log('Search results:', data);
      
      if (data.books && data.books.length > 0) {
        // Update the books list with search results
        dispatch(setBooks(data.books));
      } else {
        // Handle no results case
        setSearchMessage(data.message || 'No books found');
        if (data.suggestions) {
          setSearchSuggestions(data.suggestions);
        }
        // Clear the books list
        dispatch(setBooks([]));
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error instanceof Error ? error.message : 'An error occurred during search');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className={clsx('min-h-screen flex flex-col')}>
      {/* Header */}
      <header className={clsx('sticky top-0 z-10 bg-white shadow-sm')}>
        <h1
          className={clsx(
            'text-2xl sm:text-3xl font-bold py-4 px-4 sm:px-6 text-center'
          )}
        >
          AI Book Explorer
        </h1>
      </header>

      {/* Main Content */}
      <div className={clsx('flex-1 flex flex-col lg:flex-row overflow-hidden')}>
        {/* Left Sidebar - Add Book Form */}
        <aside
          className={clsx(
            'w-full lg:w-80 xl:w-96 bg-white',
            'border-b lg:border-b-0 lg:border-r border-gray-200',
            'p-4 lg:p-6'
          )}
        >
          <div className={clsx('max-w-md mx-auto')}>
            <AddBookForm onAdd={handleAddBook} />
          </div>
        </aside>

        {/* Main Content Area - Book List */}
        <main
          className={clsx(
            'flex-1 overflow-y-auto',
            'p-2 lg:px-4 lg:py-6',
            'bg-gray-50'
          )}
        >
          <div className={clsx('max-w-full mx-auto')}>
            <div className={clsx('flex items-center gap-2 mb-4')}>
              <TextInput 
                initialValue={notes} 
                onChange={setNotes} 
                onEnter={handleSearch}
                disabled={isSearching}
                placeholder='Try: "Mystery books" or "Books by Bernstein"'
              />
              <button
                type="button"
                disabled={isSearching}
                className={clsx(
                  'py-1.5 px-4',
                  'bg-gradient-to-r from-blue-500 to-blue-600',
                  'hover:from-blue-400 hover:to-blue-500',
                  'text-white font-medium rounded-lg',
                  'transition-all duration-400',
                  'cursor-pointer',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  'shadow-lg hover:shadow-blue-500/25',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                onClick={handleSearch}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
            
            {searchError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {searchError}
              </div>
            )}

            {searchMessage && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 font-medium mb-2">{searchMessage}</p>
                {searchSuggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-blue-600 text-sm font-medium mb-1">Suggestions:</p>
                    <ul className="list-disc list-inside text-blue-600 text-sm">
                      {searchSuggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <BookList books={deserializedBooks} onBookClick={handleBookClick} />
          </div>
        </main>
      </div>

      {/* Book Modal */}
      {deserializedSelectedBook && (
        <BookModal
          book={deserializedSelectedBook}
          onClose={() => dispatch(setSelectedBook(null))}
        />
      )}
    </main>
  );
}
