import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const images = pgTable("images", {
	id: uuid("id").defaultRandom().primaryKey(),
	url: varchar("url", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").default(sql`now()`),
});
