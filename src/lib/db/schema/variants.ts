import { pgTable, uuid, varchar, text, integer, boolean, timestamp, numeric, real, jsonb, index, check } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products';
import { colors } from './filters/colors';
import { sizes } from './filters/sizes';
import { models } from './filters/models';
import { lengths } from './filters/lengths';

/**
 * Product Variants table - different configurations of products
 */
export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }),
  colorId: uuid('color_id').references(() => colors.id, { onDelete: 'set null' }),
  sizeId: uuid('size_id').references(() => sizes.id, { onDelete: 'set null' }),
  modelId: uuid('model_id').references(() => models.id, { onDelete: 'set null' }),
  lengthId: uuid('length_id').references(() => lengths.id, { onDelete: 'set null' }),
  inStock: integer('in_stock').notNull().default(0),
  minStockLevel: integer('min_stock_level').notNull().default(0),
  weight: real('weight'),
  dimensions: jsonb('dimensions').$type<{ length: number; width: number; height: number }>(),
  barcode: varchar('barcode', { length: 100 }),
  manufacturerPartNumber: varchar('manufacturer_part_number', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  productIdIdx: index('product_variants_product_id_idx').on(table.productId),
  skuIdx: index('product_variants_sku_idx').on(table.sku),
  colorIdIdx: index('product_variants_color_id_idx').on(table.colorId),
  sizeIdIdx: index('product_variants_size_id_idx').on(table.sizeId),
  modelIdIdx: index('product_variants_model_id_idx').on(table.modelId),
  lengthIdIdx: index('product_variants_length_id_idx').on(table.lengthId),
  inStockIdx: index('product_variants_in_stock_idx').on(table.inStock),
  priceCheck: check('price_positive', sql`${table.price} > 0`),
  inStockCheck: check('in_stock_non_negative', sql`${table.inStock} >= 0`),
  minStockLevelCheck: check('min_stock_level_non_negative', sql`${table.minStockLevel} >= 0`),
}));

/**
 * Product Images table - product and variant images
 */
export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 500 }).notNull(),
  altText: varchar('alt_text', { length: 255 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isPrimary: boolean('is_primary').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  productIdIdx: index('product_images_product_id_idx').on(table.productId),
  variantIdIdx: index('product_images_variant_id_idx').on(table.variantId),
  isPrimaryIdx: index('product_images_is_primary_idx').on(table.isPrimary),
  compositePrimaryIdx: index('product_images_product_primary_idx').on(table.productId, table.isPrimary),
}));

/**
 * Product Specifications table - technical specifications
 */
export const productSpecifications = pgTable('product_specifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  specKey: varchar('spec_key', { length: 100 }).notNull(),
  specValue: text('spec_value').notNull(),
  specUnit: varchar('spec_unit', { length: 50 }),
  specGroup: varchar('spec_group', { length: 100 }),
  sortOrder: integer('sort_order').notNull().default(0),
}, (table) => ({
  productIdIdx: index('product_specifications_product_id_idx').on(table.productId),
  specGroupIdx: index('product_specifications_spec_group_idx').on(table.specGroup),
  sortOrderIdx: index('product_specifications_sort_order_idx').on(table.sortOrder),
}));

/**
 * Product Variants relations
 */
export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  color: one(colors, {
    fields: [productVariants.colorId],
    references: [colors.id],
  }),
  size: one(sizes, {
    fields: [productVariants.sizeId],
    references: [sizes.id],
  }),
  model: one(models, {
    fields: [productVariants.modelId],
    references: [models.id],
  }),
  length: one(lengths, {
    fields: [productVariants.lengthId],
    references: [lengths.id],
  }),
  images: many(productImages),
  cartItems: many('cart_items' as any),
  orderItems: many('order_items' as any),
}));

/**
 * Product Images relations
 */
export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productImages.variantId],
    references: [productVariants.id],
  }),
}));

/**
 * Product Specifications relations
 */
export const productSpecificationsRelations = relations(productSpecifications, ({ one }) => ({
  product: one(products, {
    fields: [productSpecifications.productId],
    references: [products.id],
  }),
}));

/**
 * Zod validation schemas
 */
const dimensionsSchema = z.object({
  length: z.number().positive('Length must be positive'),
  width: z.number().positive('Width must be positive'),
  height: z.number().positive('Height must be positive'),
});

export const insertProductVariantSchema = createInsertSchema(productVariants, {
  productId: z.string().uuid('Invalid product ID'),
  sku: z.string().min(1, 'SKU is required').max(100),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').refine((val) => parseFloat(val) > 0, 'Price must be greater than 0'),
  salePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid sale price format').nullable().optional(),
  colorId: z.string().uuid('Invalid color ID').nullable().optional(),
  sizeId: z.string().uuid('Invalid size ID').nullable().optional(),
  modelId: z.string().uuid('Invalid model ID').nullable().optional(),
  lengthId: z.string().uuid('Invalid length ID').nullable().optional(),
  inStock: z.number().int().nonnegative('Stock must be non-negative').default(0),
  minStockLevel: z.number().int().nonnegative('Minimum stock level must be non-negative').default(0),
  weight: z.number().positive('Weight must be positive').nullable().optional(),
  dimensions: dimensionsSchema.nullable().optional(),
  barcode: z.string().max(100).nullable().optional(),
  manufacturerPartNumber: z.string().max(100).nullable().optional(),
});

export const selectProductVariantSchema = createSelectSchema(productVariants);

export const insertProductImageSchema = createInsertSchema(productImages, {
  productId: z.string().uuid('Invalid product ID'),
  variantId: z.string().uuid('Invalid variant ID').nullable().optional(),
  url: z.string().url('Invalid image URL').max(500),
  altText: z.string().max(255).nullable().optional(),
  sortOrder: z.number().int().nonnegative().default(0),
  isPrimary: z.boolean().default(false),
});

export const selectProductImageSchema = createSelectSchema(productImages);

export const insertProductSpecificationSchema = createInsertSchema(productSpecifications, {
  productId: z.string().uuid('Invalid product ID'),
  specKey: z.string().min(1, 'Specification key is required').max(100),
  specValue: z.string().min(1, 'Specification value is required'),
  specUnit: z.string().max(50).nullable().optional(),
  specGroup: z.string().max(100).nullable().optional(),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const selectProductSpecificationSchema = createSelectSchema(productSpecifications);

/**
 * TypeScript types
 */
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = z.infer<typeof insertProductVariantSchema>;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = z.infer<typeof insertProductImageSchema>;
export type ProductSpecification = typeof productSpecifications.$inferSelect;
export type NewProductSpecification = z.infer<typeof insertProductSpecificationSchema>;
export type Dimensions = z.infer<typeof dimensionsSchema>;
