import { pgTable, uuid, varchar, text, boolean, timestamp, numeric, integer, pgEnum, index, check } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Discount type enum
 */
export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed']);

/**
 * Coupons table - discount coupons for orders
 */
export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description'),
  discountType: discountTypeEnum('discount_type').notNull(),
  discountValue: numeric('discount_value', { precision: 10, scale: 2 }).notNull(),
  minimumPurchase: numeric('minimum_purchase', { precision: 10, scale: 2 }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  maxUsage: integer('max_usage'),
  usedCount: integer('used_count').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  codeIdx: index('coupons_code_idx').on(table.code),
  isActiveIdx: index('coupons_is_active_idx').on(table.isActive),
  expiresAtIdx: index('coupons_expires_at_idx').on(table.expiresAt),
  discountValueCheck: check('discount_value_positive', sql`${table.discountValue} > 0`),
  minimumPurchaseCheck: check('minimum_purchase_non_negative', sql`${table.minimumPurchase} IS NULL OR ${table.minimumPurchase} >= 0`),
  usedCountCheck: check('used_count_non_negative', sql`${table.usedCount} >= 0`),
  maxUsageCheck: check('max_usage_positive', sql`${table.maxUsage} IS NULL OR ${table.maxUsage} > 0`),
}));

/**
 * Coupons relations
 */
export const couponsRelations = relations(coupons, ({ many }) => ({}));

/**
 * Zod validation schemas
 */
export const insertCouponSchema = createInsertSchema(coupons, {
  code: z.string().min(1, 'Coupon code is required').max(50).toUpperCase(),
  description: z.string().nullable().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid discount value format').refine((val) => parseFloat(val) > 0, 'Discount value must be positive'),
  minimumPurchase: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid minimum purchase format').refine((val) => parseFloat(val) >= 0, 'Minimum purchase must be non-negative').nullable().optional(),
  expiresAt: z.date().nullable().optional(),
  maxUsage: z.number().int().positive('Max usage must be positive').nullable().optional(),
  usedCount: z.number().int().nonnegative('Used count must be non-negative').default(0),
  isActive: z.boolean().default(true),
});

export const selectCouponSchema = createSelectSchema(coupons);

/**
 * TypeScript types
 */
export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = z.infer<typeof insertCouponSchema>;
export type DiscountType = 'percentage' | 'fixed';
