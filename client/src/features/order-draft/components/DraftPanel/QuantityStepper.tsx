import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { useOrderDraftContext } from "@/contexts/order-draft/use-order-draft-context";

type QuantityStepperProps = {
	lineKey: string;
	quantity: number;
	/** Product text for screen readers, e.g. "Papas sin sal". */
	label: string;
};

/** ButtonGroup "−  n  +" from the design. */
export function QuantityStepper({
	lineKey,
	quantity,
	label,
}: QuantityStepperProps) {
	const { increment, decrement } = useOrderDraftContext();

	return (
		<ButtonGroup className="flex-none">
			<Button
				variant="outline"
				size="icon-sm"
				aria-label={`Quitar uno: ${label}`}
				onClick={() => decrement(lineKey)}
			>
				<Minus />
			</Button>
			<ButtonGroupText className="h-8 min-w-9 justify-center rounded-none border-x-0 border-input bg-muted px-1.5 font-mono font-semibold">
				<span
					key={quantity}
					className="inline-block animate-[kds-pop_0.3s_ease-out]"
				>
					{quantity}
				</span>
			</ButtonGroupText>
			<Button
				variant="outline"
				size="icon-sm"
				aria-label={`Sumar uno: ${label}`}
				onClick={() => increment(lineKey)}
			>
				<Plus />
			</Button>
		</ButtonGroup>
	);
}
