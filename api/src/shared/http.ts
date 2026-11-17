import { NotFoundError, ValidationError } from "./types/shared.errors.ts";

export const json = (data: unknown, status = 200): Response =>
	Response.json(data, { status });

export const withErrorHandling =
	<Args extends unknown[]>(handler: (...args: Args) => Promise<Response>) =>
	async (...args: Args): Promise<Response> => {
		try {
			return await handler(...args);
		} catch (error) {
			if (error instanceof ValidationError)
				return json({ error: error.message }, 400);
			if (error instanceof NotFoundError)
				return json({ error: error.message }, 404);
			console.error(error);
			return json({ error: "Internal server error" }, 500);
		}
	};
