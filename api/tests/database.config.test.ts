import { describe, expect, test } from "bun:test";
import { resolveDatabaseConfig } from "../src/config/database.config.ts";

describe("resolveDatabaseConfig", () => {
	test("local target points libsql to a file URL without auth token", () => {
		expect(
			resolveDatabaseConfig({
				DB_TARGET: "local",
				LOCAL_DB_FILE: "data/test.db",
			}),
		).toEqual({
			url: "file:data/test.db",
		});
	});

	test("local is the default target and uses data/kds.db by default", () => {
		expect(resolveDatabaseConfig({})).toEqual({ url: "file:data/kds.db" });
	});

	test("empty variables fall back to the defaults", () => {
		expect(resolveDatabaseConfig({ DB_TARGET: "", LOCAL_DB_FILE: "" })).toEqual(
			{ url: "file:data/kds.db" },
		);
	});

	test("turso target uses the remote URL and auth token", () => {
		expect(
			resolveDatabaseConfig({
				DB_TARGET: "turso",
				TURSO_DATABASE_URL: "libsql://kds.turso.io",
				TURSO_AUTH_TOKEN: "token",
			}),
		).toEqual({ url: "libsql://kds.turso.io", authToken: "token" });
	});

	test.each([
		["TURSO_DATABASE_URL", { TURSO_AUTH_TOKEN: "token" }],
		["TURSO_AUTH_TOKEN", { TURSO_DATABASE_URL: "libsql://kds.turso.io" }],
	])("turso target fails when %s is missing", (missing, env) => {
		expect(() => resolveDatabaseConfig({ DB_TARGET: "turso", ...env })).toThrow(
			missing,
		);
	});

	test("an unknown target fails", () => {
		expect(() => resolveDatabaseConfig({ DB_TARGET: "postgres" })).toThrow(
			'DB_TARGET must be "local" or "turso", got "postgres"',
		);
	});
});
