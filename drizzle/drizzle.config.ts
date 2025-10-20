import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  schema: "./src/db/schema/index.ts",

  // Output directory for generated migrations
  out: "./drizzle/migrations",

  // Verbose logging for debugging
  verbose: true,

  // Strict mode for type checking
  strict: true,

  // Migration options - table name & PostgreSQL schema to use
  migrations: {
    table: "drizzle_migrations",
    schema: "public",
  },
});
