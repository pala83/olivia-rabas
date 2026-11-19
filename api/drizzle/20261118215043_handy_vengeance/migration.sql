-- SQLite can't add a NOT NULL column without a default, so the column gets an empty default
-- and every existing order starts its timer at its creation time.
ALTER TABLE `COMANDA` ADD `timer_started_at` text NOT NULL DEFAULT '';--> statement-breakpoint
UPDATE `COMANDA` SET `timer_started_at` = `created_at`;
