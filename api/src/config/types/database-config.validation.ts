import { z } from "zod";

const DEFAULT_LOCAL_DB_FILE = "data/kds.db";

/** Empty variables (e.g. `TURSO_AUTH_TOKEN=` in `.env`) count as unset. */
const optionalVariable = z
	.string()
	.optional()
	.transform((value) => value || undefined);

const requiredForTurso = (name: string) =>
	z
		.string({ error: `${name} is required when DB_TARGET=turso` })
		.min(1, { error: `${name} is required when DB_TARGET=turso` });

const localSchema = z
	.object({
		DB_TARGET: z.literal("local"),
		LOCAL_DB_FILE: optionalVariable,
	})
	.transform(({ LOCAL_DB_FILE }) => ({
		url: `file:${LOCAL_DB_FILE ?? DEFAULT_LOCAL_DB_FILE}`,
	}));

const tursoSchema = z
	.object({
		DB_TARGET: z.literal("turso"),
		TURSO_DATABASE_URL: requiredForTurso("TURSO_DATABASE_URL"),
		TURSO_AUTH_TOKEN: requiredForTurso("TURSO_AUTH_TOKEN"),
	})
	.transform(({ TURSO_DATABASE_URL, TURSO_AUTH_TOKEN }) => ({
		url: TURSO_DATABASE_URL,
		authToken: TURSO_AUTH_TOKEN,
	}));

const targetSchema = optionalVariable.pipe(
	z
		.enum(["local", "turso"], {
			error: (issue) =>
				`DB_TARGET must be "local" or "turso", got "${String(issue.input)}"`,
		})
		.default("local"),
);

/**
 * Picks the database from the environment:
 * - `DB_TARGET=local` (default): SQLite file at `LOCAL_DB_FILE`.
 * - `DB_TARGET=turso`: remote Turso database at `TURSO_DATABASE_URL` with `TURSO_AUTH_TOKEN`.
 */
export const databaseEnvSchema = z
	.object({ DB_TARGET: targetSchema })
	.loose()
	.pipe(z.discriminatedUnion("DB_TARGET", [localSchema, tursoSchema]));
