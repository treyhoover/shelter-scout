import { env } from "@/lib/env";
import { Pool } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const pool = new Pool({ connectionString: env.USER_DATABASE_URL });
const db = drizzle(pool, { schema });

export type DbUser = {
	id: string;
};

export async function getUserDb<T>(
	user: DbUser,
	cb: (db: NeonDatabase<typeof schema>) => T | Promise<T>,
): Promise<T> {
	return db.transaction(async (tx) => {
		await tx.execute(sql`SELECT set_config('app.user.id', ${user.id}, true)`);

		// Execute the callback within the same transaction
		return await cb(tx);
	});
}
