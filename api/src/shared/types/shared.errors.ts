/** Base error for invalid input. Module errors extend it; the HTTP layer answers 400. */
export class ValidationError extends Error {
	override name = "ValidationError";
}

/** Base error for missing resources. Module errors extend it; the HTTP layer answers 404. */
export class NotFoundError extends Error {
	override name = "NotFoundError";
}
