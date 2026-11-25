import { useEffect, type ReactNode } from "react";
import { Link } from "wouter";
import { UserButton, useUser } from "@clerk/react";

export function CommunityShell({ children, admin }: { children: ReactNode; admin?: boolean }) {
  const {isSignedIn}=useUser();
  useEffect(()=>{
    const priorTitle=document.title;
    const priorDescription=document.querySelector('meta[name="description"]')?.getAttribute("content");
    document.title=admin?"Community Owner Console | POTIFY":"Community Holder Hub | POTIFY";
    const description=document.querySelector('meta[name="description"]');
    description?.setAttribute("content","Join the POTIFY community on Solana. Optional verified wallet holdings, off-chain Seeds and owner-reviewed contribution quests. Seed → Soil → Solana.");
    return()=>{
      document.title=priorTitle;
      if(priorDescription!==null&&priorDescription!==undefined)description?.setAttribute("content",priorDescription);
    };
  },[admin]);
  return (
    <div className="dark min-h-[100dvh] bg-background text-foreground font-sans grain-overlay">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="font-serif text-xl tracking-widest text-primary" data-testid="link-home">$POTIFY</Link>
          <nav className="flex items-center gap-4 text-[11px] uppercase tracking-wider text-muted-foreground">
            <Link href="/community" className={admin ? "hover:text-primary" : "text-primary"} data-testid="link-community">Community</Link>
            <Link href="/greenhouse" className="hover:text-primary" data-testid="link-greenhouse">Greenhouse</Link>
            <a href="/vape-god/" className="hidden sm:inline hover:text-primary">Game</a>
            {isSignedIn && <UserButton />}
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-5 py-10 md:py-16 max-w-6xl">{children}</main>
      <footer className="container mx-auto px-5 pb-10 max-w-6xl text-xs text-muted-foreground border-t border-border/40 pt-6">
        <p className="font-mono text-primary">Seed → Soil → Solana</p>
        <p className="mt-3">Holding $POTIFY does not grant ownership equity or guaranteed financial returns. Wallet linking is optional; free community participation and promotion entry do not require token holdings.</p>
        <Link href="/spin" className="inline-flex min-h-11 items-center underline mt-2">Welcome promotion and official rules</Link>
      </footer>
    </div>
  );
}

export function Panel({ title, kicker, children, className = "" }: { title: string; kicker?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`border border-border/50 bg-card/40 p-5 md:p-6 ${className}`}>
      {kicker && <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-2">{kicker}</p>}
      <h2 className="font-serif text-2xl text-foreground mb-4">{title}</h2>
      {children}
    </section>
  );
}

export function Skel({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted/40 ${className}`} />;
}
