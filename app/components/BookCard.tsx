import React from 'react';
import { Book } from '../types/basic';

export default function BookCard({
  book,
  onClick,
}: {
  book: Book;
  onClick: () => void;
}) {
  return (
    <div
      className="border border-neutral-800 rounded-lg p-4 shadow bg-neutral-900 hover:bg-neutral-800 cursor-pointer transition text-white"
      onClick={onClick}
    >
      <h2 className="font-bold text-lg mb-1 text-white">{book.name}</h2>
      <p className="mb-2 text-neutral-300">{book.author}</p>
      <div className="flex flex-wrap gap-3 text-sm mb-2 text-neutral-200">
        <span>⭐ {book.rating}</span>
        <span>Reviews: {book.reviews}</span>
        <span>Year: {book.year}</span>
        <span>Genre: {book.genre}</span>
      </div>
      <div className="text-right font-semibold text-white">${book.price}</div>
    </div>
  );
}
