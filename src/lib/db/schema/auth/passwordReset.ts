import { pgTable, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './user';

/**
 * Password Reset table - for password reset tokens
 */
export const passwordReset = pgTable('passwordReset', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('password_reset_user_id_idx').on(table.userId),
  tokenIdx: index('password_reset_token_idx').on(table.token),
  expiresAtIdx: index('password_reset_expires_at_idx').on(table.expiresAt),
}));

export const passwordResetRelations = relations(passwordReset, ({ one }) => ({
  user: one(user, {
    fields: [passwordReset.userId],
    references: [user.id],
  }),
}));

export type PasswordReset = typeof passwordReset.$inferSelect;
export type NewPasswordReset = typeof passwordReset.$inferInsert;
