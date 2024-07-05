import { sql } from "drizzle-orm";
import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const shelters = pgTable("shelters", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	phone: varchar("phone", { length: 15 }).notNull(),
	address: text("address").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	ownerId: uuid("owner_id").notNull(),
});

export const sheltersRlsPolicy = sql`
	ALTER TABLE shelters ENABLE ROW LEVEL SECURITY;

	-- SELECT policy: allow all users to read all shelters
	DROP POLICY IF EXISTS select_shelter ON shelters;
	CREATE POLICY select_shelter ON shelters
			FOR SELECT USING (true);

	-- INSERT policy: only owner can insert new shelters
	DROP POLICY IF EXISTS insert_shelter ON shelters;
	CREATE POLICY insert_shelter ON shelters
			FOR INSERT WITH CHECK (owner_id = (current_setting('app.user.id'))::uuid);

	-- UPDATE policy: only owner can update their shelters
	DROP POLICY IF EXISTS update_shelter ON shelters;
	CREATE POLICY update_shelter ON shelters
			FOR UPDATE USING (owner_id = (current_setting('app.user.id'))::uuid);

	-- DELETE policy: only owner can delete their shelters
	DROP POLICY IF EXISTS delete_shelter ON shelters;
	CREATE POLICY delete_shelter ON shelters
			FOR DELETE USING (owner_id = (current_setting('app.user.id'))::uuid);
`;
