import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Categories table - hierarchical product categories
 * Supports nested categories with parent-child relationships
 */
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  parentId: uuid('parent_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  slugIdx: index('categories_slug_idx').on(table.slug),
  parentIdIdx: index('categories_parent_id_idx').on(table.parentId),
}));

/**
 * Category relations - supports self-referencing for nested categories
 */
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'category_parent',
  }),
  children: many(categories, {
    relationName: 'category_parent',
  }),
  products: many('products' as any),
}));

/**
 * Zod validation schemas
 */
export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  parentId: z.string().uuid('Invalid parent category ID').nullable().optional(),
});

export const selectCategorySchema = createSelectSchema(categories);

/**
 * TypeScript types
 */
export type Category = typeof categories.$inferSelect;
export type NewCategory = z.infer<typeof insertCategorySchema>;
