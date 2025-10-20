import { relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uuid,
  index,
  uniqueIndex,
  json,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { products, productVariants } from "./products";

// Favorites Table (User favorites/wishlist)
export const favorites = pgTable(
  "favorites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").references(() => productVariants.id, {
      onDelete: "cascade",
    }),
    notes: json("notes").$type<string>(), // User notes about the product
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("favorites_user_id_idx").on(table.userId),
    productIdIdx: index("favorites_product_id_idx").on(table.productId),
    variantIdIdx: index("favorites_variant_id_idx").on(table.variantId),
    // Unique constraint: one product/variant combo per user
    userProductVariantIdx: uniqueIndex("favorites_user_product_variant_idx").on(
      table.userId,
      table.productId,
      table.variantId
    ),
    createdAtIdx: index("favorites_created_at_idx").on(
      table.userId,
      table.createdAt
    ),
  })
);

// Favorites relations
export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [favorites.variantId],
    references: [productVariants.id],
  }),
}));

// Inferred favorite type
export type Favorite = typeof favorites.$inferSelect;

// Favorite insert type
export type NewFavorite = typeof favorites.$inferInsert;
