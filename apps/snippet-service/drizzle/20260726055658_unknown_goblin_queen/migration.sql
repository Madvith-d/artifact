CREATE TYPE "language" AS ENUM('typescript', 'javascript', 'python', 'java', 'c++', 'c', 'html', 'css', 'sql', 'bash', 'powershell', '');--> statement-breakpoint
CREATE TYPE "visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "snippets" (
	"id" uuid PRIMARY KEY,
	"title" text NOT NULL,
	"description" text,
	"language" "language",
	"code" text NOT NULL,
	"visibility" "visibility" NOT NULL,
	"owner_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
