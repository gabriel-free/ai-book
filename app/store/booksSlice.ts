import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '../types/basic';
import { createBook, getBooks } from '../actions/books';

// Define a type for the serialized book
type SerializedBook = Omit<Book, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

// Helper function to convert dates to ISO strings
const serializeBook = (book: Book): SerializedBook => ({
  ...book,
  createdAt: book.createdAt.toISOString(),
  updatedAt: book.updatedAt.toISOString(),
});

// Helper function to convert ISO strings back to Date objects
const deserializeBook = (book: SerializedBook): Book => ({
  ...book,
  createdAt: new Date(book.createdAt),
  updatedAt: new Date(book.updatedAt),
});

interface BooksState {
  items: SerializedBook[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedBook: SerializedBook | null;
}

const initialState: BooksState = {
  items: [],
  status: 'idle',
  error: null,
  selectedBook: null,
};

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
  const response = await getBooks();
  return response.map(serializeBook);
});

export const addBook = createAsyncThunk('books/addBook', async (book: Book) => {
  const response = await createBook(book);
  return serializeBook(response);
});

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSelectedBook: (
      state,
      action: PayloadAction<Book | SerializedBook | null>
    ) => {
      if (action.payload) {
        if (typeof action.payload.createdAt === 'string') {
          state.selectedBook = action.payload as SerializedBook;
        } else {
          state.selectedBook = serializeBook(action.payload as Book);
        }
      } else {
        state.selectedBook = null;
      }
    },
    setBooks: (state, action: PayloadAction<SerializedBook[]>) => {
      state.items = action.payload;
      state.status = 'succeeded';
    },
  },
  extraReducers: builder => {
    builder
      // Fetch books
      .addCase(fetchBooks.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch books';
      })
      // Add book
      .addCase(addBook.pending, state => {
        state.status = 'loading';
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add book';
      });
  },
});

export const { setSelectedBook, setBooks } = booksSlice.actions;
export default booksSlice.reducer;
