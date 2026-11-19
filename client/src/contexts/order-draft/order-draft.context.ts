import { createContext } from "react";
import type { OrderDraft } from "@/features/order-draft/use-order-draft";

/** The order being built at reception; survives a trip to the kitchen screen. */
export const OrderDraftContext = createContext<OrderDraft | null>(null);
