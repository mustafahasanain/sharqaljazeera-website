import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkUsers() {
  console.log('📋 Checking user table...\n');

  try {
    const result = await sql`
      SELECT id, email, name, email_verified, created_at
      FROM "user"
      ORDER BY created_at DESC
      LIMIT 20;
    `;

    if (result.length === 0) {
      console.log('✓ No users found in database');
    } else {
      console.log(`Found ${result.length} users:\n`);
      result.forEach((row: any) => {
        console.log(`  - ${row.email} (${row.name}) - Created: ${row.createdAt}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
