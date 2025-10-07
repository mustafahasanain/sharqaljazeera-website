import { pgTable, uuid, varchar, text, integer, timestamp, numeric, pgEnum, index, check } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';
import { addresses } from './addresses';
import { productVariants } from './variants';

/**
 * Order status enum
 */
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
]);

/**
 * Orders table - customer orders
 */
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  guestEmail: varchar('guest_email', { length: 255 }),
  status: orderStatusEnum('status').notNull().default('pending'),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  shippingCost: numeric('shipping_cost', { precision: 10, scale: 2 }).notNull().default('0'),
  taxAmount: numeric('tax_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: uuid('shipping_address_id').notNull().references(() => addresses.id, { onDelete: 'restrict' }),
  billingAddressId: uuid('billing_address_id').notNull().references(() => addresses.id, { onDelete: 'restrict' }),
  shippingMethod: varchar('shipping_method', { length: 100 }),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  orderNumberIdx: index('orders_order_number_idx').on(table.orderNumber),
  userIdIdx: index('orders_user_id_idx').on(table.userId),
  statusIdx: index('orders_status_idx').on(table.status),
  createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
  userCreatedAtIdx: index('orders_user_created_at_idx').on(table.userId, table.createdAt),
  subtotalCheck: check('subtotal_non_negative', sql`${table.subtotal} >= 0`),
  shippingCostCheck: check('shipping_cost_non_negative', sql`${table.shippingCost} >= 0`),
  taxAmountCheck: check('tax_amount_non_negative', sql`${table.taxAmount} >= 0`),
  totalAmountCheck: check('total_amount_positive', sql`${table.totalAmount} > 0`),
}));

/**
 * Order Items table - individual items in an order
 */
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productVariantId: uuid('product_variant_id').notNull().references(() => productVariants.id, { onDelete: 'restrict' }),
  productName: varchar('product_name', { length: 255 }).notNull(),
  variantSku: varchar('variant_sku', { length: 100 }).notNull(),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: numeric('price_at_purchase', { precision: 10, scale: 2 }).notNull(),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  orderIdIdx: index('order_items_order_id_idx').on(table.orderId),
  productVariantIdIdx: index('order_items_product_variant_id_idx').on(table.productVariantId),
  quantityCheck: check('quantity_positive', sql`${table.quantity} > 0`),
  priceCheck: check('price_at_purchase_non_negative', sql`${table.priceAtPurchase} >= 0`),
  subtotalCheck: check('subtotal_non_negative', sql`${table.subtotal} >= 0`),
}));

/**
 * Orders relations
 */
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
    relationName: 'shipping_address',
  }),
  billingAddress: one(addresses, {
    fields: [orders.billingAddressId],
    references: [addresses.id],
    relationName: 'billing_address',
  }),
  items: many(orderItems),
  payments: many('payments' as any),
}));

/**
 * Order Items relations
 */
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  productVariant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
}));

/**
 * Zod validation schemas
 */
export const insertOrderSchema = createInsertSchema(orders, {
  orderNumber: z.string().min(1, 'Order number is required').max(50),
  userId: z.string().uuid('Invalid user ID').nullable().optional(),
  guestEmail: z.string().email('Invalid email').nullable().optional(),
  status: z.enum(['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded']).default('pending'),
  subtotal: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid subtotal format').refine((val) => parseFloat(val) >= 0, 'Subtotal must be non-negative'),
  shippingCost: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid shipping cost format').refine((val) => parseFloat(val) >= 0, 'Shipping cost must be non-negative').default('0'),
  taxAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid tax amount format').refine((val) => parseFloat(val) >= 0, 'Tax amount must be non-negative').default('0'),
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid total amount format').refine((val) => parseFloat(val) > 0, 'Total amount must be positive'),
  shippingAddressId: z.string().uuid('Invalid shipping address ID'),
  billingAddressId: z.string().uuid('Invalid billing address ID'),
  shippingMethod: z.string().max(100).nullable().optional(),
  trackingNumber: z.string().max(100).nullable().optional(),
  notes: z.string().nullable().optional(),
}).refine(
  (data) => data.userId || data.guestEmail,
  { message: 'Either userId or guestEmail must be provided' }
);

export const selectOrderSchema = createSelectSchema(orders);

export const insertOrderItemSchema = createInsertSchema(orderItems, {
  orderId: z.string().uuid('Invalid order ID'),
  productVariantId: z.string().uuid('Invalid product variant ID'),
  productName: z.string().min(1, 'Product name is required').max(255),
  variantSku: z.string().min(1, 'Variant SKU is required').max(100),
  quantity: z.number().int().positive('Quantity must be positive'),
  priceAtPurchase: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').refine((val) => parseFloat(val) >= 0, 'Price must be non-negative'),
  subtotal: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid subtotal format').refine((val) => parseFloat(val) >= 0, 'Subtotal must be non-negative'),
});

export const selectOrderItemSchema = createSelectSchema(orderItems);

/**
 * TypeScript types
 */
export type Order = typeof orders.$inferSelect;
export type NewOrder = z.infer<typeof insertOrderSchema>;
export type OrderStatus = 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = z.infer<typeof insertOrderItemSchema>;
