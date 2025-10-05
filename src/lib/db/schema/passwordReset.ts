import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const passwordReset = pgTable("passwordReset", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type PasswordReset = typeof passwordReset.$inferSelect;
export type NewPasswordReset = typeof passwordReset.$inferInsert;
