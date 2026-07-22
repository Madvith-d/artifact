CREATE TABLE "users" (
	"id" uuid PRIMARY KEY,
	"username" text NOT NULL UNIQUE,
	"email" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
