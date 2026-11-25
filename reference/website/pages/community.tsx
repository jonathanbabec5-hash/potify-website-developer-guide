import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { useUser } from "@clerk/react";
import { Sprout, Sun, Leaf, ExternalLink, Gamepad2, AlertTriangle, MailCheck, Lock, RotateCw } from "lucide-react";
import { CommunityShell, Panel, Skel } from "@/components/community/shell";
import { WalletLink } from "@/components/community/wallet-link";
import { HoldingsPanel } from "@/components/community/holdings-panel";
import { QuestCard } from "@/components/community/quest-board";
import { useCommunityPublic, useCommunityMe, useCommunityAction, fmtDate, ApiError, type CommunityMe } from "@/lib/community-api";

const SEEDS_NOTE = "Seeds are off-chain, nontransferable community points — not $POTIFY tokens.";
const redirect = encodeURIComponent("/community");

function Benefits() {
  const rows: [string, string, boolean][] = [
    ["Participation and quests", "Available now", true],
    ["Holding thresholds / tiers", "Not enabled — no minimum holding", false],
    ["Holder rewards or payouts", "Not enabled — no automatic payouts", false],
    ["Game (Vape God) rewards", "Not enabled — game remains playable", false],
  ];
  return (
    <ul className="divide-y divide-border/40" data-testid="list-benefits">
      {rows.map(([k, v, on]) => (
        <li key={k} className="flex justify-between gap-4 py-3 text-sm">
          <span className="text-foreground">{k}</span>
          <span className={`font-mono text-xs text-right ${on ? "text-primary" : "text-muted-foreground"}`}>{v}</span>
        </li>
      ))}
    </ul>
  );
}

function SeedsActions({ me }: { me: CommunityMe }) {
  const act = useCommunityAction();
  const pending = act.isPending ? (act.variables?.action ?? null) : null;
  return (
    <div>
      <div className="flex items-end gap-3">
        <span className="font-serif text-6xl text-heir leading-none" data-testid="text-seeds-balance">{me.seeds.balance}</span>
        <span className="text-primary pb-1 uppercase tracking-widest text-xs">Seeds</span>
      </div>
      <p className="text-xs font-mono text-muted-foreground mt-2">Earned {me.seeds.earned} · Spent {me.seeds.spent}</p>
      <p className="text-xs text-muted-foreground mt-1">{SEEDS_NOTE}</p>
      <div className="grid grid-cols-2 gap-2 mt-5">
        <button onClick={() => act.mutate({ action: "daily" })} disabled={!!pending} data-testid="button-daily" className="min-h-12 border border-primary/50 bg-primary/10 text-primary text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2"><Sun className="w-4 h-4" />{pending === "daily" ? "Claiming…" : "Daily"}</button>
        <button onClick={() => act.mutate({ action: "collect" })} disabled={!!pending} data-testid="button-collect" className="min-h-12 border border-accent/50 bg-accent/10 text-accent text-xs uppercase tracking-widest hover:bg-accent hover:text-accent-foreground disabled:opacity-50 flex items-center justify-center gap-2"><Leaf className="w-4 h-4" />{pending === "collect" ? "Collecting…" : "Collect"}</button>
      </div>
      <p className="text-[11px] font-mono text-muted-foreground mt-2">Last daily {fmtDate(me.seeds.lastDailyAt)} · Last collect {fmtDate(me.seeds.lastCollectAt)}</p>
      {act.error && <p role="alert" className="text-sm text-destructive mt-2" data-testid="text-seeds-error">{act.error.message}</p>}
      {act.isSuccess && <p className="text-sm text-primary mt-2" role="status">{act.data.awarded === false ? "Already claimed or on cooldown. No additional Seeds awarded." : "Earned Seeds recorded on the community ledger."}</p>}
    </div>
  );
}

function Dashboard({ me }: { me: CommunityMe }) {
  const pub = useCommunityPublic();
  const act = useCommunityAction();
  const visited = useRef(false);
  const visitRef = useRef(act.mutate);
  visitRef.current = act.mutate;
  useEffect(() => { if (!visited.current) { visited.current = true; visitRef.current({ action: "visit" }); } }, []);
  const quests = (pub.data?.quests ?? []).filter((q) => q.active);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/70">Member since {fmtDate(me.joinedAt)}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-heir mt-2">Holder Hub</h1>
        </div>
        {me.isAdmin && <Link href="/community/admin" className="min-h-11 inline-flex items-center gap-2 px-4 border border-accent/60 text-accent text-xs uppercase tracking-widest" data-testid="link-admin"><Lock className="w-4 h-4" />Owner console</Link>}
      </div>
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
        <Panel kicker="Canonical ledger" title="Your Seeds"><SeedsActions me={me} /></Panel>
        <Panel kicker="Optional" title="Wallet"><WalletLink me={me} accountId={me.accountId} /></Panel>
      </div>
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
        <Panel kicker="Read on demand" title="Public holdings"><HoldingsPanel key={`${me.accountId}:${me.wallet?.address ?? "none"}`} hasWallet={!!me.wallet} /></Panel>
        <Panel kicker="Membership" title="What is enabled"><Benefits /></Panel>
      </div>
      <Panel kicker="Earn by contributing" title="Quests">
        {pub.isLoading ? <div className="grid md:grid-cols-2 gap-4"><Skel className="h-40" /><Skel className="h-40" /></div>
          : pub.error ? <p className="text-sm text-destructive">Could not load quests: {pub.error.message} <button onClick={() => pub.refetch()} className="underline">Retry</button></p>
          : quests.length === 0 ? <p className="text-sm text-muted-foreground">No active quests right now. The owner opens new ones here.</p>
          : <div className="grid md:grid-cols-2 gap-4">{quests.map((q) => <QuestCard key={q.id} quest={q} submissions={me.submissions} canSubmit />)}</div>}
        {me.submissions.length > 0 && (
          <div className="mt-6">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-2">All your submissions</h3>
            <ul className="divide-y divide-border/40 text-sm">
              {me.submissions.map((s) => (
                <li key={s.id} className="py-2 flex flex-wrap justify-between gap-2" data-testid={`row-submission-${s.id}`}>
                  <span>{s.title}</span><span className="font-mono text-xs text-muted-foreground">{s.status} · {s.reward} Seeds · {fmtDate(s.created_at)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Panel>
      <div className="grid lg:grid-cols-2 gap-6">
        <Panel kicker="Ledger" title="Activity">
          {me.activity.length === 0 ? <p className="text-sm text-muted-foreground">No ledger entries yet. Claim your daily Seeds to start.</p> : (
            <ul className="divide-y divide-border/40 text-sm max-h-80 overflow-y-auto" data-testid="list-activity">
              {me.activity.map((a) => (
                <li key={a.id} className="py-2 flex justify-between gap-3">
                  <span className="text-foreground">{a.reason}<span className="block text-[11px] font-mono text-muted-foreground">{fmtDate(a.createdAt)}</span></span>
                  <span className={`font-mono ${a.amount >= 0 ? "text-primary" : "text-destructive"}`}>{a.amount >= 0 ? "+" : ""}{a.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel kicker="Merch unlocks" title="Greenhouse">
          <p className="text-sm text-muted-foreground leading-relaxed">Greenhouse contributions spend from this same canonical ledger. You have {me.contributions.length} recorded contribution(s).</p>
          <p className="text-sm text-amber-500/90 mt-3 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />Earlier anonymous Greenhouse history is pending owner reconciliation and has not been imported into your account.</p>
          <Link href="/greenhouse" className="mt-4 min-h-11 inline-flex items-center gap-2 px-4 border border-primary/50 text-primary text-xs uppercase tracking-widest" data-testid="link-open-greenhouse"><Sprout className="w-4 h-4" />Open Greenhouse</Link>
          <div className="mt-6 pt-4 border-t border-border/40">
            <p className="text-sm text-muted-foreground flex gap-2"><Gamepad2 className="w-4 h-4 shrink-0 mt-0.5" />Vape God is still playable. Game rewards are disabled pending secure server validation.</p>
            <a href="/vape-god/" className="mt-2 inline-block text-xs text-primary underline underline-offset-4" data-testid="link-game">Play Vape God</a>
          </div>
        </Panel>
      </div>
      <ReclaimNote />
    </div>
  );
}

function ReclaimNote() {
  return (
    <aside className="border border-border/40 p-5 text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <span>Project Reclaim is an independent external utility. Its wallet support has not been verified by POTIFY.</span>
      <a href="https://potify-project-reclaim.replit.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent text-xs uppercase tracking-widest whitespace-nowrap" data-testid="link-reclaim">Project Reclaim <ExternalLink className="w-3 h-3" /></a>
    </aside>
  );
}

function PublicView() {
  const pub = useCommunityPublic();
  return (
    <div className="space-y-10">
      <section className="py-6 md:py-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-accent/80">POTIFY Community</p>
        <h1 className="font-serif text-5xl md:text-8xl text-heir mt-4 leading-[0.95]">Tend the canopy<br />together.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mt-6">Claim daily Seeds, complete quests reviewed by a human, and support shared Greenhouse goals. No wallet required. {SEEDS_NOTE}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <a href={`/sign-up?redirect_url=${redirect}`} className="min-h-12 inline-flex items-center justify-center px-8 bg-primary text-primary-foreground uppercase tracking-[0.2em] text-sm" data-testid="link-sign-up">Join the community</a>
          <a href={`/sign-in?redirect_url=${redirect}`} className="min-h-12 inline-flex items-center justify-center px-8 border border-border text-foreground uppercase tracking-[0.2em] text-sm" data-testid="link-sign-in">Sign in</a>
        </div>
      </section>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <Panel kicker="Open now" title="Quests">
          {pub.isLoading ? <div className="space-y-3"><Skel className="h-32" /><Skel className="h-32" /></div>
            : pub.error ? <p className="text-sm text-destructive">Could not load quests: {pub.error.message} <button onClick={() => pub.refetch()} className="underline inline-flex items-center gap-1"><RotateCw className="w-3 h-3" />Retry</button></p>
            : pub.data!.quests.filter((q) => q.active).length === 0 ? <p className="text-sm text-muted-foreground">No active quests yet.</p>
            : <div className="space-y-4">{pub.data!.quests.filter((q) => q.active).map((q) => <QuestCard key={q.id} quest={q} canSubmit={false} />)}</div>}
        </Panel>
        <div className="space-y-6">
          <Panel kicker="Honest scope" title="What is enabled"><Benefits /></Panel>
          {pub.data && <Panel kicker="Token" title="$POTIFY mint"><p className="font-mono text-xs break-all text-muted-foreground" data-testid="text-mint">{pub.data.mint}</p></Panel>}
        </div>
      </div>
      <ReclaimNote />
    </div>
  );
}

function Member() {
  const me = useCommunityMe(true);
  if (me.isLoading) return <div className="space-y-6"><Skel className="h-16 w-72" /><div className="grid lg:grid-cols-2 gap-6"><Skel className="h-64" /><Skel className="h-64" /></div></div>;
  if (me.error) {
    const st = me.error instanceof ApiError ? me.error.status : 0;
    if (st === 401 || st === 403) return (
      <Panel kicker="One more step" title="Verify your email">
        <p className="text-sm text-muted-foreground flex gap-2"><MailCheck className="w-4 h-4 shrink-0 mt-0.5 text-primary" />The member hub requires a verified primary email. {me.error.message}</p>
        <p className="text-sm text-muted-foreground mt-2">Verify the code sent to your inbox via your account, then retry.</p>
        <button onClick={() => me.refetch()} className="mt-4 min-h-11 px-4 border border-primary/50 text-primary text-xs uppercase tracking-widest" data-testid="button-retry-me">Retry</button>
      </Panel>
    );
    return <Panel title="Hub unavailable"><p className="text-sm text-destructive">{me.error.message}</p><button onClick={() => me.refetch()} className="mt-4 min-h-11 px-4 border border-border text-xs uppercase tracking-widest">Retry</button></Panel>;
  }
  return <Dashboard me={me.data!} />;
}

export default function Community() {
  const { isLoaded, isSignedIn } = useUser();
  return (
    <CommunityShell>
      {!isLoaded ? <Skel className="h-64" /> : isSignedIn ? <Member /> : <PublicView />}
    </CommunityShell>
  );
}
