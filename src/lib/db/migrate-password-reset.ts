import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";

async function migratePasswordReset() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }

    console.log("Updating passwordReset table...");

    const sqlClient = neon(process.env.DATABASE_URL);
    const db = drizzle(sqlClient);

    // Check if code column exists
    const codeColumnExists = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'passwordReset' AND column_name = 'code'
    `);

    if (codeColumnExists.rows.length > 0) {
      console.log("Renaming 'code' column to 'token'...");

      // Rename code to token
      await db.execute(sql`
        ALTER TABLE "passwordReset" RENAME COLUMN "code" TO "token";
      `);

      // Add unique constraint to token
      await db.execute(sql`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'passwordReset_token_unique'
          ) THEN
            ALTER TABLE "passwordReset" ADD CONSTRAINT "passwordReset_token_unique" UNIQUE ("token");
          END IF;
        END $$;
      `);

      console.log("✓ passwordReset table updated successfully!");
    } else {
      console.log("Table already up to date.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migratePasswordReset();
