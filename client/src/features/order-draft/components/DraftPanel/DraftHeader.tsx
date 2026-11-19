import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrderDraftContext } from "@/contexts/order-draft/use-order-draft-context";
import { MAX_CUSTOMER } from "../../use-order-draft";

/** Title and "Mesa o cliente". The next order number is unknown until the API assigns it. */
export function DraftHeader() {
	const { customer, setCustomer } = useOrderDraftContext();

	return (
		<div className="flex flex-col gap-3 p-2">
			<h2 className="m-0 font-serif text-[26px] leading-[30px] tracking-[0.01em]">
				Nueva comanda
			</h2>
			<div className="flex flex-col gap-2">
				<Label htmlFor="kds-mesa">Mesa o cliente</Label>
				<Input
					id="kds-mesa"
					value={customer}
					maxLength={MAX_CUSTOMER}
					autoComplete="off"
					placeholder="Ej.: Mesa 5"
					onChange={(event) => setCustomer(event.target.value)}
					className="h-9 border-input bg-card shadow-xs"
				/>
			</div>
		</div>
	);
}
