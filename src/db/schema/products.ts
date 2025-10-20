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
  decimal,
  index,
  uniqueIndex,
  json,
} from "drizzle-orm/pg-core";
import { brands } from "./brands";
import { categories } from "./categories";

// Enums - Product status enumeration
export const productStatusEnum = pgEnum("product_status", [
  "active",
  "inactive",
  "draft",
  "out_of_stock",
  "discontinued",
]);

// Product condition enumeration
export const productConditionEnum = pgEnum("product_condition", [
  "new",
  "refurbished",
  "used",
  "open_box",
]);

// Inventory policy enumeration
export const inventoryPolicyEnum = pgEnum("inventory_policy", [
  "track",
  "no_track",
  "track_but_allow_oversell",
]);

// 1. Products Table
export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    shortDescription: text("short_description"),
    status: productStatusEnum("status").default("active").notNull(),
    condition: productConditionEnum("condition").default("new").notNull(),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "restrict" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
    cost: decimal("cost", { precision: 10, scale: 2 }), // Admin only
    currency: varchar("currency", { length: 10 }).default("IQD").notNull(),
    taxable: boolean("taxable").default(true).notNull(),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }),
    weight: integer("weight"), // in grams
    dimensions: json("dimensions").$type<{
      length: number;
      width: number;
      height: number;
    }>(),
    featured: boolean("featured").default(false).notNull(),
    isNew: boolean("is_new").default(false).notNull(),
    isBestseller: boolean("is_bestseller").default(false).notNull(),
    tags: text("tags"), // Stored as comma-separated values
    hasVariants: boolean("has_variants").default(false).notNull(),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    seoKeywords: text("seo_keywords"),
    viewCount: integer("view_count").default(0).notNull(),
    favoriteCount: integer("favorite_count").default(0).notNull(),
    reviewCount: integer("review_count").default(0).notNull(),
    averageRating: decimal("average_rating", { precision: 3, scale: 2 })
      .default("0")
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    publishedAt: timestamp("published_at", { mode: "string" }),
  },
  (table) => ({
    skuIdx: uniqueIndex("products_sku_idx").on(table.sku),
    slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
    brandIdIdx: index("products_brand_id_idx").on(table.brandId),
    categoryIdIdx: index("products_category_id_idx").on(table.categoryId),
    statusIdx: index("products_status_idx").on(table.status),
    featuredIdx: index("products_featured_idx").on(table.featured),
    isNewIdx: index("products_is_new_idx").on(table.isNew),
    isBestsellerIdx: index("products_is_bestseller_idx").on(table.isBestseller),
    priceIdx: index("products_price_idx").on(table.price),
    nameIdx: index("products_name_idx").on(table.name),
    publishedAtIdx: index("products_published_at_idx").on(table.publishedAt),
  })
);

// 1a. Product relations
export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  specifications: many(productSpecifications),
  variants: many(productVariants),
  inventory: one(productInventory, {
    fields: [products.id],
    references: [productInventory.productId],
  }),
}));

// 1b. Inferred product type
export type Product = typeof products.$inferSelect;

// 1c. Product insert type
export type NewProduct = typeof products.$inferInsert;

// 2. Product Images Table
export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: varchar("alt", { length: 255 }).notNull(),
    position: integer("position").default(0).notNull(),
    isMain: boolean("is_main").default(false).notNull(),
    thumbnail: text("thumbnail"),
    variants: json("variants").$type<{
      small: string;
      medium: string;
      large: string;
    }>(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    productIdIdx: index("product_images_product_id_idx").on(table.productId),
    positionIdx: index("product_images_position_idx").on(
      table.productId,
      table.position
    ),
    isMainIdx: index("product_images_is_main_idx").on(
      table.productId,
      table.isMain
    ),
  })
);

// 2a. Product images relations
export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

// 2b. Inferred product image type
export type ProductImage = typeof productImages.$inferSelect;

// 2c. Product image insert type
export type NewProductImage = typeof productImages.$inferInsert;

// 3. Product Specifications/Attributes Table
export const productSpecifications = pgTable(
  "product_specifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    value: text("value").notNull(),
    group: varchar("group", { length: 100 }), // e.g., 'Technical', 'Physical'
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    productIdIdx: index("product_specifications_product_id_idx").on(
      table.productId
    ),
    groupIdx: index("product_specifications_group_idx").on(table.group),
    displayOrderIdx: index("product_specifications_display_order_idx").on(
      table.productId,
      table.displayOrder
    ),
  })
);

// 3a. Product specifications relations
export const productSpecificationsRelations = relations(
  productSpecifications,
  ({ one }) => ({
    product: one(products, {
      fields: [productSpecifications.productId],
      references: [products.id],
    }),
  })
);

// 3b. Inferred product specification type
export type ProductSpecification = typeof productSpecifications.$inferSelect;

// 3c. Product specification insert type
export type NewProductSpecification = typeof productSpecifications.$inferInsert;

// 4. Product Variants Table
export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    options: json("options").$type<Record<string, string>>().notNull(), // e.g., { color: 'Red', size: 'Large' }
    price: decimal("price", { precision: 10, scale: 2 }),
    compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
    image: text("image"),
    position: integer("position").default(0).notNull(),
    barcode: varchar("barcode", { length: 100 }),
    weight: integer("weight"), // in grams
    available: boolean("available").default(true).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    productIdIdx: index("product_variants_product_id_idx").on(table.productId),
    skuIdx: uniqueIndex("product_variants_sku_idx").on(table.sku),
    barcodeIdx: index("product_variants_barcode_idx").on(table.barcode),
    availableIdx: index("product_variants_available_idx").on(table.available),
    positionIdx: index("product_variants_position_idx").on(
      table.productId,
      table.position
    ),
  })
);

// 4a. Product variants relations
export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    inventory: one(variantInventory, {
      fields: [productVariants.id],
      references: [variantInventory.variantId],
    }),
  })
);

// 4b. Inferred product variant type
export type ProductVariant = typeof productVariants.$inferSelect;

// 4c. Product variant insert type
export type NewProductVariant = typeof productVariants.$inferInsert;

// 5. Product Inventory Table (for products without variants)
export const productInventory = pgTable(
  "product_inventory",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .unique()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").default(0).notNull(),
    policy: inventoryPolicyEnum("policy").default("track").notNull(),
    lowStockThreshold: integer("low_stock_threshold").default(10),
    allowBackorder: boolean("allow_backorder").default(false).notNull(),
    reserved: integer("reserved").default(0).notNull(), // Quantity in pending orders
    restockDate: timestamp("restock_date", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    productIdIdx: uniqueIndex("product_inventory_product_id_idx").on(
      table.productId
    ),
    quantityIdx: index("product_inventory_quantity_idx").on(table.quantity),
  })
);

// 5a. Product inventory relations
export const productInventoryRelations = relations(
  productInventory,
  ({ one }) => ({
    product: one(products, {
      fields: [productInventory.productId],
      references: [products.id],
    }),
  })
);

// 5b. Inferred product inventory type
export type ProductInventory = typeof productInventory.$inferSelect;

// 5c. Product inventory insert type
export type NewProductInventory = typeof productInventory.$inferInsert;

// 6. Variant Inventory Table (for products with variants)
export const variantInventory = pgTable(
  "variant_inventory",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    variantId: uuid("variant_id")
      .notNull()
      .unique()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    quantity: integer("quantity").default(0).notNull(),
    policy: inventoryPolicyEnum("policy").default("track").notNull(),
    lowStockThreshold: integer("low_stock_threshold").default(10),
    allowBackorder: boolean("allow_backorder").default(false).notNull(),
    reserved: integer("reserved").default(0).notNull(),
    restockDate: timestamp("restock_date", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    variantIdIdx: uniqueIndex("variant_inventory_variant_id_idx").on(
      table.variantId
    ),
    quantityIdx: index("variant_inventory_quantity_idx").on(table.quantity),
  })
);

// 6a. Variant inventory relations
export const variantInventoryRelations = relations(
  variantInventory,
  ({ one }) => ({
    variant: one(productVariants, {
      fields: [variantInventory.variantId],
      references: [productVariants.id],
    }),
  })
);

// 6b. Inferred variant inventory type
export type VariantInventory = typeof variantInventory.$inferSelect;

// 6c. Variant inventory insert type
export type NewVariantInventory = typeof variantInventory.$inferInsert;
