import { motion } from "framer-motion";
import { Link } from "wouter";
import { AlertTriangle, ExternalLink, ArrowLeft, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GreenLightPay() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary dark">
      {/* Sticky Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-widest text-primary drop-shadow-[0_0_10px_rgba(167,139,75,0.3)]">
            $POTIFY
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">

          {/* Status badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 border border-amber-500/40 bg-amber-500/10 rounded-sm">
              <Beaker className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-amber-400">Synthetic Research Sandbox</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-border/40 bg-card/40 rounded-sm">
              <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-muted-foreground">Not a $POTIFY Product</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-border/40 bg-card/40 rounded-sm">
              <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-muted-foreground">Nonproduction — No Live Transactions</span>
            </div>
          </motion.div>

          {/* Quick navigation */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <Link href="/">
              <Button variant="outline" className="rounded-none h-10 px-5 font-mono text-xs tracking-widest uppercase border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50">
                ← POTIFY Home
              </Button>
            </Link>
            <a href="https://potify-launch-room.wile-e-coyot.chatgpt.site/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-none h-10 px-5 font-mono text-xs tracking-widest uppercase border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground">
                Launch Room <ExternalLink className="ml-1.5 w-3 h-3" />
              </Button>
            </a>
            <a href="https://green-light-pay.replit.app/green-light-pay/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-none h-10 px-5 font-mono text-xs tracking-widest uppercase border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary">
                GLP Sandbox <ExternalLink className="ml-1.5 w-3 h-3" />
              </Button>
            </a>
            <Link href="/regulatory">
              <Button variant="outline" className="rounded-none h-10 px-5 font-mono text-xs tracking-widest uppercase border-border/40 text-muted-foreground/60 hover:border-border/60 hover:text-muted-foreground">
                Regulatory Record
              </Button>
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-primary/30" />
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary/60">Bridge Page — Separation Notice</span>
              <div className="h-px w-12 bg-primary/30" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-heir mb-6">Green Light Pay Initiative</h1>
            <p className="text-muted-foreground font-light leading-relaxed text-lg mb-12">
              A nonproduction synthetic research sandbox exploring decentralized payment concepts for cash-dependent retail environments. This page exists solely to document the clear separation between this research concept and the $POTIFY project.
            </p>
          </motion.div>

          {/* Primary disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-8 border border-amber-500/30 bg-amber-500/5 rounded-sm mb-8"
          >
            <div className="flex items-start gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                <AlertTriangle className="w-4 h-4 text-amber-500/80" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-foreground mb-3">Complete Separation Statement</h2>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  Green Light Pay is an <strong className="text-foreground">independent concept</strong> with no operational, financial, legal, or organizational connection to the $POTIFY project, $POTIFY token, $POTIFY community, or any $POTIFY product.
                </p>
              </div>
            </div>

            <p className="text-xs font-mono uppercase tracking-wider text-amber-500/70 mb-5 pl-12">
              There are NO shared connections of any kind, including:
            </p>
            <div className="space-y-3 pl-12">
              {[
                "Funds, treasury, or financial resources",
                "Token rights, token allocation, or $POTIFY token benefits of any kind",
                "Holder benefits, staking rewards, governance rights, or voting power",
                "Ownership, equity, organizational structure, or legal entity",
                "Revenue sharing, buybacks, profit distribution, or economic linkage",
                "Customer data, user accounts, or session information",
                "Regulatory approval, financial licensing, or compliance certifications",
                "Presale participation, mint rights, or airdrop eligibility",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground font-light">
                  <span className="text-amber-500/50 mt-0.5 text-xs flex-shrink-0">—</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* What it is */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="p-8 bg-card/30 border border-border/40 rounded-sm mb-6"
          >
            <h2 className="font-serif text-2xl text-foreground mb-6">What Green Light Pay Is</h2>
            <div className="space-y-4 text-muted-foreground font-light leading-relaxed text-sm">
              <p>
                Green Light Pay is a <span className="text-foreground">conceptual research sandbox</span> — a nonproduction environment for exploring the structural challenges of building a compliant, decentralized payment framework for high-risk retail categories that are systematically excluded from traditional banking and card processing infrastructure due to federal regulatory constraints.
              </p>
              <p>
                The sandbox documents theoretical architecture, synthetic transaction modeling, and academic exploration of blockchain-based settlement mechanisms. It does not process real transactions, hold real funds, issue tokens, or operate under any payment processor license or financial services registration.
              </p>
              <p>
                The research concept is grounded in a real and documented retail problem: legal dispensaries and tobacco retailers operating in cash-only environments, exposed to security risks, accounting burdens, and customer friction that a well-designed digital payment layer could reduce. The sandbox explores how that problem might be approached — not how it currently is approached by this project.
              </p>
            </div>
          </motion.div>

          {/* What it is NOT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="p-8 bg-card/20 border border-border/30 rounded-sm mb-12"
          >
            <h2 className="font-serif text-2xl text-foreground mb-6">What Green Light Pay Is Not</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "A $POTIFY feature, product, or utility",
                "A live or production payment system",
                "A regulated or licensed financial service",
                "Connected to the $POTIFY token or presale",
                "Part of the $POTIFY Greenhouse economy",
                "Part of the $POTIFY game or community rewards",
                "A solicitation to invest, purchase, or transact",
                "Backed by any regulatory approval or compliance filing",
                "Operated by the same team or legal entity as $POTIFY",
                "A source of token value, utility, or holder rights",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground font-light">
                  <span className="text-destructive/50 mt-0.5 text-xs flex-shrink-0">✕</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sandbox Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38 }}
            className="p-8 bg-card/30 border border-border/40 rounded-sm mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-sm bg-muted-foreground/40" />
              <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-muted-foreground/50">Sandbox URLs — Nonproduction</span>
            </div>
            <h2 className="font-serif text-2xl text-foreground mb-3">Access the Sandbox</h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8">
              The sandbox is nonproduction and contains no real transactions or live funds. All URLs open the published research environment in a new tab.
            </p>

            {/* Primary CTA */}
            <a
              href="https://green-light-pay.replit.app/green-light-pay/"
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-3"
            >
              <Button
                size="lg"
                className="group w-full h-14 bg-transparent border border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground font-serif text-base tracking-[0.2em] uppercase rounded-none transition-all duration-500 hover:shadow-[0_0_30px_-6px_rgba(74,158,90,0.4)]"
              >
                Open Sandbox
                <ExternalLink className="ml-2 w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Button>
            </a>
            <p className="text-center text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/40 mb-5">
              Simulated · No Live Funds
            </p>

            {/* Secondary links */}
            <div className="grid sm:grid-cols-2 gap-3">
              <a
                href="https://green-light-pay.replit.app/green-light-pay/checkout/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border border-border/40 bg-background/40 hover:border-primary/30 hover:bg-card/40 transition-all duration-300 rounded-sm group"
              >
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/50 mb-1">Secondary</div>
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">Customer Handoff</div>
                  <div className="text-[10px] text-muted-foreground/40 font-mono mt-1">/checkout/</div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/60 transition-colors flex-shrink-0" />
              </a>
              <a
                href="https://green-light-pay.replit.app/green-light-pay/developer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border border-border/40 bg-background/40 hover:border-primary/30 hover:bg-card/40 transition-all duration-300 rounded-sm group"
              >
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/50 mb-1">Secondary</div>
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">Developer Control Plane</div>
                  <div className="text-[10px] text-muted-foreground/40 font-mono mt-1">/developer</div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/60 transition-colors flex-shrink-0" />
              </a>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border/30"
          >
            <Link href="/">
              <Button
                variant="outline"
                className="rounded-none border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary font-serif tracking-widest uppercase h-12 px-8 w-full sm:w-auto"
              >
                ← Return to $POTIFY
              </Button>
            </Link>
            <a
              href="https://potify-launch-room.wile-e-coyot.chatgpt.site/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="rounded-none bg-transparent border border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground font-serif tracking-widest uppercase h-12 px-8 w-full sm:w-auto">
                $POTIFY Launch Room
                <ExternalLink className="ml-2 w-3 h-3" />
              </Button>
            </a>
          </motion.div>

          <p className="mt-10 text-[10px] font-mono text-muted-foreground/35 text-center leading-relaxed max-w-xl mx-auto">
            This page exists to maintain documented separation between the $POTIFY project and the Green Light Pay research concept. Nothing on this page constitutes financial advice, a securities offering, investment solicitation, or a product claim of any kind.
          </p>
        </div>
      </main>
    </div>
  );
}
