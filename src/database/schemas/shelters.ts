import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const shelters = pgTable("shelters", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	phone: varchar("phone", { length: 15 }).notNull(),
	address: text("address").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});
