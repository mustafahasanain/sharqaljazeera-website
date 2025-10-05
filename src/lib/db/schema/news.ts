import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const news = pgTable("news", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  text: text("text").notNull(),
  imageUrl: text("imageUrl").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  authorId: uuid("authorId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export type News = typeof news.$inferSelect;
export type NewNews = typeof news.$inferInsert;
