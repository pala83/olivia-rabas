import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { useEffect, useEffectEvent, useRef } from "react";
import { useOrdersContext } from "@/contexts/orders/use-orders-context";
import { isColumnDropData, isOrderDragData } from "../../order-dnd";
import { displayStatus, STATUS_VIEW } from "../../order-status";
import { elapsedSeconds } from "../../order-time";
import { ORDER_STATUSES, type Order } from "../../orders.types";
import { useNow } from "../../use-now";
import { BoardHeader } from "./BoardHeader";
import { BoardLane } from "./BoardLane";

/** "04 · Tablero de cocina": four lanes side by side, scrolling horizontally when they don't fit. */
export function KitchenBoard() {
	const now = useNow();
	const { orders, moveOrder } = useOrdersContext();
	const scrollerRef = useRef<HTMLDivElement>(null);
	const move = useEffectEvent(moveOrder);

	useEffect(() => {
		const scroller = scrollerRef.current;
		if (!scroller) return;
		return combine(
			monitorForElements({
				canMonitor: ({ source }) => isOrderDragData(source.data),
				onDrop: ({ source, location }) => {
					const [target] = location.current.dropTargets;
					if (
						target &&
						isOrderDragData(source.data) &&
						isColumnDropData(target.data)
					) {
						move(source.data.orderId, target.data.status);
					}
				},
			}),
			autoScrollForElements({ element: scroller }),
		);
	}, []);

	const shown = orders.map((order) => ({
		order,
		status: displayStatus(order, elapsedSeconds(order, now)),
	}));
	const advance = (order: Order) => {
		const current =
			shown.find((entry) => entry.order.id === order.id)?.status ??
			order.status;
		moveOrder(order.id, STATUS_VIEW[current].next);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-5 p-6">
			<BoardHeader />
			<div
				ref={scrollerRef}
				className="flex min-h-0 flex-1 items-stretch gap-4 overflow-x-auto pt-3 pb-2"
			>
				{ORDER_STATUSES.map((status) => (
					<BoardLane
						key={status}
						status={status}
						orders={shown
							.filter((entry) => entry.status === status)
							.map((entry) => entry.order)}
						now={now}
						onAdvance={advance}
					/>
				))}
			</div>
		</div>
	);
}
