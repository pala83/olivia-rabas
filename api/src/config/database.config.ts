import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { z } from "zod";
import { InvalidDatabaseConfigError } from "./types/database-config.errors.ts";
import type { DatabaseConfig, Env } from "./types/database-config.types.ts";
import { databaseEnvSchema } from "./types/database-config.validation.ts";

export type { DatabaseConfig } from "./types/database-config.types.ts";

/** Obtiene la coneccion a libsql a partir de las variables de entorno */
export const resolveDatabaseConfig = (env: Env): DatabaseConfig => {
	const parsed = databaseEnvSchema.safeParse(env);
	if (!parsed.success) {
		throw new InvalidDatabaseConfigError(z.prettifyError(parsed.error));
	}
	return parsed.data;
};

/** Crea la carpeta que va a contener la base de datos local, en caso de que no exista */
export const ensureLocalDatabaseDirectory = ({ url }: DatabaseConfig): void => {
	if (url.startsWith("file:")) {
		mkdirSync(dirname(url.slice("file:".length)), { recursive: true });
	}
};
