import { useEffect, useRef, useState } from "react";
import { timerStartAfter } from "./order-time";
import { changeOrderStatus, listOrders } from "./orders.api";
import type { Order, OrderEvent, OrderStatus } from "./orders.types";

export type Connection = "connecting" | "online" | "offline";

const MAX_RETRY_DELAY_MS = 10_000;
/**
 * Safety net for the WebSocket: on Vercel each function instance only broadcasts to its own
 * sockets, so an event can miss a screen connected to another instance. Reloading the list
 * every few seconds (and when the tab becomes visible) bounds that delay.
 */
const POLL_INTERVAL_MS = 5_000;

const upsert = (orders: Order[], order: Order): Order[] =>
	orders.some((current) => current.id === order.id)
		? orders.map((current) => (current.id === order.id ? order : current))
		: [...orders, order].sort((a, b) => a.id - b.id);

const socketUrl = () => {
	const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
	return `${protocol}//${window.location.host}/ws`;
};

/**
 * Keeps the order list in sync with the API: initial load, live `/ws` events
 * (reconnecting with backoff and reloading on every reconnect) and optimistic status changes.
 */
export const useOrders = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [connection, setConnection] = useState<Connection>("connecting");
	const [error, setError] = useState<string | null>(null);
	/** Status changes still waiting for the API; a reload meanwhile would undo them on screen. */
	const pendingMoves = useRef(0);

	useEffect(() => {
		let disposed = false;
		let socket: WebSocket | null = null;
		let retryTimer: ReturnType<typeof setTimeout> | undefined;
		let attempts = 0;

		/** `silent`: periodic reloads don't raise errors (the connection status already does). */
		const reload = (silent = false) => {
			listOrders()
				.then((loaded) => {
					if (!disposed && pendingMoves.current === 0) {
						setOrders(loaded);
					}
				})
				.catch((reason: Error) => {
					if (!disposed && !silent) setError(reason.message);
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
				setOrders((current) => upsert(current, event.order));
			};
			socket.onclose = () => {
				if (disposed) return;
				setConnection("offline");
				const delay = Math.min(1000 * 2 ** attempts, MAX_RETRY_DELAY_MS);
				attempts += 1;
				retryTimer = setTimeout(connect, delay);
			};
		};

		const reloadWhenVisible = () => {
			if (document.visibilityState === "visible") reload(true);
		};

		reload();
		connect();
		const pollTimer = setInterval(reloadWhenVisible, POLL_INTERVAL_MS);
		document.addEventListener("visibilitychange", reloadWhenVisible);

		return () => {
			disposed = true;
			clearInterval(pollTimer);
			document.removeEventListener("visibilitychange", reloadWhenVisible);
			clearTimeout(retryTimer);
			socket?.close();
		};
	}, []);

	const addOrder = (order: Order) => {
		setOrders((current) => upsert(current, order));
	};

	const moveOrder = (id: number, status: OrderStatus) => {
		const previous = orders.find((order) => order.id === id);
		if (!previous || previous.status === status) return;

		// Mirror the server's timestamps so the timer doesn't jump until the response arrives.
		const changedAt = Date.now();
		setOrders((current) =>
			upsert(current, {
				...previous,
				status,
				updatedAt: new Date(changedAt).toISOString(),
				timerStartedAt: timerStartAfter(previous, status, changedAt),
			}),
		);
		pendingMoves.current += 1;
		changeOrderStatus(id, status)
			.then((saved) => setOrders((current) => upsert(current, saved)))
			.catch((reason: Error) => {
				setOrders((current) => upsert(current, previous));
				setError(`No se pudo mover la comanda #${id}: ${reason.message}`);
			})
			.finally(() => {
				pendingMoves.current -= 1;
			});
	};

	return {
		orders,
		connection,
		error,
		dismissError: () => setError(null),
		addOrder,
		moveOrder,
	};
};
