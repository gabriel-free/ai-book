import { PrismaClient } from "@prisma/client";
import { Groq } from "groq-sdk";

const prisma = new PrismaClient();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type BookQuery = {
  genre?: string;
  author?: string;
  minRating?: number;
  maxRating?: number;
  minReviews?: number;
  maxReviews?: number;
  minPrice?: number;
  maxPrice?: number;
  priceRange?: "budget" | "moderate" | "premium";
  searchTerm?: string;
  quality?: "high" | "medium" | "low";
};

async function interpretQuery(text: string): Promise<BookQuery> {
  const prompt = `
    Analyze the following book recommendation request and extract structured information.
    Return a JSON object with the following fields if present:
    - genre: The book genre mentioned
    - author: The author name mentioned
    - minRating: Minimum rating if specified (scale 0-5)
    - maxRating: Maximum rating if specified (scale 0-5)
    - minReviews: Minimum number of reviews if specified (range 0-100000)
    - maxReviews: Maximum number of reviews if specified (range 0-100000)
    - minPrice: Minimum price if specified
    - maxPrice: Maximum price if specified
    - priceRange: Set to 'budget' for cheap/affordable, 'moderate' for mid-range, 'premium' for expensive/high-end
    - quality: Set to 'high' if words like 'good', 'best', 'great', 'excellent' are mentioned
    - searchTerm: Any other relevant search terms

    For quality levels:
    - 'high': minRating should be 4.0 or higher, minReviews should be 1000 or more
    - 'medium': minRating should be 3.5 or higher, minReviews should be 500 or more
    - 'low': no specific rating or review requirements

    For price ranges:
    - 'budget': maxPrice should be 15 or less
    - 'moderate': maxPrice should be between 15 and 30
    - 'premium': minPrice should be 30 or more

    Request: "${text}"

    Return only the JSON object, nothing else.
  `;

  console.log(groq)

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });
    return JSON.parse(completion.choices[0].message.content || "{}");
  } catch (err) {
    console.log(`Error while calling groq`)
    console.log(err)
    return {}
  }
}

export async function getBooks(text: string) {
  try {
    console.log(`Before interpreting`)
    // Interpret the natural language query
    const query = await interpretQuery(text);

    console.log(query)

    // Build the Prisma query based on interpreted information
    const whereClause: any = {
      AND: [],
      OR: [],
    };

    // Handle quality-based filtering
    if (query.quality === "high") {
      whereClause.AND.push(
        { rating: { gte: 4.0 } },
        { reviews: { gte: 1000 } }
      );
    } else if (query.quality === "medium") {
      whereClause.AND.push({ rating: { gte: 3.5 } }, { reviews: { gte: 500 } });
    }

    // Handle rating range
    if (query.minRating !== undefined) {
      whereClause.AND.push({ rating: { gte: query.minRating } });
    }
    if (query.maxRating !== undefined) {
      whereClause.AND.push({ rating: { lte: query.maxRating } });
    }

    // Handle review range
    if (query.minReviews !== undefined) {
      whereClause.AND.push({ reviews: { gte: query.minReviews } });
    }
    if (query.maxReviews !== undefined) {
      whereClause.AND.push({ reviews: { lte: query.maxReviews } });
    }

    // Handle price range
    if (query.priceRange === "budget") {
      whereClause.AND.push({ price: { lte: 15 } });
    } else if (query.priceRange === "moderate") {
      whereClause.AND.push({ price: { gt: 15 } }, { price: { lte: 30 } });
    } else if (query.priceRange === "premium") {
      whereClause.AND.push({ price: { gt: 30 } });
    }

    // Handle specific price requirements
    if (query.minPrice !== undefined) {
      whereClause.AND.push({ price: { gte: query.minPrice } });
    }
    if (query.maxPrice !== undefined) {
      whereClause.AND.push({ price: { lte: query.maxPrice } });
    }

    // Handle genre, author, and search term
    if (query.genre) {
      whereClause.OR.push({
        genre: { contains: query.genre, mode: "insensitive" },
      });
    }
    if (query.author) {
      whereClause.OR.push({
        author: { contains: query.author, mode: "insensitive" },
      });
    }
    if (query.searchTerm) {
      whereClause.OR.push({
        name: { contains: query.searchTerm, mode: "insensitive" },
      });
    }

    // If no specific criteria were found, search in all relevant fields
    if (whereClause.OR.length === 0) {
      whereClause.OR = [
        { name: { contains: text, mode: "insensitive" } },
        { author: { contains: text, mode: "insensitive" } },
        { genre: { contains: text, mode: "insensitive" } },
      ];
    }

    // Remove empty AND array if no conditions were added
    if (whereClause.AND.length === 0) {
      delete whereClause.AND;
    }

    const books = await prisma.book.findMany({
      where: whereClause,
      orderBy: [{ rating: "desc" }, { reviews: "desc" }],
      take: 10,
    });

    return books;
  } catch (error) {
    console.error("Error in getBooks:", error);
    throw error;
  }
}
