import { createContext } from "react";
import type { useOrders } from "@/features/orders/use-orders";

export type OrdersContextValue = ReturnType<typeof useOrders>;

/** Live order list shared by both screens (one WebSocket for the whole app). */
export const OrdersContext = createContext<OrdersContextValue | null>(null);
