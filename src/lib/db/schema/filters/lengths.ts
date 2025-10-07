import { pgTable, uuid, varchar, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Lengths table - cable length options (e.g., 1M, 2M, 5M, 10M)
 */
export const lengths = pgTable('lengths', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
}, (table) => ({
  slugIdx: index('lengths_slug_idx').on(table.slug),
  sortOrderIdx: index('lengths_sort_order_idx').on(table.sortOrder),
}));

/**
 * Length relations
 */
export const lengthsRelations = relations(lengths, ({ many }) => ({
  productVariants: many('product_variants' as any),
}));

/**
 * Zod validation schemas
 */
export const insertLengthSchema = createInsertSchema(lengths, {
  name: z.string().min(1, 'Length name is required').max(50),
  slug: z.string().min(1, 'Slug is required').max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const selectLengthSchema = createSelectSchema(lengths);

/**
 * TypeScript types
 */
export type Length = typeof lengths.$inferSelect;
export type NewLength = z.infer<typeof insertLengthSchema>;
