import { pgTable, text, serial, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const greenhouseStatusEnum = pgEnum("greenhouse_status", [
  "SEED", "ROOTS", "SOIL", "CANOPY", "FLIP", "STRETCH", "DENSITY", "CURE", "UNLOCKED"
]);

export const contributionModelEnum = pgEnum("contribution_model", [
  "seeds", "votes", "hybrid"
]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  seedBalance: integer("seed_balance").notNull().default(100),
  totalEarned: integer("total_earned").notNull().default(100),
  totalSpent: integer("total_spent").notNull().default(0),
  lastVisitAt: timestamp("last_visit_at"),
  lastCollectAt: timestamp("last_collect_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const greenhouseItemsTable = pgTable("greenhouse_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  unlockGoal: integer("unlock_goal").notNull(),
  currentSeeds: integer("current_seeds").notNull().default(0),
  status: greenhouseStatusEnum("status").notNull().default("SEED"),
  contributionModel: contributionModelEnum("contribution_model").notNull().default("seeds"),
  voteGoal: integer("vote_goal"),
  currentVotes: integer("current_votes").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contributionsTable = pgTable("contributions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  itemId: integer("item_id").notNull().references(() => greenhouseItemsTable.id),
  seedsAmount: integer("seeds_amount").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const seedTransactionsTable = pgTable("seed_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export const insertGreenhouseItemSchema = createInsertSchema(greenhouseItemsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertContributionSchema = createInsertSchema(contributionsTable).omit({ id: true, createdAt: true });
export const insertSeedTransactionSchema = createInsertSchema(seedTransactionsTable).omit({ id: true, createdAt: true });

export type User = typeof usersTable.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type GreenhouseItem = typeof greenhouseItemsTable.$inferSelect;
export type InsertGreenhouseItem = z.infer<typeof insertGreenhouseItemSchema>;
export type Contribution = typeof contributionsTable.$inferSelect;
export type SeedTransaction = typeof seedTransactionsTable.$inferSelect;
