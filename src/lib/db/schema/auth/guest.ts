import { pgTable, varchar, timestamp, index } from 'drizzle-orm/pg-core';

/**
 * Guest sessions table - for non-authenticated shopping
 * Different from the guests table in the eCommerce schema
 */
export const guest = pgTable('guest', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  sessionTokenIdx: index('guest_session_token_idx').on(table.sessionToken),
  expiresAtIdx: index('guest_expires_at_idx').on(table.expiresAt),
}));

export type Guest = typeof guest.$inferSelect;
export type NewGuest = typeof guest.$inferInsert;
