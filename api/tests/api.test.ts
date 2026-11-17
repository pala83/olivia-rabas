import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import type { Server } from "bun";
import { createServer } from "../src/server.ts";

type ProductResponse = {
	id: number;
	name: string;
	category: "FOOD" | "DRINK";
	containsAlcohol: boolean | null;
	brand: string | null;
};

type OrderResponse = {
	id: number;
	customerName: string;
	notes: string | null;
	createdAt: string;
	status: string;
	items: {
		id: number;
		productId: number;
		productName: string;
		quantity: number;
		withSalt: boolean | null;
	}[];
};

let server: Server<unknown>;
let baseUrl: string;

beforeEach(async () => {
	server = await createServer({ database: { url: ":memory:" }, port: 0 });
	baseUrl = server.url.origin;
});

afterEach(async () => {
	await server.stop(true);
});

const request = (path: string, init?: RequestInit) =>
	fetch(`${baseUrl}${path}`, {
		...init,
		headers: { "Content-Type": "application/json" },
	});

const getProducts = async (): Promise<ProductResponse[]> =>
	(await request("/api/products")).json() as Promise<ProductResponse[]>;

const findProduct = (products: ProductResponse[], name: string) => {
	const product = products.find((p) => p.name === name);
	if (!product) throw new Error(`Seed product ${name} not found`);
	return product;
};

const createOrder = (body: unknown) =>
	request("/api/orders", { method: "POST", body: JSON.stringify(body) });

const createValidOrder = async (): Promise<OrderResponse> => {
	const products = await getProducts();
	const response = await createOrder({
		customerName: "Juan",
		items: [
			{
				productId: findProduct(products, "Papas").id,
				quantity: 1,
				withSalt: true,
			},
		],
	});
	return response.json() as Promise<OrderResponse>;
};

describe("GET /api/products", () => {
	test("returns the seeded catalog with category-specific attributes", async () => {
		const response = await request("/api/products");
		expect(response.status).toBe(200);

		const products = (await response.json()) as ProductResponse[];
		expect(findProduct(products, "Papas")).toMatchObject({
			category: "FOOD",
			containsAlcohol: null,
			brand: null,
		});
		expect(findProduct(products, "Rabas").category).toBe("FOOD");
		expect(
			products.some(
				(p) => p.category === "DRINK" && p.containsAlcohol === true,
			),
		).toBe(true);
		expect(
			products.some(
				(p) => p.category === "DRINK" && p.containsAlcohol === false,
			),
		).toBe(true);
		for (const drink of products.filter((p) => p.category === "DRINK")) {
			expect(drink.brand).toBeString();
		}
	});
});

describe("POST /api/orders", () => {
	test("creates an order with status ORDERED, server timestamp and items", async () => {
		const products = await getProducts();
		const papas = findProduct(products, "Papas");
		const beer = products.find((p) => p.containsAlcohol === true);
		if (!beer) throw new Error("No alcoholic drink seeded");

		const before = Date.now();
		const response = await createOrder({
			customerName: "  Juan  ",
			notes: "sin ketchup",
			items: [
				{ productId: papas.id, quantity: 2, withSalt: false },
				{ productId: beer.id, quantity: 1 },
			],
		});
		expect(response.status).toBe(201);

		const order = (await response.json()) as OrderResponse;
		expect(order).toMatchObject({
			customerName: "Juan",
			notes: "sin ketchup",
			status: "ORDERED",
		});
		expect(Date.parse(order.createdAt)).toBeGreaterThanOrEqual(before - 1000);
		expect(order.items).toEqual([
			expect.objectContaining({
				productId: papas.id,
				productName: "Papas",
				quantity: 2,
				withSalt: false,
			}),
			expect.objectContaining({
				productId: beer.id,
				quantity: 1,
				withSalt: null,
			}),
		]);

		const persisted = (await (
			await request(`/api/orders/${order.id}`)
		).json()) as OrderResponse;
		expect(persisted).toEqual(order);
	});

	test("stores notes as null when omitted", async () => {
		const order = await createValidOrder();
		expect(order.notes).toBeNull();
	});

	test.each([
		["customer name is empty", { customerName: "   " }],
		["items are empty", { items: [] }],
		["quantity is not a positive integer", { quantity: 0 }],
		["product does not exist", { productId: 9999 }],
		["withSalt is missing for food", { withSalt: undefined }],
	])("rejects with 400 when %s", async (_case, override) => {
		const products = await getProducts();
		const item = {
			productId: findProduct(products, "Rabas").id,
			quantity: 1,
			withSalt: true,
			...("productId" in override ? { productId: override.productId } : {}),
			...("quantity" in override ? { quantity: override.quantity } : {}),
			...("withSalt" in override ? { withSalt: override.withSalt } : {}),
		};
		const body = {
			customerName: "customerName" in override ? override.customerName : "Ana",
			items: "items" in override ? override.items : [item],
		};

		const response = await createOrder(body);
		expect(response.status).toBe(400);
		expect(((await response.json()) as { error: string }).error).toBeString();
		expect(await (await request("/api/orders")).json()).toEqual([]);
	});

	test("rejects with 400 when withSalt is sent for a drink", async () => {
		const products = await getProducts();
		const drink = products.find((p) => p.category === "DRINK");
		if (!drink) throw new Error("No drink seeded");

		const response = await createOrder({
			customerName: "Ana",
			items: [{ productId: drink.id, quantity: 1, withSalt: true }],
		});
		expect(response.status).toBe(400);
	});

	const food = { productId: 2, quantity: 1, withSalt: true };

	test.each([
		["the body is an array", [food]],
		["customerName is a number", { customerName: 42, items: [food] }],
		["notes is a number", { customerName: "Ana", notes: 42, items: [food] }],
		[
			"productId is a string",
			{ customerName: "Ana", items: [{ ...food, productId: "2" }] },
		],
		[
			"withSalt is not a boolean",
			{ customerName: "Ana", items: [{ ...food, withSalt: "yes" }] },
		],
	])("rejects with 400 when %s", async (_case, body) => {
		const response = await createOrder(body);
		expect(response.status).toBe(400);
		expect(((await response.json()) as { error: string }).error).toBeString();
		expect(await (await request("/api/orders")).json()).toEqual([]);
	});

	test("rejects with 400 when the body is not valid JSON", async () => {
		const response = await request("/api/orders", {
			method: "POST",
			body: "{nope",
		});
		expect(response.status).toBe(400);
	});
});

describe("GET /api/orders", () => {
	test("lists orders oldest first", async () => {
		const first = await createValidOrder();
		const second = await createValidOrder();

		const response = await request("/api/orders");
		expect(response.status).toBe(200);
		const orders = (await response.json()) as OrderResponse[];
		expect(orders.map((o) => o.id)).toEqual([first.id, second.id]);
	});

	test("returns 404 for an unknown order", async () => {
		const response = await request("/api/orders/9999");
		expect(response.status).toBe(404);
	});

	test("returns 404 for an id that is not a positive integer", async () => {
		const response = await request("/api/orders/abc");
		expect(response.status).toBe(404);
	});
});

describe("GET /api/orders/:id/items", () => {
	test("returns the items of an order", async () => {
		const order = await createValidOrder();

		const response = await request(`/api/orders/${order.id}/items`);
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual(order.items);
	});

	test("returns 404 for an unknown order", async () => {
		const response = await request("/api/orders/9999/items");
		expect(response.status).toBe(404);
	});

	test("returns 404 for an id that is not a positive integer", async () => {
		const response = await request("/api/orders/abc/items");
		expect(response.status).toBe(404);
	});
});

describe("PATCH /api/orders/:id/status", () => {
	const changeStatus = (id: number, status: unknown) =>
		request(`/api/orders/${id}/status`, {
			method: "PATCH",
			body: JSON.stringify({ status }),
		});

	test.each(["IN_PREPARATION", "DELAYED", "FINISHED", "ORDERED"])(
		"changes the status to %s and persists it",
		async (status) => {
			const order = await createValidOrder();

			const response = await changeStatus(order.id, status);
			expect(response.status).toBe(200);
			expect(((await response.json()) as OrderResponse).status).toBe(status);

			const persisted = (await (
				await request(`/api/orders/${order.id}`)
			).json()) as OrderResponse;
			expect(persisted.status).toBe(status);
			expect(persisted.createdAt).toBe(order.createdAt);
		},
	);

	test("rejects an unknown status with 400 and keeps the current one", async () => {
		const order = await createValidOrder();

		const response = await changeStatus(order.id, "COOKING");
		expect(response.status).toBe(400);

		const persisted = (await (
			await request(`/api/orders/${order.id}`)
		).json()) as OrderResponse;
		expect(persisted.status).toBe("ORDERED");
	});

	test("returns 404 for an unknown order", async () => {
		const response = await changeStatus(9999, "FINISHED");
		expect(response.status).toBe(404);
	});

	test("returns 404 for an id that is not a positive integer", async () => {
		const response = await request("/api/orders/abc/status", {
			method: "PATCH",
			body: JSON.stringify({ status: "FINISHED" }),
		});
		expect(response.status).toBe(404);
	});

	test.each([
		["the status is missing", "{}"],
		["the body is not valid JSON", "{nope"],
	])("rejects with 400 when %s", async (_case, body) => {
		const order = await createValidOrder();

		const response = await request(`/api/orders/${order.id}/status`, {
			method: "PATCH",
			body,
		});
		expect(response.status).toBe(400);
		expect(((await response.json()) as { error: string }).error).toBeString();
	});
});

describe("WebSocket /ws", () => {
	test("pushes order.created and order.status_changed events to connected clients", async () => {
		const socket = new WebSocket(`${baseUrl.replace("http", "ws")}/ws`);
		const messages: { type: string; order: OrderResponse }[] = [];
		const received = new Promise<void>((resolve) => {
			socket.addEventListener("message", (event) => {
				messages.push(JSON.parse(String(event.data)));
				if (messages.length === 2) resolve();
			});
		});
		await new Promise((resolve) => socket.addEventListener("open", resolve));

		const order = await createValidOrder();
		await request(`/api/orders/${order.id}/status`, {
			method: "PATCH",
			body: JSON.stringify({ status: "IN_PREPARATION" }),
		});
		await received;
		socket.close();

		expect(messages.map((m) => m.type)).toEqual([
			"order.created",
			"order.status_changed",
		]);
		expect(messages[0]?.order.id).toBe(order.id);
		expect(messages[1]?.order.status).toBe("IN_PREPARATION");
	});
});
