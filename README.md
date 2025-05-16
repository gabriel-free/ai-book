# AI Book Explorer

A modern web application for exploring and discovering books using AI-powered features. Built with Next.js, Prisma, and PostgreSQL.

## Features

- AI-powered book recommendations
- Book search and filtering
- User authentication
- Book ratings and reviews
- Modern, responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Redux Toolkit
- **AI Integration**: Groq SDK
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/gabriel-free/ai-book.git
   cd ai-book
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/ai_book_explorer"
   GROQ_API_KEY="your-groq-api-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
ai-book-explorer/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── store/            # Redux store configuration
│   ├── types/            # TypeScript type definitions
│   ├── actions/          # Server actions
│   └── page.tsx          # Main page component
├── prisma/                # Prisma configuration
│   └── schema.prisma     # Database schema
├── public/               # Static assets
├── lib/                  # Utility functions
└── package.json         # Project dependencies and scripts
```

## Database Schema

The application uses two main models:

### User
- id: Int (Primary Key)
- email: String (Unique)
- name: String
- createdAt: DateTime
- updatedAt: DateTime

### Book
- id: String (UUID)
- name: String
- author: String
- rating: Float
- reviews: Int
- price: Int
- year: Int
- genre: String
- createdAt: DateTime
- updatedAt: DateTime

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- Groq for providing the LLM API
- CopilotKit for AI integration
- The open-source community for various tools and libraries

## 📞 Support

For support, email gabriel.lima971025@gmail.com or open an issue in the repository.
