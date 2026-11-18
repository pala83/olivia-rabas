import { createFileRoute } from "@tanstack/react-router";
import { KitchenPage } from "@/pages/KitchenPage/KitchenPage";

export const Route = createFileRoute("/cocina")({ component: KitchenPage });
