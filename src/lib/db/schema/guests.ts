import { pgTable, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Guests table - stores session-based guest users for shopping without registration
 */
export const guests = pgTable('guests', {
  id: varchar('id', { length: 255 }).primaryKey(), // session-based ID
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
}, (table) => ({
  sessionTokenIdx: index('guests_session_token_idx').on(table.sessionToken),
  expiresAtIdx: index('guests_expires_at_idx').on(table.expiresAt),
}));

/**
 * Guest relations
 */
export const guestsRelations = relations(guests, ({ many }) => ({
  carts: many('carts' as any),
}));

/**
 * Zod validation schemas
 */
export const insertGuestSchema = createInsertSchema(guests, {
  id: z.string().min(1, 'Guest ID is required'),
  sessionToken: z.string().min(1, 'Session token is required'),
  expiresAt: z.date(),
});

export const selectGuestSchema = createSelectSchema(guests);

/**
 * TypeScript types
 */
export type EcommerceGuest = typeof guests.$inferSelect;
export type NewEcommerceGuest = z.infer<typeof insertGuestSchema>;
