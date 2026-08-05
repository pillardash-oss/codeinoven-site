CREATE TABLE `agents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`vendor` text,
	`description` text,
	`website_url` text,
	`github_url` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agents_slug_unique` ON `agents` (`slug`);--> statement-breakpoint
CREATE INDEX `agents_status_idx` ON `agents` (`status`);--> statement-breakpoint
CREATE TABLE `icons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agent_id` integer NOT NULL,
	`format` text NOT NULL,
	`file_path` text NOT NULL,
	`source_url` text NOT NULL,
	`width` integer,
	`height` integer,
	`file_hash` text NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`verified_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `icons_agent_idx` ON `icons` (`agent_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `icons_agent_format_idx` ON `icons` (`agent_id`,`format`);--> statement-breakpoint
CREATE TABLE `sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agent_id` integer NOT NULL,
	`source_url` text NOT NULL,
	`source_type` text NOT NULL,
	`priority` integer DEFAULT 100 NOT NULL,
	`last_checked_at` text,
	`last_status` text,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sources_agent_idx` ON `sources` (`agent_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sources_agent_url_idx` ON `sources` (`agent_id`,`source_url`);