/** Error raised when the API answers with a non-2xx status; `message` is the API's `{ error }` text. */
export class ApiError extends Error {
	override name = "ApiError";
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

type ErrorBody = { error?: string };

/** Calls the API through the Vite proxy and returns the parsed JSON body. */
export const requestJson = async <T>(
	path: string,
	init?: RequestInit,
): Promise<T> => {
	const response = await fetch(path, {
		...init,
		headers: { "Content-Type": "application/json", ...init?.headers },
	});
	const body: unknown = await response.json().catch(() => null);
	if (!response.ok) {
		const message =
			(body as ErrorBody | null)?.error ??
			`Request failed (${response.status})`;
		throw new ApiError(response.status, message);
	}
	return body as T;
};
