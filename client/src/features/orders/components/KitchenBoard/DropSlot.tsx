import { ArrowDown } from "lucide-react";

/** Dashed gap shown in the lane under the dragged ticket. */
export function DropSlot() {
	return (
		<div className="flex min-h-24 animate-[kds-in_0.2s_ease-out_both] items-center justify-center gap-2 rounded-xl border-2 border-dashed border-foreground bg-card/80 text-sm font-medium">
			<ArrowDown aria-hidden="true" className="size-4" />
			Soltar aquí
		</div>
	);
}
