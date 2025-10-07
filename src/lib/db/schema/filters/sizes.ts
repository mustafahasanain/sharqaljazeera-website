import { pgTable, uuid, varchar, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Sizes table - product size options (e.g., rack sizes: 4U, 8U, 12U, etc.)
 */
export const sizes = pgTable('sizes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
}, (table) => ({
  slugIdx: index('sizes_slug_idx').on(table.slug),
  sortOrderIdx: index('sizes_sort_order_idx').on(table.sortOrder),
}));

/**
 * Size relations
 */
export const sizesRelations = relations(sizes, ({ many }) => ({
  productVariants: many('product_variants' as any),
}));

/**
 * Zod validation schemas
 */
export const insertSizeSchema = createInsertSchema(sizes, {
  name: z.string().min(1, 'Size name is required').max(50),
  slug: z.string().min(1, 'Slug is required').max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const selectSizeSchema = createSelectSchema(sizes);

/**
 * TypeScript types
 */
export type Size = typeof sizes.$inferSelect;
export type NewSize = z.infer<typeof insertSizeSchema>;
