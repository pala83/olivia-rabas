import { createFileRoute } from "@tanstack/react-router";
import { ReceptionPage } from "@/pages/ReceptionPage/ReceptionPage";

export const Route = createFileRoute("/")({ component: ReceptionPage });
