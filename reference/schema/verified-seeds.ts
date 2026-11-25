import { pgTable, text, integer, timestamp, bigserial, uniqueIndex } from "drizzle-orm/pg-core";

// A separate, prospectively earned balance. Legacy session_id balances cannot be
// transferred into this table by an untrusted browser-supplied session ID.
export const verifiedSeedAccountsTable = pgTable("verified_seed_accounts", {
  accountId: text("account_id").primaryKey(),
  balance: integer("balance").notNull().default(0),
  earned: integer("earned").notNull().default(0),
  spent: integer("spent").notNull().default(0),
  lastDailyAt: timestamp("last_daily_at", { withTimezone: true }),
  lastCollectAt: timestamp("last_collect_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const verifiedSeedLedgerTable = pgTable("verified_seed_ledger", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  accountId: text("account_id").notNull().references(() => verifiedSeedAccountsTable.accountId),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  idempotencyKey: text("idempotency_key").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, table => [
  uniqueIndex("verified_seed_ledger_idempotency_key_unique").on(table.idempotencyKey),
]);