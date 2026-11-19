import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/** Board title, how to use it, and the 10-minute rule. */
export function BoardHeader() {
	return (
		<div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
			<div className="flex flex-col gap-1">
				<h2 className="m-0 font-serif text-[32px] leading-9 tracking-[0.01em]">
					Tablero de cocina
				</h2>
				<p className="m-0 text-sm text-[#4A3727]">
					Arrastrá cada comanda a su columna, o usá el botón de la tarjeta.
				</p>
			</div>
			<Badge
				variant="outline"
				className="h-auto rounded-md border-foreground/25 bg-card px-2 py-0.5"
			>
				<Clock aria-hidden="true" />
				Pasan a Urgente a los 10 min
			</Badge>
		</div>
	);
}
