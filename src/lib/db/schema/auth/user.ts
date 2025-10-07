import { pgTable, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Better Auth User table - for authentication
 * This is separate from the eCommerce users table
 */
export const user = pgTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: varchar('image', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  accounts: many('account' as any),
  sessions: many('session' as any),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
