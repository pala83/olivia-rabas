import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { SteelRail } from "@/components/SteelRail";
import { cn } from "@/lib/utils";
import { columnDropData, isOrderDragData } from "../../order-dnd";
import { STATUS_VIEW } from "../../order-status";
import type { Order, OrderStatus } from "../../orders.types";
import { DropSlot } from "./DropSlot";
import { HangingTicket } from "./HangingTicket";
import { LaneHeader } from "./LaneHeader";

type BoardLaneProps = {
	status: OrderStatus;
	orders: Order[];
	now: number;
	onAdvance: (order: Order) => void;
};

/** One status lane: header, steel rail, hanging tickets; accepts tickets from other lanes. */
export function BoardLane({ status, orders, now, onAdvance }: BoardLaneProps) {
	const ref = useRef<HTMLElement>(null);
	const [isOver, setIsOver] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		return combine(
			dropTargetForElements({
				element,
				getData: () => columnDropData(status),
				canDrop: ({ source }) =>
					isOrderDragData(source.data) && source.data.status !== status,
				onDragEnter: () => setIsOver(true),
				onDragLeave: () => setIsOver(false),
				onDrop: () => setIsOver(false),
			}),
		);
	}, [status]);

	return (
		<section
			ref={ref}
			aria-label={STATUS_VIEW[status].label}
			className={cn(
				"flex min-h-80 min-w-[300px] flex-1 flex-col gap-3.5 rounded-xl border p-3 transition-colors duration-200",
				isOver
					? "border-ring bg-[rgb(255_244_214/0.75)]"
					: "border-white/50 bg-white/22",
			)}
		>
			<div className="flex flex-col gap-1.5">
				<LaneHeader status={status} count={orders.length} />
				<SteelRail />
			</div>
			{orders.map((order) => (
				<HangingTicket
					key={order.id}
					order={order}
					laneStatus={status}
					now={now}
					onAdvance={onAdvance}
				/>
			))}
			{isOver && <DropSlot />}
			{orders.length === 0 && !isOver && (
				<EmptyState
					title="Sin comandas"
					description="Soltá una acá para moverla."
					className="flex-auto justify-center border-foreground/35 p-6 [&>span:last-child]:text-[#4A3727]"
				/>
			)}
		</section>
	);
}
