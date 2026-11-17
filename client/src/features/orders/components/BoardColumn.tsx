import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { columnDropData, isOrderDragData } from "../order-dnd";
import { STATUS_VIEW } from "../order-status";
import type { Order, OrderStatus } from "../orders.types";
import { DraggableOrder } from "./DraggableOrder";

type BoardColumnProps = {
	status: OrderStatus;
	orders: Order[];
	now: number;
	deliveredAt: Record<number, number>;
	onAdvance: (order: Order) => void;
};

/** One status lane. Accepts orders from other lanes and shows the "Soltar aquí" slot. */
export function BoardColumn({
	status,
	orders,
	now,
	deliveredAt,
	onAdvance,
}: BoardColumnProps) {
	const columnRef = useRef<HTMLElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const [isOver, setIsOver] = useState(false);
	const view = STATUS_VIEW[status];
	const Icon = view.icon;

	useEffect(() => {
		const element = columnRef.current;
		const viewport = viewportRef.current;
		if (!element || !viewport) return;
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
			autoScrollForElements({ element: viewport }),
		);
	}, [status]);

	return (
		<section
			ref={columnRef}
			aria-label={view.label}
			className={cn(
				"flex h-full w-85 flex-none flex-col gap-3 rounded-lg outline-4 outline-offset-5 transition-[outline-color] duration-200",
				isOver ? "outline-ink" : "outline-transparent",
			)}
		>
			<h3
				className={cn(
					"m-0 flex items-center justify-between gap-2 rounded-lg border-3 border-ink py-2 pr-2 pl-3 text-[22px] leading-7 font-bold",
					view.band,
				)}
			>
				<span className="inline-flex items-center gap-2">
					<Icon aria-hidden="true" strokeWidth={2.4} className="size-6" />
					{view.label}
				</span>
				<Badge className="h-10 min-w-10 rounded-full border-3 border-ink bg-card px-2 text-[22px] leading-6 font-bold text-ink">
					{orders.length}
					<span className="sr-only"> comandas</span>
				</Badge>
			</h3>
			<ScrollArea viewportRef={viewportRef} className="min-h-0 flex-1">
				<div className="flex min-h-65 flex-col gap-3 pb-1">
					{orders.map((order) => (
						<DraggableOrder
							key={order.id}
							order={order}
							now={now}
							deliveredAt={deliveredAt[order.id]}
							onAdvance={onAdvance}
						/>
					))}
					{isOver && (
						<div className="flex min-h-24 animate-kds-in items-center justify-center gap-2.5 rounded-lg border-4 border-dashed border-ink bg-card text-[22px] leading-7 font-bold">
							<ArrowDown
								aria-hidden="true"
								strokeWidth={2.6}
								className="size-6"
							/>
							Soltar aquí
						</div>
					)}
				</div>
			</ScrollArea>
		</section>
	);
}
