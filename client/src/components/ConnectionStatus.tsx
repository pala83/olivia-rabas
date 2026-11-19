import { useOrdersContext } from "@/contexts/orders/use-orders-context";

/** Announces when the live connection with the kitchen is lost. */
export function ConnectionStatus() {
	const { connection } = useOrdersContext();
	return (
		<span role="status" aria-live="polite" className="text-xs font-medium">
			{connection === "offline" ? "Sin conexión con cocina. Reintentando…" : ""}
		</span>
	);
}
