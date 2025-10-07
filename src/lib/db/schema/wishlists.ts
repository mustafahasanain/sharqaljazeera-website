import { pgTable, uuid, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';
import { products } from './products';

/**
 * Wishlists table - user product wishlists
 */
export const wishlists = pgTable('wishlists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('wishlists_user_id_idx').on(table.userId),
  productIdIdx: index('wishlists_product_id_idx').on(table.productId),
  uniqueUserProduct: unique('unique_user_product').on(table.userId, table.productId),
}));

/**
 * Wishlists relations
 */
export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}));

/**
 * Zod validation schemas
 */
export const insertWishlistSchema = createInsertSchema(wishlists, {
  userId: z.string().uuid('Invalid user ID'),
  productId: z.string().uuid('Invalid product ID'),
});

export const selectWishlistSchema = createSelectSchema(wishlists);

/**
 * TypeScript types
 */
export type Wishlist = typeof wishlists.$inferSelect;
export type NewWishlist = z.infer<typeof insertWishlistSchema>;
