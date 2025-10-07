import { pgTable, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './user';

/**
 * Better Auth Account table - stores authentication provider info
 */
export const account = pgTable('account', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  accountId: varchar('account_id', { length: 255 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  accessToken: varchar('access_token', { length: 500 }),
  refreshToken: varchar('refresh_token', { length: 500 }),
  idToken: varchar('id_token', { length: 2000 }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  password: varchar('password', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
