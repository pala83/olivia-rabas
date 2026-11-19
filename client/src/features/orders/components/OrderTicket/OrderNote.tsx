import { MessageSquare } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/** shadcn Alert with butter background so the note can't be missed. */
export function OrderNote({ note }: { note: string }) {
	return (
		<Alert
			role="note"
			className="border-[#F2C46B] bg-[#FFF4D6] px-4 py-3 text-foreground"
		>
			<MessageSquare aria-hidden="true" />
			<AlertTitle className="font-medium">Nota de recepción</AlertTitle>
			<AlertDescription className="text-base leading-[22px] text-foreground">
				{note}
			</AlertDescription>
		</Alert>
	);
}
