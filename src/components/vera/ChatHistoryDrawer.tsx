import * as React from "react";
import {
  History,
  X,
  Trash2,
  Mic,
  Keyboard,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  getSessionHistory,
  clearSessionHistory,
  deleteSessionHistoryItem,
  HISTORY_EVENT_NAME,
  type SessionHistoryItem,
} from "@/lib/chat-history";
import type { QueryResponse } from "@/lib/rag.types";

interface ChatHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectHistory: (response: QueryResponse) => void;
  onAskSuggestion?: (query: string) => void;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatHistoryDrawer({
  open,
  onClose,
  onSelectHistory,
  onAskSuggestion,
}: ChatHistoryDrawerProps) {
  const [history, setHistory] = React.useState<SessionHistoryItem[]>([]);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Synchronize history from sessionStorage and custom event listener
  React.useEffect(() => {
    setHistory(getSessionHistory());

    const handleUpdate = () => {
      setHistory(getSessionHistory());
    };

    window.addEventListener(HISTORY_EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(HISTORY_EVENT_NAME, handleUpdate);
  }, [open]);

  // Handle ESC key to close
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleClearAll = () => {
    if (history.length === 0) return;
    clearSessionHistory();
    toast.success("Session chat history cleared");
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteSessionHistoryItem(id);
    toast.info("History entry removed");
  };

  const handleCopy = (e: React.MouseEvent, item: SessionHistoryItem) => {
    e.stopPropagation();
    const textToCopy = `Query: ${item.query}\n\nAnswer: ${item.response.answer}`;
    void navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    toast.success("Copied query & answer to clipboard");
    setTimeout(() => {
      setCopiedId((curr) => (curr === item.id ? null : curr));
    }, 2000);
  };

  const handleSelect = (item: SessionHistoryItem) => {
    onSelectHistory(item.response);
    onClose();
    toast.success(`Restored query: "${item.query.slice(0, 30)}${item.query.length > 30 ? "..." : ""}"`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      {/* Drawer Container */}
      <aside
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-card/95 backdrop-blur-2xl shadow-2xl transition-all animate-in slide-in-from-right duration-300 sm:max-w-lg"
        role="dialog"
        aria-modal="true"
        aria-label="Chat & Voice History"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-background/50">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 text-cyan-300 shadow-sm">
              <History className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">Chat History</h2>
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {history.length} {history.length === 1 ? "Query" : "Queries"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Tab session memory • Cleared on tab close
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 cursor-pointer"
                title="Clear all session history"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* History List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            /* Empty State */
            <div className="flex h-full flex-col items-center justify-center text-center px-4 py-12">
              <div className="grid h-16 w-16 place-items-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent text-muted-foreground shadow-inner mb-4">
                <History className="h-7 w-7 text-muted-foreground/60" />
              </div>
              <h3 className="text-base font-bold text-foreground">No Recent History</h3>
              <p className="mt-1.5 max-w-xs text-xs text-muted-foreground leading-relaxed">
                Queries asked via voice or text in this browser tab will appear here along with their verified evidence.
              </p>

              {onAskSuggestion && (
                <div className="mt-8 w-full">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
                    Try asking
                  </span>
                  <div className="space-y-2">
                    {[
                      "What is machine learning?",
                      "Explain photosynthesis light reactions",
                      "What causes earthquakes?",
                    ].map((sample) => (
                      <button
                        key={sample}
                        onClick={() => {
                          onAskSuggestion(sample);
                          onClose();
                        }}
                        className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-2.5 text-left text-xs font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-cyan-300 cursor-pointer group"
                      >
                        <span className="truncate">{sample}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Populated History Cards */
            history.map((item) => {
              const groundedPct = Math.round(item.response.grounding * 100);
              const isGrounded = item.response.grounded;
              const sourceCount = item.response.citations?.length || 0;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="group relative flex flex-col rounded-2xl border border-white/10 bg-card/60 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-card/90 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
                >
                  {/* Top Bar: Input Mode, Time, Badges */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          item.inputMode === "voice"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {item.inputMode === "voice" ? (
                          <>
                            <Mic className="h-2.5 w-2.5" /> Voice
                          </>
                        ) : (
                          <>
                            <Keyboard className="h-2.5 w-2.5" /> Text
                          </>
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleCopy(e, item)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                        title="Copy query and answer"
                      >
                        {copiedId === item.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => handleDeleteItem(e, item.id)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        title="Delete from history"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Query Title */}
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    "{item.query}"
                  </h4>

                  {/* Answer Preview */}
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.response.spokenSummary || item.response.answer}
                  </p>

                  {/* Bottom Verification & Source Badges */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2.5 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isGrounded
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        <ShieldCheck className="h-3 w-3" />
                        {groundedPct}% Grounded
                      </span>

                      {sourceCount > 0 && (
                        <span className="text-muted-foreground">
                          {sourceCount} {sourceCount === 1 ? "source" : "sources"}
                        </span>
                      )}
                    </div>

                    <span className="flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition-transform text-[11px]">
                      View response <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="border-t border-white/10 p-4 bg-background/60 text-center">
            <p className="text-[11px] text-muted-foreground">
              Click any query above to reload its grounded evidence and audio summary.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
