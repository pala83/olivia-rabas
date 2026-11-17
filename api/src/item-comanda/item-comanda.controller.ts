import { json, withErrorHandling } from "../shared/http.ts";
import type { ItemComandaService } from "./item-comanda.service.ts";

export const itemComandaController = (service: ItemComandaService) => ({
	"/api/orders/:id/items": {
		GET: withErrorHandling(
			async (request: Bun.BunRequest<"/api/orders/:id/items">) =>
				json(await service.listByOrder(request.params.id)),
		),
	},
});
