import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Quest = { id: string; title: string; requirements: string; reward: number; active: boolean; created_by: string; created_at: string };
export type Submission = { id: string; quest_id: string; account_id: string; evidence_url: string; evidence_text: string; reward: number; status: string; reason: string | null; created_at: string; title: string };
export type Activity = { id: string | number; amount: number; reason: string; createdAt: string };
export type CommunityPublic = { quests: Quest[]; mint: string; gameRewardsEnabled: false };
export type CommunityMe = {
  accountId: string; isAdmin: boolean;
  wallet: { address: string; linkedAt: string } | null;
  seeds: { balance: number; earned: number; spent: number; lastDailyAt: string | null; lastCollectAt: string | null };
  activity: Activity[]; submissions: Submission[]; contributions: Record<string, unknown>[]; joinedAt: string;
};
export type HoldingsCurrent = { status: "current"; amount: string; rawAmount: string; decimals: number; program: string; mint: string; network: "Solana mainnet"; checkedAt: string; accountCount: number };
export type HoldingsUnavailable = { status: "unavailable"; error: string; mint: string; network: string };
export type Holdings = HoldingsCurrent | HoldingsUnavailable;
export type CommunityAdmin = { quests: Quest[]; submissions: Submission[]; audit: Record<string, unknown>[]; metrics: { members: number; wallets: number; submissions: number; approved: number; returning: number } };

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

const API = "/api";

async function req<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: body === undefined ? "GET" : "POST",
    credentials: "include",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let data: unknown = null;
  try { data = await res.json(); } catch { /* non-json */ }
  if (!res.ok) {
    const msg = (data && typeof data === "object" && "error" in data && typeof (data as { error: unknown }).error === "string")
      ? (data as { error: string }).error : `Request failed (${res.status})`;
    throw new ApiError(res.status, msg);
  }
  return data as T;
}

export const keys = {
  pub: ["community", "public"] as const,
  me: ["community", "me"] as const,
  holdings: ["community", "holdings"] as const,
  admin: ["community", "admin"] as const,
};

export type CommunityAction =
  | { action: "visit" } | { action: "daily" } | { action: "collect" }
  | { action: "challenge"; address: string; purpose: "link" | "unlink" }
  | { action: "walletVerify"; id: string; signature: string }
  | { action: "submit"; questId: string; evidenceUrl: string; evidenceText: string }
  | { action: "contribute"; itemId: number; amount: number; requestId: string };

export type AdminAction =
  | { action: "questCreate"; title: string; requirements: string; reward: number; active: boolean }
  | { action: "questToggle"; id: string; active: boolean }
  | { action: "review"; id: string; decision: "approved" | "rejected"; reason: string };

export const communityAction = <T = Record<string, unknown>>(b: CommunityAction) => req<{ ok: true } & T>("/community/action", b);
export const adminAction = (b: AdminAction) => req<{ ok: true } & Record<string, unknown>>("/community/admin/action", b);

export function useCommunityPublic() {
  return useQuery({ queryKey: keys.pub, queryFn: () => req<CommunityPublic>("/community/public") });
}
export function useCommunityMe(enabled: boolean) {
  return useQuery({ queryKey: keys.me, queryFn: () => req<CommunityMe>("/community/me"), enabled, retry: false });
}
export function useCommunityAdmin(enabled: boolean) {
  return useQuery({ queryKey: keys.admin, queryFn: () => req<CommunityAdmin>("/community/admin"), enabled, retry: false });
}
export const fetchHoldings = () => req<Holdings>("/community/holdings");

export function useCommunityAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (b: CommunityAction) => communityAction(b),
    onSuccess: (_d, b) => { if (b.action !== "challenge") qc.invalidateQueries({ queryKey: keys.me }); },
  });
}
export function useAdminAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (b: AdminAction) => adminAction(b),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.admin }); qc.invalidateQueries({ queryKey: keys.pub }); },
  });
}

export const fmtDate = (s: string | null | undefined) => s ? new Date(s).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "Never";
export const short = (a: string) => a.length > 12 ? `${a.slice(0, 4)}…${a.slice(-4)}` : a;
