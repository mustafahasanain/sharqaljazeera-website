import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PgTransaction } from "drizzle-orm/pg-core";
import { NeonQueryResultHKT } from "drizzle-orm/neon-serverless";
import { ExtractTablesWithRelations } from "drizzle-orm";
import * as schema from "@/db/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Database connection configuration
const getDatabaseUrl = (): string => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Please add it to your .env.local file."
    );
  }

  return databaseUrl;
};

// Configure Neon serverless connection
// Enables WebSocket for serverless environments
if (process.env.NODE_ENV === "production") {
  neonConfig.fetchConnectionCache = true;
}

// Create connection pool
// Uses Neon's serverless connection pooler for optimal performance
const pool = new Pool({
  connectionString: getDatabaseUrl(),
  max: 10, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection cannot be established
});

export const db = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV === "development", // Enable query logging in development
});

// Exposed for direct pool operations if needed
export { pool };

// Export schema for convenience
export { schema };

// Database connection type
export type Database = typeof db;

export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

export async function closeConnection(): Promise<void> {
  try {
    await pool.end();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error closing database connection:", error);
    throw error;
  }
}

export async function transaction<T>(
  callback: (
    tx: PgTransaction<
      NeonQueryResultHKT,
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >
  ) => Promise<T>
): Promise<T> {
  return db.transaction(callback);
}
