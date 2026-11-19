import type { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { OrdersErrorAlert } from "@/components/OrdersErrorAlert";
import { BackToReceptionLink } from "./BackToReceptionLink";

/** "04 · Tablero de cocina": the board fills the steel surface below the header. */
export function KitchenLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-dvh flex-col">
			<AppHeader
				actions={
					<>
						<ConnectionStatus />
						<BackToReceptionLink />
					</>
				}
			/>
			<OrdersErrorAlert />
			<main className="tx-acero flex min-h-0 flex-1 flex-col">{children}</main>
		</div>
	);
}
