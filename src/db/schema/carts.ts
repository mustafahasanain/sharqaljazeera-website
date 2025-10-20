import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  integer,
  index,
  uniqueIndex,
  json,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { products, productVariants } from "./products";

// 1. Carts Table
export const carts = pgTable(
  "carts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionId: varchar("session_id", { length: 255 }), // For guest users
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }), // For guest carts
  },
  (table) => ({
    userIdIdx: uniqueIndex("carts_user_id_idx").on(table.userId),
    sessionIdIdx: index("carts_session_id_idx").on(table.sessionId),
    expiresAtIdx: index("carts_expires_at_idx").on(table.expiresAt),
  })
);

// 1a- Cart relations
export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

// 1b- Inferred cart type
export type Cart = typeof carts.$inferSelect;

// 1c- Cart insert type
export type NewCart = typeof carts.$inferInsert;

// 2. Cart Items Table
export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").references(() => productVariants.id, {
      onDelete: "cascade",
    }),
    quantity: integer("quantity").default(1).notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>(), // Custom data, notes, etc.
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    cartIdIdx: index("cart_items_cart_id_idx").on(table.cartId),
    productIdIdx: index("cart_items_product_id_idx").on(table.productId),
    variantIdIdx: index("cart_items_variant_id_idx").on(table.variantId),
    // Unique constraint: one product/variant combo per cart
    cartProductVariantIdx: uniqueIndex(
      "cart_items_cart_product_variant_idx"
    ).on(table.cartId, table.productId, table.variantId),
  })
);

// 2a- Cart items relations
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

// 2b- Inferred cart item type
export type CartItem = typeof cartItems.$inferSelect;

// 2c- Cart item insert type
export type NewCartItem = typeof cartItems.$inferInsert;
