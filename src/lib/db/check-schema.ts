import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkSchema() {
  console.log('📋 Checking session and user table schemas...\n');

  try {
    // Check user table columns
    const userColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'user'
      ORDER BY ordinal_position;
    `;

    console.log('User table columns:');
    userColumns.forEach((col: any) => {
      console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });

    console.log('\n');

    // Check session table columns
    const sessionColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'session'
      ORDER BY ordinal_position;
    `;

    console.log('Session table columns:');
    sessionColumns.forEach((col: any) => {
      console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSchema()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
