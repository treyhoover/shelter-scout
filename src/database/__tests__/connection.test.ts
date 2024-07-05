import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "@/lib/env";
import * as schema from "../schema";
import { eq, sql } from "drizzle-orm";
import { getUserDb } from "../client";

describe("Database Connection", () => {
	const alice = {
		id: "00000000-0000-0000-0000-000000000000",
	};

	const bob = {
		id: "11111111-1111-1111-1111-111111111111",
	};

	let db: ReturnType<typeof drizzle>;

	before(async () => {
		const client = neon(env.USER_DATABASE_URL);
		db = await drizzle(client, { schema });
	});

	after(() => {
		console.log("All tests completed");
	});

	it("should connect to the database as app_user", async () => {
		try {
			const result = await db
				.select({ count: sql<string>`cast(count(*) as text)` })
				.from(schema.shelters);

			assert.strictEqual(
				typeof result[0].count,
				"string",
				"Count should be a string",
			);
			assert.ok(
				!Number.isNaN(Number(result[0].count)),
				"Count should be convertible to a number",
			);
		} catch (error) {
			assert.fail(`Failed to connect to the database: ${error}`);
		}
	});

	it("should respect RLS policies", async () => {
		try {
			// Attempt to insert a shelter without setting the app.user_id via getUserDb
			await db.insert(schema.shelters).values({
				name: "Test Shelter",
				email: "test@example.com",
				phone: "123-456-7890",
				address: "123 Test St",
				ownerId: alice.id,
			});
			assert.fail("Insert should have failed due to RLS policy");
		} catch (error) {
			assert.ok(error, "Insert should fail due to RLS policy");
		}
	});

	it("should restrict inserting a shelter with wrong owner_id using getUserDb", async () => {
		try {
			await getUserDb({ id: alice.id }, async (db) => {
				return await db.insert(schema.shelters).values({
					name: "Another Test Shelter",
					email: "another@example.com",
					phone: "987-654-3210",
					address: "456 Test Ave",
					ownerId: bob.id,
				});
			});

			assert.fail("Insert should have failed due to mismatched owner_id");
		} catch (error) {
			assert.ok(
				error,
				"Insert should fail when owner_id does not match user id",
			);
		}

		// Verify that inserting with correct owner_id succeeds
		try {
			await getUserDb({ id: alice.id }, async (db) => {
				await db.insert(schema.shelters).values({
					name: "Correct Test Shelter",
					email: "correct@example.com",
					phone: "123-456-7890",
					address: "789 Test Blvd",
					ownerId: alice.id,
				});
			});
		} catch (error) {
			assert.fail(`Insert with correct owner_id should succeed: ${error}`);
		}

		// Clean up: Delete the inserted shelter
		await getUserDb({ id: alice.id }, async (db) => {
			await db
				.delete(schema.shelters)
				.where(eq(schema.shelters.ownerId, alice.id));
		});
	});
});
