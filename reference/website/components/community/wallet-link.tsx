import { useEffect, useRef, useState } from "react";
import { Wallet, ShieldCheck, Smartphone, Unlink, AlertTriangle, ExternalLink } from "lucide-react";
import { communityAction, fmtDate, short, keys, type CommunityMe } from "@/lib/community-api";
import { useQueryClient } from "@tanstack/react-query";

type Provider = "phantom" | "solflare";
type Adapter = { connect(): Promise<void>; disconnect(): Promise<void>; publicKey: { toBase58(): string } | null; signMessage(m: Uint8Array): Promise<Uint8Array> };

async function loadAdapter(p: Provider): Promise<Adapter> {
  if (p === "phantom") {
    const m = await import("@solana/wallet-adapter-phantom");
    return new m.PhantomWalletAdapter() as unknown as Adapter;
  }
  const m = await import("@solana/wallet-adapter-solflare");
  return new m.SolflareWalletAdapter() as unknown as Adapter;
}

const isIOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);

export function WalletLink({ me, accountId }: { me: CommunityMe; accountId: string }) {
  const qc = useQueryClient();
  const adapterRef = useRef<Adapter | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);

  useEffect(() => () => { adapterRef.current?.disconnect().catch(() => {}); adapterRef.current = null; }, [accountId]);

  const run = async (p: Provider, purpose: "link" | "unlink") => {
    setErr(null); setBusy(`${purpose}-${p}`);
    try {
      const a = await loadAdapter(p);
      adapterRef.current = a;
      await a.connect();
      const address = a.publicKey?.toBase58();
      if (!address) throw new Error("Wallet did not return a public key.");
      if (purpose === "unlink" && me.wallet && address !== me.wallet.address)
        throw new Error(`Connected wallet ${short(address)} does not match linked wallet ${short(me.wallet.address)}. Unlinking requires a signature from the same address.`);
      const ch = await communityAction<{ id: string; message: string; expiresAt: string }>({ action: "challenge", address, purpose });
      const sig = await a.signMessage(new TextEncoder().encode(ch.message));
      const bs58 = (await import("bs58")).default;
      await communityAction({ action: "walletVerify", id: ch.id, signature: bs58.encode(sig) });
      await qc.invalidateQueries({ queryKey: keys.me });
      qc.removeQueries({ queryKey: keys.holdings });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Wallet request failed.");
    } finally {
      adapterRef.current?.disconnect().catch(() => {});
      adapterRef.current = null;
      setBusy(null);
    }
  };

  const here = typeof window !== "undefined" ? window.location.href : "";
  const ref = typeof window !== "undefined" ? window.location.origin : "";
  const phantomLink = `https://phantom.com/ul/browse/${encodeURIComponent(here)}?ref=${encodeURIComponent(ref)}`;
  const solflareLink = `https://solflare.com/ul/v1/browse/${encodeURIComponent(here)}?ref=${encodeURIComponent(ref)}`;

  return (
    <div className="space-y-5" data-testid="panel-wallet">
      {me.wallet ? (
        <div className="border border-primary/40 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-primary"><ShieldCheck className="w-4 h-4" /> Linked by signature</div>
          <p className="mt-2 font-mono text-sm break-all text-foreground" data-testid="text-wallet-address">{me.wallet.address}</p>
          <p className="text-xs text-muted-foreground mt-1">Linked {fmtDate(me.wallet.linkedAt)}. The link persists until you sign an unlink challenge with this same address.</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {(["phantom", "solflare"] as Provider[]).map((p) => (
              <button key={p} disabled={!!busy} onClick={() => run(p, "unlink")} data-testid={`button-unlink-${p}`}
                className="inline-flex min-h-11 items-center gap-2 px-4 border border-border/70 text-xs uppercase tracking-widest hover:border-destructive/60 hover:text-destructive disabled:opacity-50">
                <Unlink className="w-4 h-4" /> {busy === `unlink-${p}` ? "Waiting for signature…" : `Unlink via ${p === "phantom" ? "Phantom" : "Solflare"}`}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="border border-accent/30 bg-accent/5 p-4 text-sm text-muted-foreground leading-relaxed">
            <p className="text-foreground font-medium mb-1">Privacy notice</p>
            Linking a wallet associates that public address — and all of its public on-chain activity — with your POTIFY account. Linking is optional. Daily Seeds, quests and the free spin do not need a wallet. You will only sign a text message; no transaction is ever requested.
            <label className="flex items-start gap-3 mt-3 text-foreground cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-[hsl(var(--primary))]" data-testid="checkbox-wallet-consent" />
              <span>I understand and consent to this association.</span>
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {(["phantom", "solflare"] as Provider[]).map((p) => (
              <button key={p} disabled={!consent || !!busy} onClick={() => run(p, "link")} data-testid={`button-link-${p}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 px-4 border border-primary/50 bg-primary/10 text-sm uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none">
                <Wallet className="w-4 h-4" /> {busy === `link-${p}` ? "Waiting for signature…" : `Link ${p === "phantom" ? "Phantom" : "Solflare"}`}
              </button>
            ))}
          </div>
        </>
      )}
      {err && <p role="alert" className="flex gap-2 text-sm text-destructive" data-testid="text-wallet-error"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{err}</p>}
      <details className="border border-border/50 p-4 text-sm text-muted-foreground" open={isIOS}>
        <summary className="cursor-pointer flex items-center gap-2 text-foreground"><Smartphone className="w-4 h-4" /> On iPhone</summary>
        <p className="mt-3 leading-relaxed">Mobile Safari cannot reach wallet extensions. Open this page inside the wallet's own in-app browser, sign in, then link from there.</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <a href={phantomLink} className="inline-flex min-h-11 items-center gap-2 px-4 border border-border/70 hover:border-primary/60" data-testid="link-phantom-browse">Open in Phantom <ExternalLink className="w-3 h-3" /></a>
          <a href={solflareLink} className="inline-flex min-h-11 items-center gap-2 px-4 border border-border/70 hover:border-primary/60" data-testid="link-solflare-browse">Open in Solflare <ExternalLink className="w-3 h-3" /></a>
        </div>
        <p className="mt-3 text-xs text-amber-500/80">Signing on real iPhone devices has not yet been certified. If it fails, use a desktop browser with the extension.</p>
      </details>
    </div>
  );
}
