import { ProductMenu } from "@/features/catalog/components/ProductMenu/ProductMenu";
import { DraftPanel } from "@/features/order-draft/components/DraftPanel/DraftPanel";
import { KitchenPanel } from "@/features/orders/components/KitchenPanel/KitchenPanel";
import { ReceptionLayout } from "@/layouts/ReceptionLayout/ReceptionLayout";

/** Route "/": the receptionist builds and sends orders. */
export function ReceptionPage() {
	return (
		<ReceptionLayout
			draft={<DraftPanel />}
			menu={<ProductMenu />}
			kitchen={<KitchenPanel />}
		/>
	);
}
