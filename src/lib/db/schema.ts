import { serial, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const $workspaces = pgTable("workspaces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  imageUrl: text("imageUrl"),
  userId: text("user_id").notNull(),
  editorState: text("editor_state"),
});

export type NoteType = typeof $workspaces.$inferInsert;

// drizzle-orm
// drizzle-kit
