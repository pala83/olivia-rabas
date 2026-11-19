CREATE TABLE `COMANDA` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`customer_name` text NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ITEM_COMANDA` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`comanda_id` integer NOT NULL,
	`producto_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`with_salt` integer,
	CONSTRAINT `fk_ITEM_COMANDA_comanda_id_COMANDA_id_fk` FOREIGN KEY (`comanda_id`) REFERENCES `COMANDA`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_ITEM_COMANDA_producto_id_PRODUCTO_id_fk` FOREIGN KEY (`producto_id`) REFERENCES `PRODUCTO`(`id`)
);
--> statement-breakpoint
CREATE TABLE `PRODUCTO` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`contains_alcohol` integer,
	`brand` text
);
--> statement-breakpoint
CREATE INDEX `ITEM_COMANDA_comanda_id` ON `ITEM_COMANDA` (`comanda_id`);