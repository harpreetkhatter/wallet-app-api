import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

// If DATABASE_URL is not set, export a placeholder tagged-template function
// so importing modules don't crash at startup. Attempting to use the DB while
// it's not configured will throw a clear error.
export const sql = databaseUrl
  ? neon(databaseUrl)
  : (strings, ...values) => {
    throw new Error(
      "No DATABASE_URL set; database operations are disabled. Set DATABASE_URL in your environment to enable DB."
    );
  };

export async function initDB() {
  if (!databaseUrl) {
    console.warn("DATABASE_URL not set; skipping database initialization.");
    return;
  }

  try {
    console.log("Attempting to connect to Neon database...");
    await sql`SELECT 1`; // Simple connection test
    console.log("Database connection successful!");

    await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(100) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    console.warn("Database connection failed - server will continue without database functionality");
    // Don't crash the server, just continue without DB
  }
}
