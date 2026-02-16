ALTER TABLE "artifacts" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "papers" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "artifacts" ADD COLUMN "doi" text;--> statement-breakpoint
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_doi_unique" UNIQUE("doi");