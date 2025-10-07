import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';

/**
 * Address type enum
 */
export const addressTypeEnum = pgEnum('address_type', ['billing', 'shipping']);

/**
 * Addresses table - stores user shipping and billing addresses
 */
export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: addressTypeEnum('type').notNull(),
  line1: varchar('line1', { length: 255 }).notNull(),
  line2: varchar('line2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('addresses_user_id_idx').on(table.userId),
  isDefaultIdx: index('addresses_is_default_idx').on(table.isDefault),
}));

/**
 * Address relations
 */
export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

/**
 * Zod validation schemas
 */
export const insertAddressSchema = createInsertSchema(addresses, {
  userId: z.string().uuid('Invalid user ID'),
  type: z.enum(['billing', 'shipping']),
  line1: z.string().min(1, 'Address line 1 is required').max(255),
  line2: z.string().max(255).nullable().optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  country: z.string().min(1, 'Country is required').max(100),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  isDefault: z.boolean().default(false),
});

export const selectAddressSchema = createSelectSchema(addresses);

/**
 * TypeScript types
 */
export type Address = typeof addresses.$inferSelect;
export type NewAddress = z.infer<typeof insertAddressSchema>;
export type AddressType = 'billing' | 'shipping';
