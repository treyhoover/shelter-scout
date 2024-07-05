if (typeof window !== "undefined") {
	throw new Error("This file should not be imported client-side");
}

import { loadEnvConfig } from "@next/env";
import { z } from "zod";

loadEnvConfig(process.cwd());

const nonEmptyString = z.string().min(1, "This field cannot be empty");
const nonEmptyUrl = nonEmptyString
	.url("This field must be a valid URL")
	.transform((url) => new URL(url));

const envSchema = z.object({
	ADMIN_DATABASE_URL: nonEmptyUrl,
	USER_DATABASE_URL: nonEmptyUrl,
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: nonEmptyString,
	CLERK_SECRET_KEY: nonEmptyString,
});

function parseEnv() {
	try {
		return envSchema.parse(process.env);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const missingVars = error.errors.map(
				(err) => `${err.path.join(".")}: ${err.message}`,
			);
			throw new Error(
				`Missing or invalid environment variables:\n${missingVars.join("\n")}`,
			);
		}
		throw error;
	}
}

export const env = parseEnv();
