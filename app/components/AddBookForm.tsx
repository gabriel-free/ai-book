'use client';
import { useState } from 'react';
import clsx from 'clsx';

type AddBookFormProps = {
  onAdd: (book: any) => void;
};

export default function AddBookForm({ onAdd }: AddBookFormProps) {
  const [form, setForm] = useState({
    name: '',
    author: '',
    userRating: '',
    reviews: '',
    price: '',
    year: '',
    genre: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm({
      name: '',
      author: '',
      userRating: '',
      reviews: '',
      price: '',
      year: '',
      genre: '',
    });
  };

  return (
    <div className={clsx('w-full max-w-md')}>
      <h2 className={clsx('text-2xl font-bold mb-6 text-gray-800')}>Add New Book</h2>
      <form onSubmit={handleSubmit} className={clsx('space-y-4')}>
        <div className={clsx('space-y-4')}>
          <div>
            <label
              htmlFor="name"
              className={clsx('block text-sm font-medium text-gray-700 mb-1')}
            >
              Book Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={clsx(
                'w-full px-4 py-2 rounded-lg bg-white border border-gray-300',
                'text-gray-900 placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
              )}
              placeholder="Enter book name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className={clsx('block text-sm font-medium text-gray-700 mb-1')}
            >
              Author
            </label>
            <input
              id="author"
              name="author"
              value={form.author}
              onChange={handleChange}
              className={clsx(
                'w-full px-4 py-2 rounded-lg bg-white border border-gray-300',
                'text-gray-900 placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
              )}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className={clsx('grid grid-cols-2 gap-4')}>
            <div>
              <label
                htmlFor="userRating"
                className={clsx('block text-sm font-medium text-gray-700 mb-1')}
              >
                Rating
              </label>
              <input
                id="userRating"
                name="userRating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.userRating}
                onChange={handleChange}
                className={clsx(
                  'w-full px-4 py-2 rounded-lg bg-white border border-gray-300',
                  'text-gray-900 placeholder-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                )}
                placeholder="0.0 - 5.0"
                required
              />
            </div>

            <div>
              <label
                htmlFor="reviews"
                className={clsx('block text-sm font-medium text-gray-700 mb-1')}
              >
                Reviews
              </label>
              <input
                id="reviews"
                name="reviews"
                type="number"
                min="0"
                value={form.reviews}
                onChange={handleChange}
                className={clsx(
                  'w-full px-4 py-2 rounded-lg bg-white border border-gray-300',
                  'text-gray-900 placeholder-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                )}
                placeholder="Number of reviews"
                required
              />
            </div>
          </div>

          <div className={clsx('grid grid-cols-2 gap-4')}>
            <div>
              <label
                htmlFor="price"
                className={clsx('block text-sm font-medium text-gray-700 mb-1')}
              >
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                className={clsx(
                  'w-full px-4 py-2 rounded-lg bg-white border border-gray-300',
                  'text-gray-900 placeholder-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                )}
                placeholder="Enter price"
                required
              />
            </div>

            <div>
              <label
                htmlFor="year"
                className={clsx('block text-sm font-medium text-gray-700 mb-1')}
              >
                Year
              </label>
              <input
                id="year"
                name="year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={form.year}
                onChange={handleChange}
                className={clsx(
                  'w-full px-4 py-2 rounded-lg bg-white border border-gray-300',
                  'text-gray-900 placeholder-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                )}
                placeholder="Publication year"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="genre"
              className={clsx('block text-sm font-medium text-gray-700 mb-1')}
            >
              Genre
            </label>
            <input
              id="genre"
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className={clsx(
                'w-full px-4 py-2 rounded-lg bg-white border border-gray-300',
                'text-gray-900 placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
              )}
              placeholder="Enter genre"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={clsx(
            'w-full py-3 px-4',
            'bg-gradient-to-r from-blue-500 to-blue-600',
            'hover:from-blue-400 hover:to-blue-500',
            'text-white font-medium rounded-lg',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'shadow-lg hover:shadow-blue-500/25'
          )}
        >
          Add Book
        </button>
      </form>
    </div>
  );
}
