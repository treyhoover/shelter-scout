import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "@/lib/env";
import * as schema from "./schema";
import { sql } from "drizzle-orm";

export async function enableRls() {
	const client = neon(env.DATABASE_URL);
	const db = drizzle(client, { schema });

	await db.execute(
		sql.raw(`
			CREATE OR REPLACE FUNCTION enable_rls_on_all_tables() RETURNS void AS $$
			DECLARE
					schema_name text;
					table_name text;
			BEGIN
					-- Loop through all tables in all schemas (except system schemas)
					FOR schema_name, table_name IN 
							SELECT schemaname, tablename 
							FROM pg_tables 
							WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
					LOOP
							-- Enable RLS on the table
							EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', schema_name, table_name);
							
							-- Create a default policy that denies all access
							EXECUTE format(
									'CREATE POLICY deny_all ON %I.%I FOR ALL USING (false)',
									schema_name, table_name
							);
							
							RAISE NOTICE 'Enabled RLS on table: %.%', schema_name, table_name;
					END LOOP;
			END;
			$$ LANGUAGE plpgsql;

      SELECT enable_rls_on_all_tables();
    `),
	);
}

if (require.main === module) {
	enableRls()
		.then(() => {
			console.log("RLS complete");
		})
		.catch((error) => {
			console.error(error);
			process.exit(1);
		});
}
