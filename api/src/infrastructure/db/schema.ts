import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const artifacts = pgTable('artifacts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  verified: boolean('verified').default(false),
  createdAt: timestamp('created_at').defaultNow()
});
