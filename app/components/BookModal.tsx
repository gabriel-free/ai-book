import { Book } from '../types/basic';

interface BookModalProps {
  book: Book;
  onClose: () => void;
}

export default function BookModal({ book, onClose }: BookModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Book title */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">
          {book.name}
        </h2>

        {/* Book details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Author</span>
            <span className="text-gray-800">{book.author}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Rating</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-800">{book.rating}</span>
              <span className="text-yellow-400">★</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Reviews</span>
            <span className="text-gray-800">
              {book.reviews.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Price</span>
            <span className="text-gray-800">${book.price.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Year</span>
            <span className="text-gray-800">{book.year}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Genre</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {book.genre}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
