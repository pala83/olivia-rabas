import { drizzle } from "drizzle-orm/libsql";
import type { DatabaseConfig } from "../config/database.config.ts";
import { relations } from "./relations.ts";

export const createDatabase = (config: DatabaseConfig) =>
	drizzle({ connection: config, relations });

export type Database = ReturnType<typeof createDatabase>;
