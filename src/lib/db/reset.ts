import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sqlClient = neon(process.env.DATABASE_URL);
const db = drizzle(sqlClient);

async function reset() {
  console.log('Dropping all tables...');

  await db.execute(sql`DROP TABLE IF EXISTS account CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS session CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS verification CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS guest CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "user" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS products CASCADE`);

  console.log('All tables dropped successfully!');
}

reset()
  .then(() => {
    console.log('Database reset complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error resetting database:', error);
    process.exit(1);
  });
