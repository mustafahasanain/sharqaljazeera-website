import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * User role enum - defines access levels for users
 */
export const userRoleEnum = pgEnum('user_role', ['customer', 'admin', 'staff']);

/**
 * Users table - stores registered user accounts
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  emailVerified: boolean('email_verified').notNull().default(false),
  role: userRoleEnum('role').notNull().default('customer'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
  isActiveIdx: index('users_is_active_idx').on(table.isActive),
  createdAtIdx: index('users_created_at_idx').on(table.createdAt),
}));

/**
 * User relations
 */
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many('addresses' as any),
  orders: many('orders' as any),
  carts: many('carts' as any),
  wishlists: many('wishlists' as any),
}));

/**
 * Zod validation schemas
 */
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email('Invalid email address'),
  passwordHash: z.string().min(1, 'Password hash is required'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().max(20).nullable().optional(),
  emailVerified: z.boolean().default(false),
  role: z.enum(['customer', 'admin', 'staff']).default('customer'),
  isActive: z.boolean().default(true),
});

export const selectUserSchema = createSelectSchema(users);

/**
 * TypeScript types
 */
export type EcommerceUser = typeof users.$inferSelect;
export type NewEcommerceUser = z.infer<typeof insertUserSchema>;
export type UserRole = 'customer' | 'admin' | 'staff';
