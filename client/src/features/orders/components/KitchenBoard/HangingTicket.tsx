import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/utils/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/utils/set-custom-native-drag-preview";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { orderDragData } from "../../order-dnd";
import type { Order, OrderStatus } from "../../orders.types";
import { OrderTicket } from "../OrderTicket/OrderTicket";

type HangingTicketProps = {
	order: Order;
	/** Lane it is shown in (an order past 10 minutes shows as Urgente). */
	laneStatus: OrderStatus;
	now: number;
	onAdvance: (order: Order) => void;
};

/**
 * A ticket hanging from the rail with a steel clip. Dragged: the preview tilts with a big
 * shadow and the original stays dimmed (design: "Levantada" / "Lugar de origen").
 */
export function HangingTicket({
	order,
	laneStatus,
	now,
	onAdvance,
}: HangingTicketProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState(false);
	const { id } = order;

	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		return draggable({
			element,
			getInitialData: () => orderDragData(id, laneStatus),
			onGenerateDragPreview: ({ location, nativeSetDragImage }) => {
				setCustomNativeDragPreview({
					nativeSetDragImage,
					getOffset: preserveOffsetOnSource({
						element,
						input: location.current.input,
					}),
					render: ({ container }) => {
						const preview = element.cloneNode(true) as HTMLElement;
						preview.style.width = `${element.offsetWidth}px`;
						preview.style.transform = "rotate(-2deg)";
						preview.style.borderRadius = "14px";
						preview.style.boxShadow = "var(--shadow-lg)";
						container.style.padding = "16px";
						container.append(preview);
					},
				});
			},
			onDragStart: () => setDragging(true),
			onDrop: () => setDragging(false),
		});
	}, [id, laneStatus]);

	return (
		<div
			ref={ref}
			className={cn(
				"relative cursor-grab transition-[opacity,transform] duration-200 hover:-translate-y-0.5",
				dragging && "opacity-40",
			)}
		>
			<span
				aria-hidden="true"
				className="absolute -top-[9px] left-1/2 z-1 -ml-[18px] h-3.5 w-9 rounded bg-[linear-gradient(180deg,#EEF0F2,#9AA1A8)] shadow-[0_1px_2px_rgb(0_0_0/0.35)]"
			/>
			<OrderTicket order={order} now={now} onAdvance={onAdvance} />
		</div>
	);
}
