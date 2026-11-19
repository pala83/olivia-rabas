import { useContext } from "react";
import type { OrderDraft } from "@/features/order-draft/use-order-draft";
import { OrderDraftContext } from "./order-draft.context";

export const useOrderDraftContext = (): OrderDraft => {
	const value = useContext(OrderDraftContext);
	if (!value) {
		throw new Error(
			"useOrderDraftContext must be used inside <OrderDraftProvider>",
		);
	}
	return value;
};
