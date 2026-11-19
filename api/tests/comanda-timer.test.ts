import { beforeEach, describe, expect, test } from "bun:test";
import {
	type ComandaService,
	createComandaService,
} from "../src/comanda/comanda.service.ts";
import { createDatabase } from "../src/db/client.ts";
import { runMigrations } from "../src/db/migrate.ts";
import { seedDatabase } from "../src/db/seed.ts";
import { OrderEventPublisher } from "../src/realtime/order-events.ts";

const MINUTE = 60_000;
const START = Date.parse("2026-11-18T12:00:00.000Z");

/** Fake clock: tests move time explicitly. */
let clock = START;
const advance = (ms: number) => {
	clock += ms;
};
const at = (ms: number) => new Date(ms).toISOString();

let service: ComandaService;

beforeEach(async () => {
	clock = START;
	const db = createDatabase({ url: ":memory:" });
	await runMigrations(db);
	await seedDatabase(db);
	service = createComandaService({
		db,
		events: new OrderEventPublisher(),
		now: () => new Date(clock),
	});
});

const newOrder = () =>
	service.create(
		JSON.stringify({
			customerName: "Mesa 1",
			items: [{ productId: 1, quantity: 1, withSalt: true }],
		}),
	);

const move = (id: number, status: string) =>
	service.changeStatus(String(id), JSON.stringify({ status }));

/** What the kitchen clock shows, in ms: frozen when delivered, running otherwise. */
const shownTimer = (order: {
	status: string;
	updatedAt: string;
	timerStartedAt: string;
}) =>
	(order.status === "FINISHED" ? Date.parse(order.updatedAt) : clock) -
	Date.parse(order.timerStartedAt);

describe("order timer (timerStartedAt / updatedAt)", () => {
	test("a new order starts its timer when it is created", async () => {
		const order = await newOrder();
		expect(order.timerStartedAt).toBe(at(START));
		expect(order.updatedAt).toBe(at(START));
		expect(order.createdAt).toBe(at(START));
	});

	test("a normal status change stamps updatedAt and keeps the timer running", async () => {
		const { id } = await newOrder();
		advance(3 * MINUTE);
		const order = await move(id, "IN_PREPARATION");
		expect(order.updatedAt).toBe(at(START + 3 * MINUTE));
		expect(order.timerStartedAt).toBe(at(START));
	});

	test("delivering freezes the timer and reopening resumes from the frozen total", async () => {
		const { id } = await newOrder();
		advance(8 * MINUTE);
		const delivered = await move(id, "FINISHED");
		expect(shownTimer(delivered)).toBe(8 * MINUTE);

		advance(5 * MINUTE); // time spent delivered must not count
		const reopened = await move(id, "IN_PREPARATION");
		expect(reopened.updatedAt).toBe(at(START + 13 * MINUTE));
		expect(reopened.timerStartedAt).toBe(at(START + 5 * MINUTE));
		expect(shownTimer(reopened)).toBe(8 * MINUTE);

		advance(2 * MINUTE);
		expect(shownTimer(reopened)).toBe(10 * MINUTE);
	});

	test("sending the current status again changes no timestamp", async () => {
		const { id } = await newOrder();
		advance(4 * MINUTE);
		const delivered = await move(id, "FINISHED");
		advance(6 * MINUTE);
		const again = await move(id, "FINISHED");
		expect(again.updatedAt).toBe(delivered.updatedAt);
		expect(again.timerStartedAt).toBe(delivered.timerStartedAt);
		expect(shownTimer(again)).toBe(4 * MINUTE);
	});
});
