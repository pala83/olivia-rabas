import { KitchenBoard } from "@/features/orders/components/KitchenBoard/KitchenBoard";
import { KitchenLayout } from "@/layouts/KitchenLayout/KitchenLayout";

/** Route "/cocina": the cook moves orders across the lanes. */
export function KitchenPage() {
	return (
		<KitchenLayout>
			<KitchenBoard />
		</KitchenLayout>
	);
}
