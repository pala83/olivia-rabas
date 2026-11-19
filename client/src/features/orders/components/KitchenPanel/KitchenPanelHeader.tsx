import { Link } from "@tanstack/react-router";
import { Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

/** "En cocina" + pending count + "Maximizar" (opens the kitchen screen). */
export function KitchenPanelHeader({ pending }: { pending: number }) {
	return (
		<div className="flex items-center justify-between gap-2">
			<div className="flex items-center gap-2">
				<h2 className="m-0 font-serif text-[26px] leading-[30px] tracking-[0.01em]">
					En cocina
				</h2>
				<Badge
					variant="outline"
					className="h-auto rounded-md border-foreground/25 bg-card px-2 py-0.5 font-mono font-semibold"
				>
					{pending}
					<span className="sr-only"> comandas pendientes</span>
				</Badge>
			</div>
			<Link
				to="/cocina"
				viewTransition={{ types: ["to-kitchen"] }}
				className={buttonVariants({ variant: "outline", size: "sm" })}
			>
				<Maximize2 aria-hidden="true" />
				Maximizar
			</Link>
		</div>
	);
}
