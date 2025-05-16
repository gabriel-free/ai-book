'use server';

import { prisma } from '@/lib/prisma';
import { Book } from '../types/basic';

export async function getBooks() {
  try {
    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

export async function createBook(book: Book) {
  try {
    const newBook = await prisma.book.create({
      data: {
        name: book.name,
        author: book.author,
        rating: parseFloat((book as any).userRating) || 0.0,
        reviews: Number(book.reviews) || 0,
        price: Number(book.price) || 0.0,
        year: Number(book.year) || new Date().getFullYear(),
        genre: book.genre,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return newBook;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
}

export async function fetchBooks() {
  const fetchedBooks = await getBooks();
  return fetchedBooks;
}
