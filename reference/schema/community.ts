import { pgTable, text, timestamp, integer, boolean, bigserial, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { greenhouseItemsTable } from "./greenhouse";

const time = (name: string) => timestamp(name, { withTimezone: true }).notNull().defaultNow();
export const communityMembers = pgTable("community_members",{
  accountId:text("account_id").primaryKey(),joinedAt:time("joined_at"),lastSeenAt:time("last_seen_at"),visits:integer("visits").notNull().default(1),
});
export const communityWallets = pgTable("community_wallets",{
  accountId:text("account_id").primaryKey(),address:text("address").notNull().unique(),linkedAt:time("linked_at"),
});
export const communityChallenges = pgTable("community_challenges",{
  id:text("id").primaryKey(),accountId:text("account_id").notNull(),address:text("address").notNull(),message:text("message").notNull(),
  purpose:text("purpose").notNull(),expiresAt:timestamp("expires_at",{withTimezone:true}).notNull(),usedAt:timestamp("used_at",{withTimezone:true}),
});
export const communityQuests = pgTable("community_quests",{
  id:text("id").primaryKey(),title:text("title").notNull(),requirements:text("requirements").notNull(),reward:integer("reward").notNull(),
  active:boolean("active").notNull().default(false),createdBy:text("created_by").notNull(),createdAt:time("created_at"),
});
export const communitySubmissions = pgTable("community_submissions",{
  id:text("id").primaryKey(),questId:text("quest_id").notNull().references(()=>communityQuests.id),accountId:text("account_id").notNull(),
  evidenceUrl:text("evidence_url").notNull(),evidenceText:text("evidence_text").notNull(),evidenceHash:text("evidence_hash").notNull(),
  reward:integer("reward").notNull(),status:text("status").notNull().default("submitted"),reason:text("reason"),reviewedBy:text("reviewed_by"),
  createdAt:time("created_at"),reviewedAt:timestamp("reviewed_at",{withTimezone:true}),
}, t=>[uniqueIndex("community_submission_member_quest").on(t.questId,t.accountId),uniqueIndex("community_submission_evidence").on(t.questId,t.evidenceHash)]);
export const communityAudit = pgTable("community_audit",{
  id:bigserial("id",{mode:"number"}).primaryKey(),actor:text("actor").notNull(),action:text("action").notNull(),subject:text("subject").notNull(),
  details:jsonb("details").notNull().default({}),createdAt:time("created_at"),
});
export const communityRateLimits = pgTable("community_rate_limits",{
  key:text("key").primaryKey(),windowStart:time("window_start"),hits:integer("hits").notNull().default(1),
});
export const communityContributions = pgTable("community_contributions",{
  id:text("id").primaryKey(),accountId:text("account_id").notNull(),itemId:integer("item_id").notNull().references(()=>greenhouseItemsTable.id),
  amount:integer("amount").notNull(),createdAt:time("created_at"),
});
