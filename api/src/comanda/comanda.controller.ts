import { json, withErrorHandling } from "../shared/http.ts";
import type { ComandaService } from "./comanda.service.ts";

export const comandaController = (service: ComandaService) => ({
	"/api/orders": {
		GET: withErrorHandling(async () => json(await service.list())),
		POST: withErrorHandling(async (request: Request) =>
			json(await service.create(await request.text()), 201),
		),
	},
	"/api/orders/:id": {
		GET: withErrorHandling(async (request: Bun.BunRequest<"/api/orders/:id">) =>
			json(await service.get(request.params.id)),
		),
	},
	"/api/orders/:id/status": {
		PATCH: withErrorHandling(
			async (request: Bun.BunRequest<"/api/orders/:id/status">) =>
				json(
					await service.changeStatus(request.params.id, await request.text()),
				),
		),
	},
});
