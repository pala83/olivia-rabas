import { expect, test } from "bun:test";
import { createServer } from "../src/server.ts";

test("createServer({ migrate: false }) leaves the database untouched", async () => {
	// An empty database is never migrated, so seeding the catalog finds no PRODUCTO table.
	const starting = createServer({
		database: { url: ":memory:" },
		port: 0,
		migrate: false,
	});
	await expect(starting).rejects.toThrow(/PRODUCTO/);
});
