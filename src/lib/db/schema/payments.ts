import { pgTable, uuid, varchar, timestamp, numeric, pgEnum, jsonb, index, check } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { orders } from './orders';

/**
 * Payment method enum
 */
export const paymentMethodEnum = pgEnum('payment_method', ['zaincash', 'qicard', 'cash_on_delivery']);

/**
 * Payment status enum
 */
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'processing', 'completed', 'failed', 'refunded']);

/**
 * Payments table - order payment transactions
 */
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  method: paymentMethodEnum('method').notNull(),
  status: paymentStatusEnum('status').notNull().default('pending'),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  transactionId: varchar('transaction_id', { length: 255 }),
  gatewayResponse: jsonb('gateway_response').$type<Record<string, any>>(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  orderIdIdx: index('payments_order_id_idx').on(table.orderId),
  statusIdx: index('payments_status_idx').on(table.status),
  transactionIdIdx: index('payments_transaction_id_idx').on(table.transactionId),
  paidAtIdx: index('payments_paid_at_idx').on(table.paidAt),
  amountCheck: check('amount_positive', sql`${table.amount} > 0`),
}));

/**
 * Payments relations
 */
export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

/**
 * Zod validation schemas
 */
export const insertPaymentSchema = createInsertSchema(payments, {
  orderId: z.string().uuid('Invalid order ID'),
  method: z.enum(['zaincash', 'qicard', 'cash_on_delivery']),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'refunded']).default('pending'),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format').refine((val) => parseFloat(val) > 0, 'Amount must be positive'),
  transactionId: z.string().max(255).nullable().optional(),
  gatewayResponse: z.record(z.string(), z.unknown()).nullable().optional(),
  paidAt: z.date().nullable().optional(),
});

export const selectPaymentSchema = createSelectSchema(payments);

/**
 * TypeScript types
 */
export type Payment = typeof payments.$inferSelect;
export type NewPayment = z.infer<typeof insertPaymentSchema>;
export type PaymentMethod = 'zaincash' | 'qicard' | 'cash_on_delivery';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
