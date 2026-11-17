import {
	ensureLocalDatabaseDirectory,
	resolveDatabaseConfig,
} from "./config/database.config.ts";
import { createServer } from "./server.ts";

const database = resolveDatabaseConfig(Bun.env);
ensureLocalDatabaseDirectory(database);

const server = await createServer({
	database,
	port: Number(Bun.env.PORT ?? 3000),
});

console.log(`KDS API listening on ${server.url} (database: ${database.url})`);
