import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOrderDraftContext } from "@/contexts/order-draft/use-order-draft-context";
import { MAX_NOTE } from "../../use-order-draft";

/** "Nota para cocina (opcional)", up to 80 characters with a counter. */
export function DraftNote() {
	const { note, setNote } = useOrderDraftContext();

	return (
		<div className="flex flex-col gap-2 px-4 py-2">
			<Label htmlFor="kds-nota">Nota para cocina (opcional)</Label>
			<Textarea
				id="kds-nota"
				rows={2}
				value={note}
				maxLength={MAX_NOTE}
				placeholder="Ej.: rabas bien doradas"
				onChange={(event) => setNote(event.target.value)}
				className="min-h-16 resize-none border-input bg-card shadow-xs"
			/>
			<span className="self-end font-mono text-xs text-muted-foreground">
				{note.length} / {MAX_NOTE}
			</span>
		</div>
	);
}
