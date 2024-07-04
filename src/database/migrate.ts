import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { migrate as drizzleMigrate } from "drizzle-orm/neon-http/migrator";
import { env } from "@/lib/env";
import path from "node:path";
// import { enableRls } from "./rls";

export async function migrate() {
	const client = neon(env.DATABASE_URL);
	const db = drizzle(client);
	const migrationsFolder = path.join(__dirname, "migrations");

	await drizzleMigrate(db, { migrationsFolder });
	// await enableRls();
}

migrate()
	.then(() => {
		console.log("Migration complete");
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
