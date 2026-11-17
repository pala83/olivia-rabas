import type { OrderStatus } from "./orders.types";

/** Private key so drop targets only accept orders dragged from this board. */
const ORDER_DRAG = Symbol("order-drag");

export type OrderDragData = {
	[ORDER_DRAG]: true;
	orderId: number;
	status: OrderStatus;
};

export const orderDragData = (
	orderId: number,
	status: OrderStatus,
): OrderDragData => ({ [ORDER_DRAG]: true, orderId, status });

export const isOrderDragData = (
	data: Record<string | symbol, unknown>,
): data is OrderDragData => data[ORDER_DRAG] === true;

const COLUMN_DROP = Symbol("column-drop");

export type ColumnDropData = { [COLUMN_DROP]: true; status: OrderStatus };

export const columnDropData = (status: OrderStatus): ColumnDropData => ({
	[COLUMN_DROP]: true,
	status,
});

export const isColumnDropData = (
	data: Record<string | symbol, unknown>,
): data is ColumnDropData => data[COLUMN_DROP] === true;
