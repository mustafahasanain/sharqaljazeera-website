import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

/**
 * Better Auth Verification table - for email verification tokens
 */
export const verification = pgTable('verification', {
  id: varchar('id', { length: 255 }).primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;
