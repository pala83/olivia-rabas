import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { useEffect, useEffectEvent, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isColumnDropData, isOrderDragData } from "../order-dnd";
import { STATUS_VIEW } from "../order-status";
import { ORDER_STATUSES, type Order, type OrderStatus } from "../orders.types";
import { BoardColumn } from "./BoardColumn";

type KitchenBoardProps = {
	orders: Order[];
	now: number;
	deliveredAt: Record<number, number>;
	onMove: (id: number, status: OrderStatus) => void;
};

/** Main area: the four status lanes side by side, scrolling horizontally. */
export function KitchenBoard({
	orders,
	now,
	deliveredAt,
	onMove,
}: KitchenBoardProps) {
	const viewportRef = useRef<HTMLDivElement>(null);
	const move = useEffectEvent(onMove);

	useEffect(() => {
		const viewport = viewportRef.current;
		if (!viewport) return;
		return combine(
			monitorForElements({
				canMonitor: ({ source }) => isOrderDragData(source.data),
				onDrop: ({ source, location }) => {
					const [target] = location.current.dropTargets;
					if (!target) return;
					if (isOrderDragData(source.data) && isColumnDropData(target.data)) {
						move(source.data.orderId, target.data.status);
					}
				},
			}),
			autoScrollForElements({ element: viewport }),
		);
	}, []);

	const advance = (order: Order) =>
		onMove(order.id, STATUS_VIEW[order.status].next);

	return (
		<div className="flex h-full min-h-0 flex-col gap-4 p-4">
			<div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
				<h2 className="m-0 text-[28px] leading-[34px] font-bold">
					Tablero de cocina
				</h2>
				<p className="m-0 text-xl leading-7 text-ink-2">
					Arrastrá cada comanda a su columna, o tocá su botón.
				</p>
			</div>
			<ScrollArea
				viewportRef={viewportRef}
				scrollbars="horizontal"
				className="min-h-0 flex-1"
			>
				<div className="flex h-full w-max gap-4 px-2 pt-2 pb-5">
					{ORDER_STATUSES.map((status) => (
						<BoardColumn
							key={status}
							status={status}
							orders={orders.filter((order) => order.status === status)}
							now={now}
							deliveredAt={deliveredAt}
							onAdvance={advance}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
