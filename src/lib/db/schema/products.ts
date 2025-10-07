import { pgTable, uuid, varchar, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { categories } from './categories';
import { productTypes } from './filters/product-types';
import { brands } from './filters/brands';

/**
 * Products table - main product information
 */
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'restrict' }),
  productTypeId: uuid('product_type_id').notNull().references(() => productTypes.id, { onDelete: 'restrict' }),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'restrict' }),
  isPublished: boolean('is_published').notNull().default(false),
  defaultVariantId: uuid('default_variant_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  categoryIdIdx: index('products_category_id_idx').on(table.categoryId),
  productTypeIdIdx: index('products_product_type_id_idx').on(table.productTypeId),
  brandIdIdx: index('products_brand_id_idx').on(table.brandId),
  isPublishedIdx: index('products_is_published_idx').on(table.isPublished),
  createdAtIdx: index('products_created_at_idx').on(table.createdAt),
}));

/**
 * Product relations
 */
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  productType: one(productTypes, {
    fields: [products.productTypeId],
    references: [productTypes.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  defaultVariant: one('product_variants' as any, {
    fields: [products.defaultVariantId],
    references: ['id' as any],
    relationName: 'default_variant',
  }),
  variants: many('product_variants' as any),
  images: many('product_images' as any),
  specifications: many('product_specifications' as any),
  wishlists: many('wishlists' as any),
  productCollections: many('product_collections' as any),
}));

/**
 * Zod validation schemas
 */
export const insertProductSchema = createInsertSchema(products, {
  name: z.string().min(1, 'Product name is required').max(255),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().uuid('Invalid category ID'),
  productTypeId: z.string().uuid('Invalid product type ID'),
  brandId: z.string().uuid('Invalid brand ID'),
  isPublished: z.boolean().default(false),
  defaultVariantId: z.string().uuid('Invalid default variant ID').nullable().optional(),
});

export const selectProductSchema = createSelectSchema(products);

/**
 * TypeScript types
 */
export type Product = typeof products.$inferSelect;
export type NewProduct = z.infer<typeof insertProductSchema>;
