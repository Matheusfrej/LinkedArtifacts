import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const papers = pgTable('papers', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  doi: text('doi').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const artifacts = pgTable('artifacts', {
  id: serial('id').primaryKey(),
  name: text('name'),
  url: text('url').notNull(),
  doi: text('doi').unique(),
  paperId: integer('paper_id').notNull().references(() => papers.id),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const papersRelations = relations(papers, ({ many }) => ({
  artifacts: many(artifacts),
}));

export const artifactsRelations = relations(artifacts, ({ one }) => ({
  paper: one(papers, {
    fields: [artifacts.paperId],
    references: [papers.id],
  }),
}));
