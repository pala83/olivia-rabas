import { defineConfig } from "drizzle-kit";
import {
	ensureLocalDatabaseDirectory,
	resolveDatabaseConfig,
} from "./src/config/database.config.ts";

const database = resolveDatabaseConfig(process.env);
ensureLocalDatabaseDirectory(database);

/** The "turso" dialect (libsql) handles both local `file:` databases and remote Turso ones. */
export default defineConfig({
	dialect: "turso",
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dbCredentials: database,
});
