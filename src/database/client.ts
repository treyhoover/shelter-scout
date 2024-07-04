import { env } from "@/lib/env";
import { Pool } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const pool = new Pool({ connectionString: env.DATABASE_URL });

export const adminDb = drizzle(pool, { schema });

type Db = typeof adminDb;

export type DbUser = {
	id: string;
};

export async function getUserDb<T>(
	user: DbUser,
	cb: (db: Db) => T | Promise<T>,
): Promise<T> {
	return adminDb.transaction(async (tx) => {
		await tx.execute(sql.raw(`SET LOCAL user.id = '${user.id}'`));
		await tx.execute(sql.raw(`SET role 'user'`));

		return cb(adminDb);
	});
}
