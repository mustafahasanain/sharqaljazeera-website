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
} from "drizzle-orm/pg-core";

// Enums - Brand status enumeration
export const brandStatusEnum = pgEnum("brand_status", [
  "active",
  "inactive",
  "draft",
]);

// Brands Table
export const brands = pgTable(
  "brands",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    logo: text("logo"),
    coverImage: text("cover_image"),
    status: brandStatusEnum("status").default("active").notNull(),
    featured: boolean("featured").default(false).notNull(),
    websiteUrl: text("website_url"),
    country: varchar("country", { length: 100 }),
    foundedYear: integer("founded_year"),
    productCount: integer("product_count").default(0).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
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
    slugIdx: uniqueIndex("brands_slug_idx").on(table.slug),
    statusIdx: index("brands_status_idx").on(table.status),
    featuredIdx: index("brands_featured_idx").on(table.featured),
    displayOrderIdx: index("brands_display_order_idx").on(table.displayOrder),
    nameIdx: index("brands_name_idx").on(table.name),
  })
);

// Brand relations
// Note: The products relation is defined in products.ts to avoid circular dependencies
export const brandsRelations = relations(brands, ({ many }) => ({}));

// Inferred brand type from schema
export type Brand = typeof brands.$inferSelect;

// Brand insert type
export type NewBrand = typeof brands.$inferInsert;
