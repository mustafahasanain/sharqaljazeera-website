import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  uuid,
  index,
  uniqueIndex,
  json,
} from "drizzle-orm/pg-core";

// Enums - User role enumeration
export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "admin",
  "vendor",
  "support",
]);

// User status enumeration
export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "suspended",
  "pending_verification",
]);

// Gender enumeration
export const genderEnum = pgEnum("gender", [
  "male",
  "female",
  "other",
  "prefer_not_to_say",
]);

// Address type enumeration
export const addressTypeEnum = pgEnum("address_type", [
  "home",
  "work",
  "other",
]);

// 1. Users Table - Main users table
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    phone: varchar("phone", { length: 20 }),
    phoneVerified: boolean("phone_verified").default(false).notNull(),
    passwordHash: text("password_hash").notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    avatar: text("avatar"),
    dateOfBirth: timestamp("date_of_birth", { mode: "string" }),
    gender: genderEnum("gender"),
    role: userRoleEnum("role").default("customer").notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    lastLoginAt: timestamp("last_login_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    phoneIdx: index("users_phone_idx").on(table.phone),
    roleIdx: index("users_role_idx").on(table.role),
    statusIdx: index("users_status_idx").on(table.status),
  })
);

// 1a. User relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  addresses: many(addresses),
  verificationTokens: many(verificationTokens),
}));

// 1b. Inferred user type from schema
export type User = typeof users.$inferSelect;

// 1c. User insert type
export type NewUser = typeof users.$inferInsert;

// 2. Accounts Table (OAuth providers)
// OAuth providers enumeration
export const oauthProviderEnum = pgEnum("oauth_provider", [
  "google",
  "facebook",
  "apple",
]);

// OAuth accounts table for third-party authentication
export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: oauthProviderEnum("provider").notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    expiresAt: timestamp("expires_at", { mode: "string" }),
    tokenType: varchar("token_type", { length: 50 }),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("accounts_user_id_idx").on(table.userId),
    providerAccountIdx: uniqueIndex("accounts_provider_account_idx").on(
      table.provider,
      table.providerAccountId
    ),
  })
);

// 2a- Account relations
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// 2b- Inferred account type
export type Account = typeof accounts.$inferSelect;

// 2c- Account insert type
export type NewAccount = typeof accounts.$inferInsert;

// 3. Sessions Table (User sessions)
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionToken: text("session_token").notNull().unique(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
    sessionTokenIdx: uniqueIndex("sessions_token_idx").on(table.sessionToken),
    expiresAtIdx: index("sessions_expires_at_idx").on(table.expiresAt),
  })
);

// 3a. Session relations
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// 3b. Inferred session type
export type Session = typeof sessions.$inferSelect;

// 3c. Session insert type
export type NewSession = typeof sessions.$inferInsert;

// 4. Verification Tokens Table
// Token type enumeration
export const tokenTypeEnum = pgEnum("token_type", [
  "email_verification",
  "password_reset",
  "phone_verification",
  "two_factor",
]);

// Verification tokens for email/phone verification and password reset
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    type: tokenTypeEnum("type").notNull(),
    identifier: varchar("identifier", { length: 255 }).notNull(), // email or phone
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    usedAt: timestamp("used_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    tokenIdx: uniqueIndex("verification_tokens_token_idx").on(table.token),
    identifierIdx: index("verification_tokens_identifier_idx").on(
      table.identifier
    ),
    expiresAtIdx: index("verification_tokens_expires_at_idx").on(
      table.expiresAt
    ),
  })
);

// 4a. Verification token relations
export const verificationTokensRelations = relations(
  verificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [verificationTokens.userId],
      references: [users.id],
    }),
  })
);

// 4b. Inferred verification token type
export type VerificationToken = typeof verificationTokens.$inferSelect;

// 4c. Verification token insert type
export type NewVerificationToken = typeof verificationTokens.$inferInsert;

// 5. User Addresses Table
export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: addressTypeEnum("type").default("home").notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    recipientName: varchar("recipient_name", { length: 255 }).notNull(),
    recipientPhone: varchar("recipient_phone", { length: 20 }).notNull(),
    addressLine1: text("address_line1").notNull(),
    addressLine2: text("address_line2"),
    city: varchar("city", { length: 100 }).notNull(),
    governorate: varchar("governorate", { length: 100 }).notNull(),
    district: varchar("district", { length: 100 }),
    nearestLandmark: text("nearest_landmark"),
    postalCode: varchar("postal_code", { length: 20 }),
    country: varchar("country", { length: 100 }).default("Iraq").notNull(),
    latitude: varchar("latitude", { length: 50 }),
    longitude: varchar("longitude", { length: 50 }),
    deliveryNotes: text("delivery_notes"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("addresses_user_id_idx").on(table.userId),
    governorateIdx: index("addresses_governorate_idx").on(table.governorate),
    isDefaultIdx: index("addresses_is_default_idx").on(
      table.userId,
      table.isDefault
    ),
  })
);

// 5a. Address relations
export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

// 5b. Inferred address type
export type Address = typeof addresses.$inferSelect;

// 5c. Address insert type
export type NewAddress = typeof addresses.$inferInsert;

// 6. User Preferences Table
export const userPreferences = pgTable(
  "user_preferences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    language: varchar("language", { length: 10 }).default("en").notNull(),
    currency: varchar("currency", { length: 10 }).default("IQD").notNull(),
    theme: varchar("theme", { length: 20 }).default("light"),
    notifications: json("notifications")
      .$type<{
        email: {
          orderUpdates: boolean;
          promotions: boolean;
          newsletter: boolean;
          accountActivity: boolean;
        };
        sms: {
          orderUpdates: boolean;
          promotions: boolean;
        };
        push: {
          orderUpdates: boolean;
          promotions: boolean;
          newArrivals: boolean;
        };
      }>()
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex("user_preferences_user_id_idx").on(table.userId),
  })
);

// 6a. User preferences relations
export const userPreferencesRelations = relations(
  userPreferences,
  ({ one }) => ({
    user: one(users, {
      fields: [userPreferences.userId],
      references: [users.id],
    }),
  })
);

// 6b. Inferred user preferences type
export type UserPreferences = typeof userPreferences.$inferSelect;

// 6c. User preferences insert type
export type NewUserPreferences = typeof userPreferences.$inferInsert;

// 7. User Activity Log Table
// User activity type enumeration
export const userActivityTypeEnum = pgEnum("user_activity_type", [
  "login",
  "logout",
  "password_change",
  "profile_update",
  "address_added",
  "address_updated",
  "order_placed",
  "email_verified",
  "phone_verified",
]);

// User activity log table
export const userActivity = pgTable(
  "user_activity",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: userActivityTypeEnum("type").notNull(),
    description: text("description").notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("user_activity_user_id_idx").on(table.userId),
    typeIdx: index("user_activity_type_idx").on(table.type),
    createdAtIdx: index("user_activity_created_at_idx").on(table.createdAt),
  })
);

// 7a. User activity relations
export const userActivityRelations = relations(userActivity, ({ one }) => ({
  user: one(users, {
    fields: [userActivity.userId],
    references: [users.id],
  }),
}));

// 7b. Inferred user activity type
export type UserActivity = typeof userActivity.$inferSelect;

// 7c. User activity insert type
export type NewUserActivity = typeof userActivity.$inferInsert;
