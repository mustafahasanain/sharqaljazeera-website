import { pgTable, uuid, varchar, timestamp, index, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Brands table - product manufacturers/brands
 */
export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  logoUrl: varchar('logo_url', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  slugIdx: index('brands_slug_idx').on(table.slug),
  nameIdx: index('brands_name_idx').on(table.name),
}));

/**
 * Brand relations
 */
export const brandsRelations = relations(brands, ({ many }) => ({
  products: many('products' as any),
}));

/**
 * Zod validation schemas
 */
export const insertBrandSchema = createInsertSchema(brands, {
  name: z.string().min(1, 'Brand name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  logoUrl: z.string().url('Invalid logo URL').max(500).nullable().optional(),
});

export const selectBrandSchema = createSelectSchema(brands);

/**
 * TypeScript types
 */
export type Brand = typeof brands.$inferSelect;
export type NewBrand = z.infer<typeof insertBrandSchema>;
