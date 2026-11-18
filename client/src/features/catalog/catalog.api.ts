import { requestJson } from "@/lib/http";
import type { Product } from "./catalog.types";

export const listProducts = () => requestJson<Product[]>("/api/products");
