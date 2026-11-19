import { afterEach, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createClient } from "@libsql/client";
import type { Server } from "bun";
import { createServer } from "../src/server.ts";

let server: Server<unknown> | undefined;
let dir: string | undefined;

afterEach(async () => {
	await server?.stop(true);
	if (dir) rmSync(dir, { recursive: true, force: true });
});

test("updatedAt starts at createdAt and moves on every status change (stored and returned)", async () => {
	dir = mkdtempSync(join(tmpdir(), "kds-updated-at-"));
	const url = `file:${join(dir, "kds.db")}`;
	server = await createServer({ database: { url }, port: 0 });
	const base = server.url.origin;

	const created = await fetch(`${base}/api/orders`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			customerName: "Mesa 1",
			items: [{ productId: 1, quantity: 1, withSalt: true }],
		}),
	});
	expect(created.status).toBe(201);
	const order = (await created.json()) as {
		id: number;
		createdAt: string;
		updatedAt: string;
	};
	const { id } = order;
	expect(order.updatedAt).toBe(order.createdAt);

	const db = createClient({ url });
	const read = async () => {
		const [row] = (
			await db.execute({
				sql: "select created_at, updated_at from COMANDA where id = ?",
				args: [id],
			})
		).rows;
		return {
			createdAt: String(row?.created_at),
			updatedAt: String(row?.updated_at),
		};
	};

	const afterCreate = await read();
	expect(afterCreate.updatedAt).toBe(afterCreate.createdAt);

	await Bun.sleep(5);
	const changed = await fetch(`${base}/api/orders/${id}/status`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ status: "FINISHED" }),
	});
	expect(changed.status).toBe(200);
	const delivered = (await changed.json()) as { updatedAt: string };

	const afterChange = await read();
	expect(afterChange.createdAt).toBe(afterCreate.createdAt);
	expect(delivered.updatedAt).toBe(afterChange.updatedAt);
	expect(Date.parse(afterChange.updatedAt)).toBeGreaterThan(
		Date.parse(afterCreate.updatedAt),
	);
	db.close();
});
