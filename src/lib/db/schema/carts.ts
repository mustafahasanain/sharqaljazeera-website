import { pgTable, uuid, varchar, integer, timestamp, index, unique, check } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';
import { guests } from './guests';
import { productVariants } from './variants';

/**
 * Carts table - shopping cart for users and guests
 */
export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  guestId: varchar('guest_id', { length: 255 }).references(() => guests.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
}, (table) => ({
  userIdIdx: index('carts_user_id_idx').on(table.userId),
  guestIdIdx: index('carts_guest_id_idx').on(table.guestId),
  expiresAtIdx: index('carts_expires_at_idx').on(table.expiresAt),
}));

/**
 * Cart Items table - items in a shopping cart
 */
export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cartId: uuid('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  productVariantId: uuid('product_variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  cartIdIdx: index('cart_items_cart_id_idx').on(table.cartId),
  productVariantIdIdx: index('cart_items_product_variant_id_idx').on(table.productVariantId),
  compositeCartVariantIdx: index('cart_items_cart_variant_idx').on(table.cartId, table.productVariantId),
  uniqueCartVariant: unique('unique_cart_variant').on(table.cartId, table.productVariantId),
  quantityCheck: check('quantity_positive', sql`${table.quantity} > 0`),
}));

/**
 * Carts relations
 */
export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  guest: one(guests, {
    fields: [carts.guestId],
    references: [guests.id],
  }),
  items: many(cartItems),
}));

/**
 * Cart Items relations
 */
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  productVariant: one(productVariants, {
    fields: [cartItems.productVariantId],
    references: [productVariants.id],
  }),
}));

/**
 * Zod validation schemas
 */
export const insertCartSchema = createInsertSchema(carts, {
  userId: z.string().uuid('Invalid user ID').nullable().optional(),
  guestId: z.string().nullable().optional(),
  expiresAt: z.date().nullable().optional(),
}).refine(
  (data) => data.userId || data.guestId,
  { message: 'Either userId or guestId must be provided' }
);

export const selectCartSchema = createSelectSchema(carts);

export const insertCartItemSchema = createInsertSchema(cartItems, {
  cartId: z.string().uuid('Invalid cart ID'),
  productVariantId: z.string().uuid('Invalid product variant ID'),
  quantity: z.number().int().positive('Quantity must be positive').default(1),
});

export const selectCartItemSchema = createSelectSchema(cartItems);

/**
 * TypeScript types
 */
export type Cart = typeof carts.$inferSelect;
export type NewCart = z.infer<typeof insertCartSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = z.infer<typeof insertCartItemSchema>;
