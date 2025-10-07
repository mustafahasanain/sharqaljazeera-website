import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Product Types table - types of networking equipment
 */
export const productTypes = pgTable('product_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  slugIdx: index('product_types_slug_idx').on(table.slug),
  nameIdx: index('product_types_name_idx').on(table.name),
}));

/**
 * Product Type relations
 */
export const productTypesRelations = relations(productTypes, ({ many }) => ({
  products: many('products' as any),
}));

/**
 * Zod validation schemas
 */
export const insertProductTypeSchema = createInsertSchema(productTypes, {
  name: z.string().min(1, 'Product type name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
});

export const selectProductTypeSchema = createSelectSchema(productTypes);

/**
 * TypeScript types
 */
export type ProductType = typeof productTypes.$inferSelect;
export type NewProductType = z.infer<typeof insertProductTypeSchema>;
