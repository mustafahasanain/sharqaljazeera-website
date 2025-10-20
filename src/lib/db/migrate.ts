import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env.local" });

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../..");

async function runMigrations() {
  console.log("🚀 Starting database migrations...\n");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    console.error("   Please add it to your .env.local file");
    process.exit(1);
  }

  console.log("📊 Database URL:", databaseUrl.replace(/:[^:@]+@/, ":****@")); // Hide password

  // Create connection pool
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  // Create Drizzle instance
  const db = drizzle(pool);

  try {
    // Test connection
    console.log("\n🔍 Testing database connection...");
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log("✅ Database connection successful\n");

    // Run migrations
    console.log(
      "📦 Running migrations from:",
      path.join(projectRoot, "drizzle/migrations")
    );
    console.log("⏳ Please wait...\n");

    await migrate(db, {
      migrationsFolder: path.join(projectRoot, "drizzle/migrations"),
    });

    console.log("✅ Migrations completed successfully!\n");
  } catch (error) {
    console.error("\n❌ Migration failed:");
    if (error instanceof Error) {
      console.error("   Error:", error.message);
      if (error.stack) {
        console.error("\n   Stack trace:");
        console.error(error.stack);
      }
    } else {
      console.error("   Unknown error:", error);
    }
    process.exit(1);
  } finally {
    // Close connection pool
    await pool.end();
    console.log("🔌 Database connection closed\n");
  }
}

// Run migrations and handle errors
runMigrations()
  .then(() => {
    console.log("🎉 Migration process completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Unexpected error during migration:");
    console.error(error);
    process.exit(1);
  });
