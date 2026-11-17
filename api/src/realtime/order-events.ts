import type { Server, WebSocketHandler } from "bun";
import type { Order } from "../comanda/types/comanda.types.ts";

export type OrderEvent =
	| { type: "order.created"; order: Order }
	| { type: "order.status_changed"; order: Order };

const TOPIC = "orders";

/** Broadcasts order events to every client connected to the WebSocket endpoint. */
export class OrderEventPublisher {
	#server: Server<undefined> | null = null;

	readonly handler: WebSocketHandler<undefined> = {
		open(ws) {
			ws.subscribe(TOPIC);
		},
		message() {
			// Clients only listen; incoming messages are ignored.
		},
	};

	attach(server: Server<undefined>): void {
		this.#server = server;
	}

	publish(event: OrderEvent): void {
		this.#server?.publish(TOPIC, JSON.stringify(event));
	}
}
