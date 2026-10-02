CREATE TYPE "execution_status" AS ENUM('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'TIMEOUT');--> statement-breakpoint
CREATE TABLE "execution_jobs" (
	"id" uuid PRIMARY KEY,
	"snippet_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"language" text NOT NULL,
	"status" "execution_status" DEFAULT 'QUEUED'::"execution_status" NOT NULL,
	"stdout" text,
	"stderr" text,
	"exit_code" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);
