import { useState } from "react";
import { Gift, Sparkles, ArrowRight, X } from "lucide-react";
import { useNavigate } from "@/lib/router-compat";
import { resellerPath } from "@/lib/subdomain";

export default function PromotionalBonusBanner() {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed) return null;

  const handleBannerClick = () => {
    navigate(resellerPath("/reseller/profile"));
  };

  const bannerText = (
    <div className="flex items-center gap-3 px-6 cursor-pointer hover:opacity-95 transition-opacity" onClick={handleBannerClick}>
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
        <Sparkles className="h-3 w-3 animate-pulse" />
        Deposit Bonus Match
      </span>
      <span className="font-semibold text-foreground text-xs sm:text-sm tracking-tight flex items-center gap-1.5">
        <Gift className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 inline" />
        Resellers making a deposit over <strong className="text-emerald-600 dark:text-emerald-400 font-bold">$200 USD</strong> will receive an exclusive bonus of <strong className="text-amber-600 dark:text-amber-400 font-bold">$10 to $100</strong> according to platform activity and credibility!
      </span>
      <span className="inline-flex items-center text-[11px] font-bold text-primary hover:underline shrink-0 gap-0.5">
        Deposit Now <ArrowRight className="h-3 w-3" />
      </span>
    </div>
  );

  return (
    <div className="relative w-full bg-gradient-to-r from-amber-500/15 via-emerald-500/20 to-amber-500/15 dark:from-amber-900/30 dark:via-emerald-900/30 dark:to-amber-900/30 border-b border-emerald-500/30 py-1.5 overflow-hidden select-none z-30">
      <div className="flex w-full overflow-hidden">
        <div className="animate-marquee-infinite flex items-center">
          {bannerText}
          <span className="mx-8 text-muted-foreground/40 font-bold">●</span>
          {bannerText}
          <span className="mx-8 text-muted-foreground/40 font-bold">●</span>
          {bannerText}
          <span className="mx-8 text-muted-foreground/40 font-bold">●</span>
          {bannerText}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setDismissed(true);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/60 hover:bg-background text-muted-foreground hover:text-foreground transition-colors z-40 border border-border shadow-xs"
        title="Dismiss announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
