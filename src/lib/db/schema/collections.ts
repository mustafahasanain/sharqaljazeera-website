import { pgTable, uuid, varchar, text, boolean, timestamp, integer, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products';

/**
 * Collections table - curated product collections (e.g., "New Arrivals", "Best Sellers")
 */
export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  slugIdx: index('collections_slug_idx').on(table.slug),
  isActiveIdx: index('collections_is_active_idx').on(table.isActive),
}));

/**
 * Product Collections junction table - links products to collections
 */
export const productCollections = pgTable('product_collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  collectionId: uuid('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  productIdIdx: index('product_collections_product_id_idx').on(table.productId),
  collectionIdIdx: index('product_collections_collection_id_idx').on(table.collectionId),
  sortOrderIdx: index('product_collections_sort_order_idx').on(table.sortOrder),
  uniqueProductCollection: unique('unique_product_collection').on(table.productId, table.collectionId),
}));

/**
 * Collections relations
 */
export const collectionsRelations = relations(collections, ({ many }) => ({
  productCollections: many(productCollections),
}));

/**
 * Product Collections relations
 */
export const productCollectionsRelations = relations(productCollections, ({ one }) => ({
  product: one(products, {
    fields: [productCollections.productId],
    references: [products.id],
  }),
  collection: one(collections, {
    fields: [productCollections.collectionId],
    references: [collections.id],
  }),
}));

/**
 * Zod validation schemas
 */
export const insertCollectionSchema = createInsertSchema(collections, {
  name: z.string().min(1, 'Collection name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export const selectCollectionSchema = createSelectSchema(collections);

export const insertProductCollectionSchema = createInsertSchema(productCollections, {
  productId: z.string().uuid('Invalid product ID'),
  collectionId: z.string().uuid('Invalid collection ID'),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const selectProductCollectionSchema = createSelectSchema(productCollections);

/**
 * TypeScript types
 */
export type Collection = typeof collections.$inferSelect;
export type NewCollection = z.infer<typeof insertCollectionSchema>;
export type ProductCollection = typeof productCollections.$inferSelect;
export type NewProductCollection = z.infer<typeof insertProductCollectionSchema>;
