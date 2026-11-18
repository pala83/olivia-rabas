import { GlassWater } from "lucide-react";
import { FriesIcon } from "@/components/icons/FriesIcon";
import { Separator } from "@/components/ui/separator";
import { useOrderDraftContext } from "@/contexts/order-draft/use-order-draft-context";
import { DraftFooter } from "./DraftFooter";
import { DraftHeader } from "./DraftHeader";
import { DraftItemGroup } from "./DraftItemGroup";
import { DraftNote } from "./DraftNote";

/** Kraft column "Nueva comanda": table, loaded items, note and "Enviar a cocina". */
export function DraftPanel() {
	const draft = useOrderDraftContext();

	return (
		<>
			<DraftHeader />
			<Separator className="mx-2 w-auto bg-sidebar-border" />
			{/* Only the loaded items and the note scroll; header and "Enviar a cocina" stay put. */}
			<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto *:shrink-0">
				<DraftItemGroup
					id="kds-g-comida"
					title="Comida"
					icon={<FriesIcon />}
					lines={draft.food}
					emptyTitle="Sin comida todavía"
					emptyDescription="Tocá Papas o Rabas para sumar."
				/>
				<DraftItemGroup
					id="kds-g-bebida"
					title="Bebida"
					icon={<GlassWater aria-hidden="true" />}
					lines={draft.drinks}
					emptyTitle="Sin bebida todavía"
					emptyDescription="Tocá una bebida para sumarla."
				/>
				<DraftNote />
			</div>
			<DraftFooter />
		</>
	);
}
