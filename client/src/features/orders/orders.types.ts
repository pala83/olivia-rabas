/** Mirrors the API contract (see api/README.md). */
export const ORDER_STATUSES = [
	"ORDERED",
	"IN_PREPARATION",
	"DELAYED",
	"FINISHED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = {
	id: number;
	productId: number;
	productName: string;
	quantity: number;
	/** true/false for FOOD, null for DRINK. */
	withSalt: boolean | null;
};

export type Order = {
	id: number;
	customerName: string;
	notes: string | null;
	/** ISO timestamp set by the server; the timer counts from here. */
	createdAt: string;
	status: OrderStatus;
	items: OrderItem[];
};

export type NewOrderItem = {
	productId: number;
	quantity: number;
	withSalt?: boolean;
};

export type NewOrder = {
	customerName: string;
	notes?: string;
	items: NewOrderItem[];
};

export type OrderEvent =
	| { type: "order.created"; order: Order }
	| { type: "order.status_changed"; order: Order };
