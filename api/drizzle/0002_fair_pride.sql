CREATE TABLE "badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "badges_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "paper_badges" (
	"paper_id" integer NOT NULL,
	"badge_id" integer NOT NULL,
	CONSTRAINT "paper_badges_paper_id_badge_id_pk" PRIMARY KEY("paper_id","badge_id")
);
--> statement-breakpoint
ALTER TABLE "papers" ADD COLUMN "venue" text NOT NULL;--> statement-breakpoint
ALTER TABLE "papers" ADD COLUMN "year" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "papers" ADD COLUMN "authors" text NOT NULL;--> statement-breakpoint
ALTER TABLE "papers" ADD COLUMN "page_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "paper_badges" ADD CONSTRAINT "paper_badges_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_badges" ADD CONSTRAINT "paper_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;