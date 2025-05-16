# 📚 AI Book Explorer

A modern web application that combines AI-powered book recommendations with a user-friendly interface for exploring and managing your book collection.

## ✨ Features

- 🤖 **AI-Powered Chat Interface**

  - Get personalized book recommendations
  - Request book summaries
  - Search by genre, author, or specific criteria
  - Natural language interaction with the AI agent

- 📖 **Book Management**

  - View detailed book information
  - Add new books through an intuitive form
  - Persistent storage in database
  - Responsive design for all devices

- 🎯 **Smart Search**
  - Filter books by various criteria
  - Get AI-powered recommendations
  - Quick access to book details

## 🛠️ Tech Stack

- **Frontend**

  - Next.js 15.3.2
  - React 19.0.0
  - Redux Toolkit for state management
  - Tailwind CSS for styling

- **Backend**

  - Next.js API Routes
  - PostgreSQL Database
  - Prisma ORM

- **AI Integration**
  - LangGraph + CopilotKit
  - Groq LLM API

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Groq API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/gabriel-free/ai-book-exlporer.git
   cd ai-book-explorer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ai_book_explorer"
   GROQ_API_KEY="your-groq-api-key"
   ```

4. Initialize the database:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 📦 Database Setup

1. Create a PostgreSQL database
2. Update the DATABASE_URL in your .env file
3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Seed the database with initial data:
   ```bash
   npx prisma db seed
   ```

## 🤖 AI Integration Setup

1. Visit [Groq Console](https://console.groq.com)
2. Create a free account
3. Generate an API key
4. Add the API key to your .env file

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Modern and clean interface
- Intuitive navigation
- Real-time updates
- Smooth animations

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Project Structure

```
ai-book-explorer/
├── app/
│   ├── components/     # React components
│   ├── store/         # Redux store and slices
│   ├── actions/       # API actions
│   └── types/         # TypeScript types
├── prisma/            # Database schema and migrations
├── public/            # Static assets
└── tests/             # Test files
```

## 📝 API Documentation

### Book Endpoints

- `GET /api/books` - Get all books
- `POST /api/books` - Add a new book
- `GET /api/books/:id` - Get book details

### AI Chat Endpoints

- `POST /api/chat` - Send message to AI agent
- `GET /api/recommendations` - Get book recommendations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Groq for providing the LLM API
- CopilotKit for AI integration
- The open-source community for various tools and libraries

## 📞 Support

For support, email [your-email] or open an issue in the repository.
