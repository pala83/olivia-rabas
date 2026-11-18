import { ArrowLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderDraftBar } from "@/features/catalog/components/OrderDraftBar";
import { ProductPicker } from "@/features/catalog/components/ProductPicker";
import { useOrderDraft } from "@/features/catalog/use-order-draft";
import { KitchenBoard } from "@/features/orders/components/KitchenBoard";
import { KitchenSummary } from "@/features/orders/components/KitchenSummary";
import { useNow } from "@/features/orders/use-now";
import { useOrders } from "@/features/orders/use-orders";

type View = "recepcion" | "tablero";

const BOARD_HASH = "#tablero";

const viewFromHash = (): View =>
	window.location.hash === BOARD_HASH ? "tablero" : "recepcion";

/**
 * Single screen from the design: reception (products, kitchen summary, draft order)
 * and, when the summary is maximized, the full kitchen board. `#tablero` opens the board.
 */
export function App() {
	const now = useNow();
	const {
		orders,
		deliveredAt,
		connection,
		error,
		dismissError,
		addOrder,
		moveOrder,
	} = useOrders();
	const draft = useOrderDraft(addOrder);
	const [view, setView] = useState<View>(viewFromHash);

	useEffect(() => {
		const sync = () => setView(viewFromHash());
		window.addEventListener("hashchange", sync);
		return () => window.removeEventListener("hashchange", sync);
	}, []);

	const show = (next: View) => {
		window.history.replaceState(
			null,
			"",
			next === "tablero" ? BOARD_HASH : " ",
		);
		setView(next);
	};

	return (
		<div className="flex h-dvh flex-col bg-ground text-ink">
			<header className="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 bg-bar px-4 py-2 text-white">
				<div className="flex items-center gap-3">
					<span className="rounded-md bg-card px-3 py-1 text-[22px] leading-7 font-bold text-bar">
						KDS
					</span>
					<h1 className="m-0 text-2xl leading-[30px] font-bold">[TU LOCAL]</h1>
				</div>
				<div className="flex flex-wrap items-center gap-4">
					<span
						role="status"
						aria-live="polite"
						className="text-lg leading-6 font-bold"
					>
						{connection === "offline"
							? "Sin conexión con cocina. Reintentando…"
							: ""}
					</span>
					{view === "tablero" && (
						<Button
							variant="bar"
							size="md"
							onClick={() => show("recepcion")}
							className="min-h-14 border-white"
						>
							<ArrowLeft aria-hidden="true" strokeWidth={2.6} />
							Volver a recepción
						</Button>
					)}
				</div>
			</header>

			{error && (
				<div
					role="alert"
					className="flex items-center justify-between gap-4 border-b-3 border-ink bg-status-urgent px-4 py-2 text-lg leading-6 font-bold text-white"
				>
					<span>{error}</span>
					<Button variant="inverse" size="chip" onClick={dismissError}>
						<X aria-hidden="true" strokeWidth={3} />
						Cerrar
					</Button>
				</div>
			)}

			{view === "recepcion" ? (
				<div className="flex min-h-0 flex-1 animate-kds-in flex-col">
					<div className="flex min-h-0 flex-1 flex-wrap">
						<main className="h-full min-w-0 flex-[999_1_600px]">
							<ScrollArea className="h-full">
								<ProductPicker draft={draft} />
							</ScrollArea>
						</main>
						<aside
							aria-label="Comandas en cocina"
							className="h-full min-w-0 flex-[1_1_380px]"
						>
							<KitchenSummary
								orders={orders}
								now={now}
								deliveredAt={deliveredAt}
								onExpand={() => show("tablero")}
							/>
						</aside>
					</div>
					<OrderDraftBar draft={draft} />
				</div>
			) : (
				<main className="min-h-0 flex-1 animate-kds-panel">
					<KitchenBoard
						orders={orders}
						now={now}
						deliveredAt={deliveredAt}
						onMove={moveOrder}
					/>
				</main>
			)}
		</div>
	);
}
