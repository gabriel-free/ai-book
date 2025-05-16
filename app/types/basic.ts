export interface Book {
  id: string;
  name: string;
  author: string;
  rating: number;
  reviews: number;
  price: number;
  year: number;
  genre: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
