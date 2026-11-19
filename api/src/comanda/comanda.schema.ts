import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ORDER_STATUSES = [
	"ORDERED",
	"IN_PREPARATION",
	"DELAYED",
	"FINISHED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const comanda = sqliteTable("COMANDA", {
	id: integer().primaryKey({ autoIncrement: true }),
	customerName: text("customer_name").notNull(),
	notes: text(),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull(),
	timerStartedAt: text("timer_started_at").notNull(),
	status: text({ enum: ORDER_STATUSES }).notNull(),
});
