import { useState } from "react";
import { Send } from "lucide-react";
import { useCommunityAction, fmtDate, type Quest, type Submission } from "@/lib/community-api";

export function QuestCard({ quest, submissions, canSubmit }: { quest: Quest; submissions?: Submission[]; canSubmit: boolean }) {
  const act = useCommunityAction();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const mine = submissions?.filter((s) => s.quest_id === quest.id) ?? [];
  const urlOk = /^https:\/\/\S+$/.test(url);
  const textOk = text.trim().length >= 40 && text.length <= 4000;

  return (
    <article className="border border-border/60 bg-background/50 p-5" data-testid={`card-quest-${quest.id}`}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-serif text-xl text-foreground">{quest.title}</h3>
        <span className="shrink-0 font-mono text-xs text-primary border border-primary/40 px-2 py-1">{quest.reward} Seeds</span>
      </div>
      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line leading-relaxed">{quest.requirements}</p>
      {mine.map((s) => (
        <p key={s.id} className="mt-3 text-xs font-mono" data-testid={`status-submission-${s.id}`}>
          <span className={s.status === "approved" ? "text-primary" : s.status === "rejected" ? "text-destructive" : "text-amber-500"}>{s.status.toUpperCase()}</span>
          <span className="text-muted-foreground"> · {fmtDate(s.created_at)}{s.reason ? ` · ${s.reason}` : ""}</span>
        </p>
      ))}
      {canSubmit && (open ? (
        <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); act.mutate({ action: "submit", questId: quest.id, evidenceUrl: url, evidenceText: text }, { onSuccess: () => { setOpen(false); setUrl(""); setText(""); } }); }}>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https:// evidence link" className="w-full min-h-11 bg-card border border-border/70 px-3 text-sm" data-testid={`input-evidence-url-${quest.id}`} />
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} maxLength={4000} placeholder="Describe what you did (40-4000 characters)" className="w-full bg-card border border-border/70 p-3 text-sm" data-testid={`input-evidence-text-${quest.id}`} />
          <p className="text-xs text-muted-foreground">{text.trim().length}/40 minimum</p>
          {act.error && <p role="alert" className="text-sm text-destructive">{act.error.message}</p>}
          <div className="flex gap-2">
            <button disabled={!urlOk || !textOk || act.isPending} className="inline-flex min-h-11 items-center gap-2 px-4 bg-primary text-primary-foreground text-xs uppercase tracking-widest disabled:opacity-40" data-testid={`button-submit-quest-${quest.id}`}><Send className="w-4 h-4" />{act.isPending ? "Submitting…" : "Submit for review"}</button>
            <button type="button" onClick={() => setOpen(false)} className="min-h-11 px-4 text-xs uppercase tracking-widest text-muted-foreground">Cancel</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setOpen(true)} className="mt-4 min-h-11 px-4 border border-primary/50 text-primary text-xs uppercase tracking-widest hover:bg-primary/10" data-testid={`button-open-submit-${quest.id}`}>Submit evidence</button>
      ))}
    </article>
  );
}
