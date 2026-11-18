import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "cn";
import type { Ref } from "react";

type ScrollAreaProps = ScrollAreaPrimitive.Root.Props & {
	/** The scrolling element (needed by drag-and-drop auto-scroll). */
	viewportRef?: Ref<HTMLDivElement>;
	/** Which scrollbars to render. */
	scrollbars?: "vertical" | "horizontal" | "both";
};

function ScrollArea({
	className,
	children,
	viewportRef,
	scrollbars = "vertical",
	...props
}: ScrollAreaProps) {
	return (
		<ScrollAreaPrimitive.Root
			data-slot="scroll-area"
			className={cn("relative", className)}
			{...props}
		>
			<ScrollAreaPrimitive.Viewport
				ref={viewportRef}
				data-slot="scroll-area-viewport"
				className="size-full rounded-[inherit] outline-none"
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			{scrollbars !== "horizontal" && <ScrollBar />}
			{scrollbars !== "vertical" && <ScrollBar orientation="horizontal" />}
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	);
}

// KDS: thicker, ink-colored thumb so the scroll position reads at a glance.
function ScrollBar({
	className,
	orientation = "vertical",
	...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
	return (
		<ScrollAreaPrimitive.Scrollbar
			data-slot="scroll-area-scrollbar"
			data-orientation={orientation}
			orientation={orientation}
			className={cn(
				"flex touch-none p-0.5 transition-colors select-none data-horizontal:h-3.5 data-horizontal:flex-col data-vertical:h-full data-vertical:w-3.5",
				className,
			)}
			{...props}
		>
			<ScrollAreaPrimitive.Thumb
				data-slot="scroll-area-thumb"
				className="relative flex-1 rounded-full bg-ink-2"
			/>
		</ScrollAreaPrimitive.Scrollbar>
	);
}

export { ScrollArea, ScrollBar };
