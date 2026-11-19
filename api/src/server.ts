import { comandaController } from "./comanda/comanda.controller.ts";
import { createComandaService } from "./comanda/comanda.service.ts";
import type { DatabaseConfig } from "./config/database.config.ts";
import { createDatabase } from "./db/client.ts";
import { seedDatabase } from "./db/seed.ts";
import { itemComandaController } from "./item-comanda/item-comanda.controller.ts";
import { createItemComandaService } from "./item-comanda/item-comanda.service.ts";
import { productoController } from "./producto/producto.controller.ts";
import { OrderEventPublisher } from "./realtime/order-events.ts";
import { json } from "./shared/http.ts";

export type ServerOptions = {
	database: DatabaseConfig;
	/** 0 picks a free port. */
	port: number;
};

/** Composition root: migrates and seeds the database, then starts the HTTP + WebSocket server. */
export const createServer = async ({
	database,
	port,
}: ServerOptions) => {
	const db = createDatabase(database);
	await seedDatabase(db);

	const events = new OrderEventPublisher();
	const comandaService = createComandaService({ db, events });
	const itemComandaService = createItemComandaService({ db });

	const server = Bun.serve({
		port,
		routes: {
			...productoController(db),
			...comandaController(comandaService),
			...itemComandaController(itemComandaService),
		},
		fetch(request, server) {
			if (new URL(request.url).pathname === "/ws" && server.upgrade(request)) {
				return undefined;
			}
			return json({ error: "Not found" }, 404);
		},
		websocket: events.handler,
	});

	events.attach(server);
	return server;
};
