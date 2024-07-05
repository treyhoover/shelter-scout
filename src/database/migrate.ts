import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { migrate as drizzleMigrate } from "drizzle-orm/neon-http/migrator";
import { env } from "@/lib/env";
import path from "node:path";
import * as schema from "./schema";
import { SQL, sql } from "drizzle-orm";

const isSql = (exp: unknown): exp is SQL => exp instanceof SQL;

export async function migrate() {
	const client = neon(env.ADMIN_DATABASE_URL);
	const db = drizzle(client);
	const migrationsFolder = path.join(__dirname, "migrations");
	const additionalSql = Object.values(schema).filter(isSql);

	await drizzleMigrate(db, { migrationsFolder });

	if (additionalSql.length > 0) {
		await db.execute(
			sql`
				DO $$
				BEGIN
					${sql.join(additionalSql, "\n")}
				END
				$$;
			`,
		);
	}
}

migrate()
	.then(() => {
		console.log("Migration complete");
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
