import { useState } from "react";
import type { Product } from "@/features/catalog/catalog.types";
import { createOrder } from "@/features/orders/orders.api";
import type { Order } from "@/features/orders/orders.types";

export const MAX_CUSTOMER = 30;
export const MAX_NOTE = 80;
/** Name the design sends when the receptionist leaves "Mesa o cliente" empty. */
const NO_TABLE = "Sin mesa";

export type DraftLine = {
	key: string;
	productId: number;
	name: string;
	/** true/false for FOOD, null for DRINK. */
	withSalt: boolean | null;
	containsAlcohol: boolean | null;
	quantity: number;
};

export const lineKey = (productId: number, withSalt: boolean | null) =>
	`${productId}:${withSalt}`;

const isFood = (line: DraftLine) => line.withSalt !== null;

/**
 * The order the receptionist is building ("Nueva comanda"): add from the menu,
 * adjust with − and +, then send. The design's combo is left out: the API has no combo.
 */
export const useOrderDraft = (onSent: (order: Order) => void) => {
	const [lines, setLines] = useState<DraftLine[]>([]);
	const [customer, setCustomer] = useState("");
	const [note, setNote] = useState("");
	const [notice, setNotice] = useState("");
	const [sending, setSending] = useState(false);
	/** Last order sent from this screen; "En cocina" slides it in. */
	const [lastSentId, setLastSentId] = useState<number | null>(null);

	const total = lines.reduce((sum, line) => sum + line.quantity, 0);
	const food = lines.filter(isFood);
	const drinks = lines.filter((line) => !isFood(line));

	const quantityOf = (key: string) =>
		lines.find((line) => line.key === key)?.quantity ?? 0;

	const quantityOfProduct = (productId: number) =>
		lines
			.filter((line) => line.productId === productId)
			.reduce((sum, line) => sum + line.quantity, 0);

	const add = (product: Product, withSalt: boolean | null) => {
		const key = lineKey(product.id, withSalt);
		setNotice("");
		setLines((current) =>
			current.some((line) => line.key === key)
				? current.map((line) =>
						line.key === key ? { ...line, quantity: line.quantity + 1 } : line,
					)
				: [
						...current,
						{
							key,
							productId: product.id,
							name: product.name,
							withSalt,
							containsAlcohol: product.containsAlcohol,
							quantity: 1,
						},
					],
		);
	};

	const increment = (key: string) => {
		setNotice("");
		setLines((current) =>
			current.map((line) =>
				line.key === key ? { ...line, quantity: line.quantity + 1 } : line,
			),
		);
	};

	const decrement = (key: string) => {
		setNotice("");
		setLines((current) =>
			current
				.map((line) =>
					line.key === key ? { ...line, quantity: line.quantity - 1 } : line,
				)
				.filter((line) => line.quantity > 0),
		);
	};

	const send = async () => {
		if (sending) return;
		if (total === 0) {
			setNotice("Sumá al menos un producto para enviar.");
			return;
		}
		setSending(true);
		try {
			const order = await createOrder({
				customerName: customer.trim() || NO_TABLE,
				notes: note.trim() || undefined,
				items: lines.map(({ productId, quantity, withSalt }) =>
					withSalt === null
						? { productId, quantity }
						: { productId, quantity, withSalt },
				),
			});
			onSent(order);
			setLastSentId(order.id);
			setLines([]);
			setCustomer("");
			setNote("");
			setNotice(`Comanda #${order.id} enviada a cocina.`);
		} catch (error) {
			setNotice((error as Error).message);
		} finally {
			setSending(false);
		}
	};

	const status =
		notice ||
		(total === 0
			? "Elegí productos del menú."
			: total === 1
				? "1 producto en esta comanda."
				: `${total} productos en esta comanda.`);

	return {
		lines,
		food,
		drinks,
		total,
		quantityOf,
		quantityOfProduct,
		add,
		increment,
		decrement,
		customer,
		setCustomer: (value: string) => setCustomer(value.slice(0, MAX_CUSTOMER)),
		note,
		setNote: (value: string) => setNote(value.slice(0, MAX_NOTE)),
		sending,
		lastSentId,
		status,
		send,
	};
};

export type OrderDraft = ReturnType<typeof useOrderDraft>;
