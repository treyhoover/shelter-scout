import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "@/lib/env";
import * as schema from "./schema";
import { sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

const DUMMY_UUID = "00000000-0000-0000-0000-000000000000";

async function isAnyTablePopulated(db: ReturnType<typeof drizzle>) {
	const tableChecks = Object.entries(schema).map(async ([tableName, table]) => {
		if (table instanceof PgTable) {
			const result = await db
				.select({ count: sql<number>`count(*)` })
				.from(table);

			if (result[0].count > 0) {
				return { tableName, isPopulated: true };
			}
		}
		return { tableName, isPopulated: false };
	});

	const results = await Promise.all(tableChecks);

	return results.some((table) => table.isPopulated);
}

export async function seed() {
	const sql = neon(env.ADMIN_DATABASE_URL.href);
	const db = drizzle(sql, { schema });

	// Check if we're in production
	if (process.env.NODE_ENV === "production") {
		console.log("Skipping seed in production environment");
		return;
	}

	// Check if any table in our schema has data
	if (await isAnyTablePopulated(db)) {
		console.log("Data already exists in at least one table, skipping seed");
		return;
	}

	await db.insert(schema.shelters).values([
		{
			address: "123 Main St",
			email: "info@springfieldanimalshelter.org",
			name: "Springfield Animal Shelter",
			phone: "555-555-5555",
			ownerId: DUMMY_UUID,
		},
	]);
}

if (require.main === module) {
	seed()
		.then(() => {
			console.log("Seed complete");
		})
		.catch((error) => {
			console.error(error);
			process.exit(1);
		});
}
