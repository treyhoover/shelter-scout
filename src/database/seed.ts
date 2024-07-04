import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "@/lib/env";
import * as schema from "./schema";

export async function seed() {
	const sql = neon(env.DATABASE_URL);
	const db = drizzle(sql, { schema });

	await db.insert(schema.shelters).values([
		{
			address: "123 Main St",
			email: "info@springfieldanimalshelter.org",
			name: "Springfield Animal Shelter",
			phone: "555-555-5555",
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
