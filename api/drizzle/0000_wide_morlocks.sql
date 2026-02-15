CREATE TABLE "artifacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"url" text NOT NULL,
	"paper_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "papers" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"doi" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "papers_doi_unique" UNIQUE("doi")
);
--> statement-breakpoint
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;