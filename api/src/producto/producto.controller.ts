import type { Database } from "../db/client.ts";
import { json, withErrorHandling } from "../shared/http.ts";

export const productoController = (db: Database) => ({
	"/api/products": {
		GET: withErrorHandling(async () =>
			json(await db.query.producto.findMany({ orderBy: { id: "asc" } })),
		),
	},
});
