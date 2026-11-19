import { Link } from "@tanstack/react-router";
import { Minimize2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

/** Goes back to reception with the "to-reception" screen transition. */
export function BackToReceptionLink() {
	return (
		<Link
			to="/"
			viewTransition={{ types: ["to-reception"] }}
			className={buttonVariants({ variant: "secondary", size: "sm" })}
		>
			<Minimize2 aria-hidden="true" />
			Volver a recepción
		</Link>
	);
}
