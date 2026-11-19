import type { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { OrdersErrorAlert } from "@/components/OrdersErrorAlert";
import { CashierChip } from "./CashierChip";

type ReceptionLayoutProps = {
	/** Left, kraft: the order being built. */
	draft: ReactNode;
	/** Center: the menu. */
	menu: ReactNode;
	/** Right, steel: what the kitchen has. */
	kitchen: ReactNode;
};

/**
 * "03 · Recepción": the screen is exactly the viewport. Header, draft and kitchen stay
 * fixed (both columns span the full height below the header); only the menu scrolls.
 */
export function ReceptionLayout({
	draft,
	menu,
	kitchen,
}: ReceptionLayoutProps) {
	return (
		<div className="tx-papel flex h-dvh flex-col overflow-hidden">
			<AppHeader
				actions={
					<>
						<ConnectionStatus />
						<CashierChip />
					</>
				}
			/>
			<OrdersErrorAlert />
			<div className="flex min-h-0 flex-1">
				<aside
					aria-label="Armar comanda"
					className="tx-kraft flex min-h-0 w-80 flex-none flex-col gap-2 overflow-hidden border-r border-sidebar-border p-2"
				>
					{draft}
				</aside>
				<main className="flex min-h-0 min-w-0 flex-1 flex-col gap-8 overflow-y-auto p-6">
					{menu}
				</main>
				<aside
					aria-label="Comandas en cocina"
					className="tx-acero flex min-h-0 w-80 flex-none flex-col gap-3 overflow-hidden border-l border-[#A8AFB6] p-4"
				>
					{kitchen}
				</aside>
			</div>
		</div>
	);
}
