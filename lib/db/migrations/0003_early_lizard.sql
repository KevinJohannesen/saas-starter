ALTER TABLE "team_members" ADD COLUMN "position" varchar(100);--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "department" varchar(100);--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "hire_date" timestamp;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "emergency_contact" text;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "skills" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "certifications" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;