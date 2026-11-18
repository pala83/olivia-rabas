import { useContext } from "react";
import { OrdersContext, type OrdersContextValue } from "./orders.context";

export const useOrdersContext = (): OrdersContextValue => {
	const value = useContext(OrdersContext);
	if (!value) {
		throw new Error("useOrdersContext must be used inside <OrdersProvider>");
	}
	return value;
};
