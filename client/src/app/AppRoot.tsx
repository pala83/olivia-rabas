import { Outlet } from "@tanstack/react-router";
import { OrderDraftProvider } from "@/contexts/order-draft/OrderDraftProvider";
import { OrdersProvider } from "@/contexts/orders/OrdersProvider";

/** Root route component: app-wide state, then the current screen. */
export function AppRoot() {
	return (
		<OrdersProvider>
			<OrderDraftProvider>
				<Outlet />
			</OrderDraftProvider>
		</OrdersProvider>
	);
}
