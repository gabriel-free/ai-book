import { Book } from '../types/basic';

interface BookListProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

export default function BookList({ books, onBookClick }: BookListProps) {
  return (
    <div className="space-y-4">
      {books.map(book => (
        <div
          key={book.id}
          onClick={() => onBookClick(book)}
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          {/* Book Name */}
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {book.name}
          </h3>

          {/* Author */}
          <div className="text-gray-600 text-sm mb-2">{book.author}</div>

          {/* Rating, Reviews, Year in one line */}
          <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span>{book.rating}</span>
            </div>
            <div>{book.reviews.toLocaleString()} reviews</div>
            <div>{book.year}</div>
          </div>

          {/* Bottom row with Genre and Price */}
          <div className="flex justify-between items-center">
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
              {book.genre}
            </span>
            <span className="text-gray-800 font-medium">
              ${book.price.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
