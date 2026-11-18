import { type FormEvent, useRef, useState } from "react";
import { createOrder } from "@/features/orders/orders.api";
import type { Order } from "@/features/orders/orders.types";
import type { Product } from "./catalog.types";

export const MAX_CUSTOMER = 30;
export const MAX_NOTE = 80;

export type DraftLine = {
	key: string;
	productId: number;
	/** Text shown on chips, e.g. "Papas sin sal". */
	label: string;
	/** true/false for FOOD, null for DRINK. */
	withSalt: boolean | null;
	quantity: number;
};

export const lineKey = (productId: number, withSalt: boolean | null) =>
	`${productId}:${withSalt}`;

/**
 * The order the receptionist is building: tap a product to add one, tap a loaded chip
 * to remove one, then send it. (The design's combo is left out: the API has no combo.)
 */
export const useOrderDraft = (onSent: (order: Order) => void) => {
	const [lines, setLines] = useState<DraftLine[]>([]);
	const [customer, setCustomer] = useState("");
	const [note, setNote] = useState("");
	const [notice, setNotice] = useState("");
	const [sending, setSending] = useState(false);
	const customerRef = useRef<HTMLInputElement>(null);

	const total = lines.reduce((sum, line) => sum + line.quantity, 0);

	const quantityOf = (key: string) =>
		lines.find((line) => line.key === key)?.quantity ?? 0;

	const add = (product: Product, withSalt: boolean | null, label: string) => {
		const key = lineKey(product.id, withSalt);
		setNotice("");
		setLines((current) =>
			current.some((line) => line.key === key)
				? current.map((line) =>
						line.key === key ? { ...line, quantity: line.quantity + 1 } : line,
					)
				: [
						...current,
						{ key, productId: product.id, label, withSalt, quantity: 1 },
					],
		);
	};

	const removeOne = (key: string) => {
		setNotice("");
		setLines((current) =>
			current
				.map((line) =>
					line.key === key ? { ...line, quantity: line.quantity - 1 } : line,
				)
				.filter((line) => line.quantity > 0),
		);
	};

	const send = async (event: FormEvent) => {
		event.preventDefault();
		if (sending) return;
		if (total === 0) {
			setNotice("Agregá al menos un producto.");
			return;
		}
		if (customer.trim() === "") {
			setNotice("Escribí la mesa o el cliente.");
			customerRef.current?.focus();
			return;
		}
		setSending(true);
		try {
			const order = await createOrder({
				customerName: customer.trim(),
				notes: note.trim() || undefined,
				items: lines.map(({ productId, quantity, withSalt }) =>
					withSalt === null
						? { productId, quantity }
						: { productId, quantity, withSalt },
				),
			});
			onSent(order);
			setLines([]);
			setCustomer("");
			setNote("");
			setNotice(`Comanda #${order.id} enviada.`);
		} catch (error) {
			setNotice((error as Error).message);
		} finally {
			setSending(false);
		}
	};

	const status =
		notice ||
		(total === 0
			? "Sin productos todavía"
			: total === 1
				? "1 producto listo"
				: `${total} productos listos`);

	return {
		lines,
		total,
		quantityOf,
		add,
		removeOne,
		customer,
		setCustomer,
		note,
		setNote,
		customerRef,
		sending,
		status,
		send,
	};
};

export type OrderDraft = ReturnType<typeof useOrderDraft>;
