import { useEffect, useState } from "react";
import { changeOrderStatus, listOrders } from "./orders.api";
import type { Order, OrderEvent, OrderStatus } from "./orders.types";

export type Connection = "connecting" | "online" | "offline";

type OrdersState = {
	orders: Order[];
	/**
	 * When this client saw each order reach FINISHED (ms). The API keeps no delivery time,
	 * so after a reload delivered orders show no total.
	 */
	deliveredAt: Record<number, number>;
};

const MAX_RETRY_DELAY_MS = 10_000;

const upsert = (state: OrdersState, order: Order): OrdersState => {
	const previous = state.orders.find((current) => current.id === order.id);
	const orders = previous
		? state.orders.map((current) => (current.id === order.id ? order : current))
		: [...state.orders, order].sort((a, b) => a.id - b.id);

	const deliveredAt = { ...state.deliveredAt };
	if (order.status !== "FINISHED") {
		delete deliveredAt[order.id];
	} else if (previous && previous.status !== "FINISHED") {
		deliveredAt[order.id] = Date.now();
	}
	return { orders, deliveredAt };
};

const replaceAll = (state: OrdersState, orders: Order[]): OrdersState => ({
	orders,
	deliveredAt: state.deliveredAt,
});

const socketUrl = () => {
	const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
	return `${protocol}//${window.location.host}/ws`;
};

/**
 * Keeps the order list in sync with the API: initial load, live `/ws` events
 * (reconnecting with backoff and reloading on every reconnect) and optimistic status changes.
 */
export const useOrders = () => {
	const [state, setState] = useState<OrdersState>({
		orders: [],
		deliveredAt: {},
	});
	const [connection, setConnection] = useState<Connection>("connecting");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let disposed = false;
		let socket: WebSocket | null = null;
		let retryTimer: ReturnType<typeof setTimeout> | undefined;
		let attempts = 0;

		const reload = () => {
			listOrders()
				.then((orders) => {
					if (!disposed) setState((current) => replaceAll(current, orders));
				})
				.catch((reason: Error) => {
					if (!disposed) setError(reason.message);
				});
		};

		const connect = () => {
			setConnection("connecting");
			socket = new WebSocket(socketUrl());
			socket.onopen = () => {
				attempts = 0;
				setConnection("online");
				reload();
			};
			socket.onmessage = (message: MessageEvent<string>) => {
				const event = JSON.parse(message.data) as OrderEvent;
				setState((current) => upsert(current, event.order));
			};
			socket.onclose = () => {
				if (disposed) return;
				setConnection("offline");
				const delay = Math.min(1000 * 2 ** attempts, MAX_RETRY_DELAY_MS);
				attempts += 1;
				retryTimer = setTimeout(connect, delay);
			};
		};

		reload();
		connect();

		return () => {
			disposed = true;
			clearTimeout(retryTimer);
			socket?.close();
		};
	}, []);

	const addOrder = (order: Order) => {
		setState((current) => upsert(current, order));
	};

	const moveOrder = (id: number, status: OrderStatus) => {
		const previous = state.orders.find((order) => order.id === id);
		if (!previous || previous.status === status) return;

		setState((current) => upsert(current, { ...previous, status }));
		changeOrderStatus(id, status)
			.then((saved) => setState((current) => upsert(current, saved)))
			.catch((reason: Error) => {
				setState((current) => upsert(current, previous));
				setError(`No se pudo mover la comanda #${id}: ${reason.message}`);
			});
	};

	return {
		orders: state.orders,
		deliveredAt: state.deliveredAt,
		connection,
		error,
		dismissError: () => setError(null),
		addOrder,
		moveOrder,
	};
};
