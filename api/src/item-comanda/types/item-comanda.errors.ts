import { NotFoundError } from "../../shared/types/shared.errors.ts";

/** No order matches the id whose items were requested. */
export class OrderItemsNotFoundError extends NotFoundError {
	override name = "OrderItemsNotFoundError";

	constructor(orderId: string | number) {
		super(`Order ${orderId} not found`);
	}
}
