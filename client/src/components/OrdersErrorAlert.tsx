import { TriangleAlert, X } from "lucide-react";
import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useOrdersContext } from "@/contexts/orders/use-orders-context";

/** Shows a failed status change (the board already rolled it back). */
export function OrdersErrorAlert() {
	const { error, dismissError } = useOrdersContext();
	if (!error) return null;
	return (
		<Alert
			variant="destructive"
			className="rounded-none border-x-0 border-t-0 px-4"
		>
			<TriangleAlert />
			<AlertDescription>{error}</AlertDescription>
			<AlertAction>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="Cerrar aviso"
					onClick={dismissError}
				>
					<X />
				</Button>
			</AlertAction>
		</Alert>
	);
}
