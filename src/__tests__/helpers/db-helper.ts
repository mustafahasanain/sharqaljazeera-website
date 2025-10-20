import { db, pool, testConnection } from "@/lib/db";
import { sql } from "drizzle-orm";
import * as schema from "@/db/schema";

/**
 * Initialize test database connection
 */
export async function initializeTestDatabase(): Promise<void> {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Failed to connect to test database");
    }
  } catch (error) {
    console.error("Failed to initialize test database:", error);
    throw error;
  }
}

/**
 * Clean up test database - truncate all tables
 */
export async function cleanupTestDatabase(): Promise<void> {
  try {
    // Delete in order - child tables first to respect foreign key constraints
    const tables = [
      // Order matters - child tables first
      schema.shipmentTrackingEvents,
      schema.shipments,
      schema.orderStatusHistory,
      schema.orderItems,
      schema.payments,
      schema.orders,
      schema.favorites,
      schema.cartItems,
      schema.carts,
      schema.variantInventory,
      schema.productInventory,
      schema.productVariants,
      schema.productSpecifications,
      schema.productImages,
      schema.products,
      schema.categories,
      schema.brands,
      schema.userActivity,
      schema.userPreferences,
      schema.addresses,
      schema.verificationTokens,
      schema.sessions,
      schema.accounts,
      schema.users,
    ];

    for (const table of tables) {
      try {
        await db.delete(table);
      } catch (error: any) {
        // Silently ignore errors - tables may be empty or have dependencies
      }
    }
  } catch (error) {
    console.error("Failed to cleanup test database:", error);
    throw error;
  }
}

/**
 * Truncate specific tables
 * Automatically handles foreign key constraints by deleting in the correct order
 */
export async function truncateTables(
  tables: Array<keyof typeof schema>
): Promise<void> {
  // Define proper deletion order (child tables first)
  const deletionOrder: Array<keyof typeof schema> = [
    "shipmentTrackingEvents",
    "shipments",
    "orderStatusHistory",
    "orderItems",
    "payments",
    "orders",
    "favorites",
    "cartItems",
    "carts",
    "variantInventory",
    "productInventory",
    "productVariants",
    "productSpecifications",
    "productImages",
    "products",
    "categories",
    "brands",
    "userActivity",
    "userPreferences",
    "addresses",
    "verificationTokens",
    "sessions",
    "accounts",
    "users",
  ];

  // Filter to only include requested tables in proper order
  const tablesToDelete = deletionOrder.filter((table) => tables.includes(table));

  // Delete in order
  for (const tableName of tablesToDelete) {
    const table = schema[tableName];
    if (table) {
      try {
        await db.delete(table);
      } catch (error: any) {
        // Only warn for actual errors, not empty table scenarios
        if (error?.message && !error.message.includes("violates foreign key")) {
          // Silently ignore
        }
      }
    }
  }
}

/**
 * Get count of records in a table
 */
export async function getTableCount(tableName: keyof typeof schema): Promise<number> {
  const table = schema[tableName];
  if (!table) {
    throw new Error(`Table ${tableName} not found in schema`);
  }

  const result = await db.select().from(table);
  return result.length;
}

/**
 * Check if a table exists
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = ${tableName}
      );
    `);
    return result.rows[0]?.exists === true;
  } catch (error) {
    return false;
  }
}

/**
 * Get all columns for a table
 */
export async function getTableColumns(tableName: string): Promise<string[]> {
  const result = await db.execute(sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = ${tableName}
    ORDER BY ordinal_position;
  `);

  return result.rows.map((row: any) => row.column_name);
}

/**
 * Check if an index exists
 */
export async function indexExists(indexName: string): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM pg_indexes
        WHERE schemaname = 'public'
        AND indexname = ${indexName}
      );
    `);
    return result.rows[0]?.exists === true;
  } catch (error) {
    return false;
  }
}

/**
 * Get all indexes for a table
 */
export async function getTableIndexes(tableName: string): Promise<string[]> {
  const result = await db.execute(sql`
    SELECT indexname
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename = ${tableName};
  `);

  return result.rows.map((row: any) => row.indexname);
}

/**
 * Close database connection
 */
export async function closeTestDatabase(): Promise<void> {
  await pool.end();
}
