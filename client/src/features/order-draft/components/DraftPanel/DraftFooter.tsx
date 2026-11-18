import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderDraftContext } from "@/contexts/order-draft/use-order-draft-context";

/** Status line and the single gold "Enviar a cocina" button of the screen. */
export function DraftFooter() {
	const { status, send, total, sending } = useOrderDraftContext();
	const disabled = total === 0 || sending;

	return (
		<div className="mt-auto flex flex-col gap-2 border-t border-sidebar-border p-2">
			<p
				role="status"
				aria-live="polite"
				className="m-0 min-h-5 px-2 text-sm text-muted-foreground"
			>
				{status}
			</p>
			<Button
				variant="primary-gradient"
				size="lg"
				aria-disabled={disabled}
				onClick={send}
				className="w-full"
			>
				<Send aria-hidden="true" />
				{sending ? "Enviando…" : "Enviar a cocina"}
			</Button>
		</div>
	);
}
