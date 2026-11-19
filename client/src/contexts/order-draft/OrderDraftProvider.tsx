import type { ReactNode } from "react";
import { useOrdersContext } from "@/contexts/orders/use-orders-context";
import { useOrderDraft } from "@/features/order-draft/use-order-draft";
import { OrderDraftContext } from "./order-draft.context";

/** Must live inside <OrdersProvider>: a sent order is added to the live list right away. */
export function OrderDraftProvider({ children }: { children: ReactNode }) {
	const { addOrder } = useOrdersContext();
	const draft = useOrderDraft(addOrder);
	return <OrderDraftContext value={draft}>{children}</OrderDraftContext>;
}
