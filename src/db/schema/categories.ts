import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  uuid,
  integer,
  index,
  uniqueIndex,
  json,
} from "drizzle-orm/pg-core";

// Enums - Category status enumeration
export const categoryStatusEnum = pgEnum("category_status", [
  "active",
  "inactive",
  "draft",
]);

// Categories table (with self-referential relationship for hierarchy)
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    // Self-referential foreign key for hierarchical structure
    parentId: uuid("parent_id").references((): any => categories.id, {
      onDelete: "cascade",
    }),
    level: integer("level").default(0).notNull(), // 0 for root, 1 for children, etc.
    path: json("path").$type<string[]>().default([]).notNull(), // Array of ancestor IDs
    icon: text("icon"),
    image: text("image"),
    coverImage: text("cover_image"),
    status: categoryStatusEnum("status").default("active").notNull(),
    featured: boolean("featured").default(false).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    productCount: integer("product_count").default(0).notNull(),
    showInMenu: boolean("show_in_menu").default(true).notNull(),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    seoKeywords: text("seo_keywords"), // Stored as comma-separated values
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("categories_slug_idx").on(table.slug),
    parentIdIdx: index("categories_parent_id_idx").on(table.parentId),
    levelIdx: index("categories_level_idx").on(table.level),
    statusIdx: index("categories_status_idx").on(table.status),
    featuredIdx: index("categories_featured_idx").on(table.featured),
    displayOrderIdx: index("categories_display_order_idx").on(
      table.displayOrder
    ),
    showInMenuIdx: index("categories_show_in_menu_idx").on(table.showInMenu),
    nameIdx: index("categories_name_idx").on(table.name),
  })
);

// Category relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  // Parent category (self-referential)
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_hierarchy",
  }),
  // Child categories (self-referential)
  children: many(categories, {
    relationName: "category_hierarchy",
  }),
  // Note: The products relation is defined in products.ts to avoid circular dependencies
}));

// Inferred category type from schema
export type Category = typeof categories.$inferSelect;

// Category insert type
export type NewCategory = typeof categories.$inferInsert;
