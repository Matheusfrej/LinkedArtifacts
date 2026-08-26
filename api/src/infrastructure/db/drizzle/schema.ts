import { pgTable, serial, text, timestamp, integer, primaryKey, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const badgeNameEnum = pgEnum('badge_name', [
  'Available',
  'Evaluated & Functional',
  'Evaluated & Reusable',
  'Results Reproduced',
  'Results Replicated',
]);

export const papers = pgTable('papers', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  doi: text('doi').unique(),
  venue: text('venue').notNull(),
  year: integer('year').notNull(),
  authors: text('authors').notNull(),
  pageCount: integer('page_count'),
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

export const badges = pgTable('badges', {
  id: serial('id').primaryKey(),
  name: badgeNameEnum('name').notNull().unique(),
});

export const paperBadges = pgTable(
  'paper_badges',
  {
    paperId: integer('paper_id')
      .notNull()
      .references(() => papers.id, { onDelete: 'cascade' }),

    badgeId: integer('badge_id')
      .notNull()
      .references(() => badges.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({
      columns: [table.paperId, table.badgeId],
    }),
  ],
);