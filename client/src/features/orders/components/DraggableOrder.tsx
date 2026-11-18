import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/utils/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/utils/set-custom-native-drag-preview";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { orderDragData } from "../order-dnd";
import { OrderCard } from "./OrderCard";

/**
 * Makes an OrderCard draggable. While it travels, the preview tilts with a shadow
 * and the card left behind dims (design: "Levantada" / "Lugar de origen").
 */
export function DraggableOrder(props: ComponentProps<typeof OrderCard>) {
	const ref = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState(false);
	const { id, status } = props.order;

	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		return combine(
			draggable({
				element,
				getInitialData: () => orderDragData(id, status),
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
							preview.style.borderRadius = "12px";
							preview.style.boxShadow = "0 18px 36px rgba(16, 24, 32, 0.4)";
							container.style.padding = "16px";
							container.append(preview);
						},
					});
				},
				onDragStart: () => setDragging(true),
				onDrop: () => setDragging(false),
			}),
		);
	}, [id, status]);

	return (
		<div
			ref={ref}
			className={cn(
				"cursor-grab rounded-lg transition-[opacity,transform] duration-200 ease-out",
				dragging && "scale-97 opacity-35",
			)}
		>
			<OrderCard {...props} />
		</div>
	);
}
