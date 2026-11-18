import type { ReactNode } from "react";
import { useOrders } from "@/features/orders/use-orders";
import { OrdersContext } from "./orders.context";

/** Loads the orders and keeps them in sync over /ws for every route below it. */
export function OrdersProvider({ children }: { children: ReactNode }) {
	const orders = useOrders();
	return <OrdersContext value={orders}>{children}</OrdersContext>;
}
