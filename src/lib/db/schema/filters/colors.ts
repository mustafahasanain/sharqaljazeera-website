import { pgTable, uuid, varchar, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Colors table - product color options
 */
export const colors = pgTable('colors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  hexCode: varchar('hex_code', { length: 7 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
}, (table) => ({
  slugIdx: index('colors_slug_idx').on(table.slug),
  sortOrderIdx: index('colors_sort_order_idx').on(table.sortOrder),
}));

/**
 * Color relations
 */
export const colorsRelations = relations(colors, ({ many }) => ({
  productVariants: many('product_variants' as any),
}));

/**
 * Zod validation schemas
 */
export const insertColorSchema = createInsertSchema(colors, {
  name: z.string().min(1, 'Color name is required').max(50),
  slug: z.string().min(1, 'Slug is required').max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  hexCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex code format'),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const selectColorSchema = createSelectSchema(colors);

/**
 * TypeScript types
 */
export type Color = typeof colors.$inferSelect;
export type NewColor = z.infer<typeof insertColorSchema>;
