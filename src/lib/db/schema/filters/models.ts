import { pgTable, uuid, varchar, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Models table - product model numbers/versions
 */
export const models = pgTable('models', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
}, (table) => ({
  slugIdx: index('models_slug_idx').on(table.slug),
  sortOrderIdx: index('models_sort_order_idx').on(table.sortOrder),
}));

/**
 * Model relations
 */
export const modelsRelations = relations(models, ({ many }) => ({
  productVariants: many('product_variants' as any),
}));

/**
 * Zod validation schemas
 */
export const insertModelSchema = createInsertSchema(models, {
  name: z.string().min(1, 'Model name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const selectModelSchema = createSelectSchema(models);

/**
 * TypeScript types
 */
export type Model = typeof models.$inferSelect;
export type NewModel = z.infer<typeof insertModelSchema>;
