import {
	NotFoundError,
	ValidationError,
} from "../../shared/types/shared.errors.ts";

/** The order request body does not have the expected shape. */
export class InvalidOrderError extends ValidationError {
	override name = "InvalidOrderError";
}

/** The status change body does not carry a known order status. */
export class InvalidOrderStatusError extends ValidationError {
	override name = "InvalidOrderStatusError";
}

/** An order item points to a product that is not in the catalog. */
export class UnknownProductError extends ValidationError {
	override name = "UnknownProductError";

	constructor(productId: number) {
		super(`Product ${productId} does not exist`);
	}
}

/** `withSalt` is missing for a food product, or sent for a drink. */
export class InvalidSaltOptionError extends ValidationError {
	override name = "InvalidSaltOptionError";
}

/** No order matches the requested id. */
export class OrderNotFoundError extends NotFoundError {
	override name = "OrderNotFoundError";

	constructor(id: string | number) {
		super(`Order ${id} not found`);
	}
}
