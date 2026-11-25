import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useListGreenhouseItems, 
  useGetMe, 
  useClaimDaily, 
  useContributeToItem,
  useCollectSeeds,
  getListGreenhouseItemsQueryKey,
  getGetMeQueryKey
} from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useUser } from "@clerk/react";
import { useToast } from "@/hooks/use-toast";

import { Particles } from "@/components/particles";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Leaf, Droplet, Sprout, Sun, Wind, Shield, Beaker, CheckCircle2, TrendingUp, History, Menu, X, ExternalLink } from "lucide-react";

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//.test(url)) return url;
  return `${import.meta.env.BASE_URL}${url.replace(/^\//, "")}`;
}

export default function Greenhouse() {
  const { sessionId } = useSession();
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading: itemsLoading } = useListGreenhouseItems({
    query: { enabled: true, queryKey: getListGreenhouseItemsQueryKey() }
  });

  const { data: userProfile, isLoading: userLoading } = useGetMe({ sessionId }, {
    query: { enabled: !!sessionId && !!isSignedIn, queryKey: getGetMeQueryKey({ sessionId }) }
  });

  const claimDailyMutation = useClaimDaily();
  const contributeMutation = useContributeToItem();
  const collectMutation = useCollectSeeds();

  const [collectCooldown, setCollectCooldown] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (userProfile?.secondsUntilCollect != null) {
      setCollectCooldown(userProfile.secondsUntilCollect);
    }
  }, [userProfile?.secondsUntilCollect]);

  useEffect(() => {
    if (collectCooldown <= 0) return;
    const t = setInterval(() => {
      setCollectCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [collectCooldown]);

  const handleClaimDaily = () => {
    if (!sessionId) return;
    claimDailyMutation.mutate({ data: { sessionId } }, {
      onSuccess: () => {
        toast({ title: "Daily Seeds Claimed!", description: "Come back tomorrow for more." });
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey({ sessionId }) });
      },
      onError: (err: any) => {
        toast({ title: "Failed to claim", description: err?.message || "Unknown error", variant: "destructive" });
      }
    });
  };

  const handleCollect = () => {
    if (!sessionId || collectCooldown > 0) return;
    collectMutation.mutate({ data: { sessionId } }, {
      onSuccess: (res) => {
        if (res.collected) {
          toast({ title: "Seeds Harvested", description: res.message });
        } else {
          toast({ title: "Not ready yet", description: res.message });
        }
        setCollectCooldown(res.secondsUntilCollect);
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey({ sessionId }) });
      },
      onError: (err: any) => {
        toast({ title: "Collection failed", description: err?.message || "Unknown error", variant: "destructive" });
      }
    });
  };

  const formatCooldown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary dark">
      {/* Sticky Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-6 min-h-20 lg:h-20 flex flex-wrap lg:flex-nowrap items-center justify-between gap-x-4 relative">
          <Link href="/" className="inline-flex min-h-16 items-center font-serif text-2xl font-bold tracking-widest text-primary drop-shadow-[0_0_10px_rgba(74,158,90,0.5)]">
            $POTIFY
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            <a href="https://potify-launch-room.wile-e-coyot.chatgpt.site/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300">
              Launch Room
            </a>
            <Link href="/greenhouse" className="inline-flex min-h-11 items-center text-sm uppercase tracking-widest text-primary hover:text-primary transition-colors duration-300">
              Greenhouse
            </Link>
            <a href="/#cycle" className="inline-flex min-h-11 items-center text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300">
              The Cycle
            </a>
          </div>
          <button type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-controls="greenhouse-mobile-menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden inline-flex min-h-11 min-w-11 items-center justify-center border border-border/50 text-primary">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          {menuOpen && (
            <div id="greenhouse-mobile-menu" className="lg:hidden absolute top-full left-4 right-4 z-10 flex flex-col p-2 border border-border/50 bg-background shadow-xl text-xs uppercase tracking-widest">
              <a href="https://potify-launch-room.wile-e-coyot.chatgpt.site/" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center px-4 text-muted-foreground hover:text-primary">Launch Room</a>
              <Link href="/greenhouse" onClick={() => setMenuOpen(false)} aria-current="page" className="flex min-h-11 items-center px-4 text-primary">Greenhouse</Link>
              <a href="/#cycle" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center px-4 text-muted-foreground hover:text-primary">The Cycle</a>
            </div>
          )}
          
          <div className="flex w-full lg:w-auto items-center justify-end pb-2 lg:pb-0">
            {userLoading ? (
              <Skeleton className="h-10 w-32 bg-card" />
            ) : userProfile ? (
              <div className="flex items-center gap-1 sm:gap-3 lg:gap-4 border border-border/50 bg-card/50 px-2 sm:px-4 py-1 rounded-none backdrop-blur-sm">
                <button
                  type="button"
                  onClick={handleCollect}
                  disabled={collectCooldown > 0 || collectMutation.isPending}
                  title={collectCooldown > 0 ? `Next harvest in ${formatCooldown(collectCooldown)}` : "Harvest seeds"}
                  aria-label="Harvest seeds"
                  data-testid="button-collect-seeds"
                  className={`inline-flex min-h-11 min-w-11 items-center justify-center transition-all duration-300 ${
                    collectCooldown > 0
                      ? "text-muted-foreground/40 cursor-default"
                      : "text-primary/70 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(74,158,90,0.6)] cursor-pointer animate-pulse"
                  }`}
                >
                  <Sprout className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Leaf className="w-4 h-4 text-primary" />
                  <span className="font-mono text-primary font-bold">{userProfile.seedBalance.toLocaleString()}</span>
                  <span className="hidden sm:inline text-muted-foreground text-xs uppercase tracking-widest">Seeds</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-serif tracking-widest uppercase rounded-none min-h-11 px-2 sm:px-3 text-xs"
                  disabled={!userProfile.canClaimDaily || claimDailyMutation.isPending}
                  onClick={handleClaimDaily}
                  data-testid="button-claim-daily"
                >
                  {userProfile.canClaimDaily ? "Claim Daily" : "Claimed"}
                </Button>
              </div>
            ) : <Link href="/community" className="min-h-11 inline-flex items-center text-primary underline">Sign in to earn community Seeds</Link>}
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <header className="pt-48 lg:pt-40 pb-20 relative overflow-hidden border-b border-border/20">
        <Particles />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-0 pointer-events-none" />
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-foreground to-primary/80 mb-4 drop-shadow-2xl">
              THE GREENHOUSE
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light tracking-widest uppercase">
              Community grown. Collectively unlocked.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">Seeds are off-chain, nontransferable community points — not $POTIFY tokens. Verified-account balances are used here. Earlier anonymous balances are preserved pending owner reconciliation and are not automatically imported.</p>
          </motion.div>
        </div>
      </header>

      <section aria-labelledby="official-merch-heading" className="container mx-auto px-6 max-w-7xl pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border border-primary/30 bg-card/30 p-6 md:p-8">
          <div className="max-w-2xl">
            <h2 id="official-merch-heading" className="font-serif text-2xl text-foreground mb-2">Official POTIFY Merch</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Shop directly from our official Printify storefront. The store is separate from Greenhouse Seeds: purchases do not use Seeds, and Seeds continue to power community voting and unlock features here.
            </p>
          </div>
          <a
            href="https://potify-project.printify.me/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-shop-official-merch"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Shop Official Merch <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* GRID */}
      <main className="py-24 container mx-auto px-6 max-w-7xl">
        {itemsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="aspect-square bg-card/40 border border-border/30 rounded-none" />
            ))}
          </div>
        ) : items?.length === 0 ? (
          <div className="text-center py-32 border border-border/20 bg-card/20 backdrop-blur-sm">
            <Sprout className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="font-serif text-2xl text-foreground mb-2">The soil is empty</h3>
            <p className="text-muted-foreground">No items currently growing in the greenhouse.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items?.map((item) => (
              <GreenhouseItemCard 
                key={item.id} 
                item={item} 
                sessionId={sessionId} 
                userBalance={userProfile?.seedBalance || 0}
                onContribute={(amount: number) => {
                  contributeMutation.mutate(
                    { id: item.id, data: { sessionId, amount, requestId: crypto.randomUUID() } },
                    {
                      onSuccess: () => {
                        toast({ title: "Seeds Contributed", description: `Added ${amount} seeds to ${item.name}` });
                        queryClient.invalidateQueries({ queryKey: getListGreenhouseItemsQueryKey() });
                        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey({ sessionId }) });
                      },
                      onError: (err: any) => {
                        toast({ title: "Contribution failed", description: err?.message || "Unknown error", variant: "destructive" });
                      }
                    }
                  );
                }}
                isContributing={contributeMutation.isPending && contributeMutation.variables?.id === item.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function GreenhouseItemCard({ item, sessionId, userBalance, onContribute, isContributing }: any) {
  const [amount, setAmount] = useState<string>("");

  const isUnlocked = item.status === "UNLOCKED";
  const imageUrl = resolveImageUrl(item.imageUrl);
  
  const getStatusColor = (status: string) => {
    if (status === "UNLOCKED") return "text-primary border-primary shadow-[0_0_10px_rgba(74,158,90,0.5)]";
    if (item.progressPercent > 80) return "text-accent border-accent/50";
    return "text-muted-foreground border-border/50";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amount, 10);
    if (!val || val <= 0) return;
    if (val > userBalance) {
      // Could show local toast
      return;
    }
    onContribute(val);
    setAmount("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`relative bg-card/40 border p-8 flex flex-col group transition-all duration-500 rounded-none
        ${isUnlocked ? 'border-primary/50 bg-primary/5' : 'border-border/40 hover:border-primary/30'}
      `}
      data-testid={`card-greenhouse-item-${item.id}`}
      id={`reward-${item.id}`}
    >
      {imageUrl && (
        <div className="relative -mx-8 -mt-8 mb-6 border-b border-border/40 bg-black flex items-center justify-center">
          <img
            src={imageUrl}
            alt={item.name}
            loading="lazy"
            className={`w-full h-auto block transition-all duration-700 ${isUnlocked ? '' : 'opacity-85'}`}
            data-testid={`img-greenhouse-item-${item.id}`}
          />
        </div>
      )}

      <div className="absolute top-6 right-6">
        <div className={`px-3 py-1 text-[10px] uppercase tracking-widest font-mono border rounded-none backdrop-blur-sm bg-background/60 ${getStatusColor(item.status)}`}>
          {item.status}
        </div>
      </div>

      <h3 className="font-serif text-3xl text-foreground mb-3 pr-16">{item.name}</h3>
      <p className="text-muted-foreground text-sm font-light leading-relaxed mb-8 flex-grow">
        {item.description}
      </p>

      <div className="space-y-4">
        <div className="flex justify-between text-xs font-mono uppercase tracking-widest">
          <span className="text-muted-foreground">Progress</span>
          <span className={isUnlocked ? "text-primary" : "text-foreground"}>
            {item.progressPercent.toFixed(1)}%
          </span>
        </div>
        
        <Progress 
          value={item.progressPercent} 
          className="h-1.5 bg-secondary" 
        />
        
        <div className="text-right text-xs font-mono text-muted-foreground">
          <span className={isUnlocked ? "text-primary font-bold" : "text-foreground"}>
            {item.currentSeeds.toLocaleString()}
          </span> / {item.unlockGoal.toLocaleString()} Seeds
        </div>

        {item.name === "$POTIFY Rooted Neon Hoodie" && (
          <p className="text-xs font-mono text-primary">
            {isUnlocked ? "Unlocked by the community" : "Locked until 7,000 community Seeds"}
          </p>
        )}

        {!isUnlocked && (
          <form onSubmit={handleSubmit} className="mt-6 flex gap-3 pt-6 border-t border-border/30">
            <Input 
              type="number" 
              min="1"
              max={userBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="bg-background rounded-none border-border/50 focus-visible:ring-primary font-mono"
              data-testid={`input-contribute-${item.id}`}
              disabled={isContributing}
            />
            <Button 
              type="submit" 
              disabled={!amount || parseInt(amount) <= 0 || parseInt(amount) > userBalance || isContributing || !sessionId}
              className="rounded-none bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-serif tracking-widest uppercase"
              data-testid={`button-contribute-${item.id}`}
            >
              Feed
            </Button>
          </form>
        )}
      </div>
    </motion.div>
  );
}