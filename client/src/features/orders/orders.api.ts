import { requestJson } from "@/lib/http";
import type { NewOrder, Order, OrderStatus } from "./orders.types";

export const listOrders = () => requestJson<Order[]>("/api/orders");

export const createOrder = (order: NewOrder) =>
	requestJson<Order>("/api/orders", {
		method: "POST",
		body: JSON.stringify(order),
	});

export const changeOrderStatus = (id: number, status: OrderStatus) =>
	requestJson<Order>(`/api/orders/${id}/status`, {
		method: "PATCH",
		body: JSON.stringify({ status }),
	});
