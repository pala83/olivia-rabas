import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/**
 * Routes come from the files in src/routes ("/" reception, "/cocina" kitchen); the Vite
 * plugin generates routeTree.gen.ts. Navigations run inside document.startViewTransition();
 * links add a direction type ("to-kitchen" / "to-reception") that index.css animates.
 */
export const router = createRouter({
	routeTree,
	defaultViewTransition: true,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
