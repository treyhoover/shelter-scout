import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "@/lib/env";
import * as schema from "./schema";
import { sql } from "drizzle-orm";

export async function initDb() {
	const client = neon(env.ADMIN_DATABASE_URL);
	const db = drizzle(client, { schema });

	db.execute(
		sql.raw(`
      DO $$
			BEGIN
					-- Drop the role if it exists
					DROP ROLE IF EXISTS ${env.USER_DATABASE_USERNAME};

					-- Create the new role
					CREATE ROLE ${env.USER_DATABASE_USERNAME} WITH LOGIN PASSWORD '${env.USER_DATABASE_PASSWORD}';

					-- Grant necessary permissions
					GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${env.USER_DATABASE_USERNAME};
					GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${env.USER_DATABASE_USERNAME};
			END
			$$;
		`),
	);
}

if (require.main === module) {
	initDb()
		.then(() => {
			console.log("Db initialization complete");
		})
		.catch((error) => {
			console.error(error);
			process.exit(1);
		});
}
