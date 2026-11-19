import { Badge } from "@/components/ui/badge";

/** Which station this screen is. */
export function CashierChip() {
	return (
		<Badge
			variant="outline"
			className="h-auto rounded-md border-[#FFF8EE]/40 px-2 py-0.5 text-[#FFF8EE]"
		>
			Caja 1 · Recepción
		</Badge>
	);
}
