import {
	pgTable,
	serial,
	varchar,
	text,
	integer,
	timestamp,
} from "drizzle-orm/pg-core";

export const pets = pgTable("pets", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	type: varchar("type", { length: 255 }).notNull(),
	breed: varchar("breed", { length: 255 }).notNull(),
	age: integer("age").notNull(),
	description: text("description").notNull(),
	location: varchar("location", { length: 255 }).notNull(),
	status: varchar("status", { length: 50 }).default("available"),
	createdAt: timestamp("created_at").defaultNow(),
});
