import { Activity, CalendarDays, Clock3, Database, MapPin } from "lucide-react";

import { useDashboard } from "@/context";
import { formatDate } from "@/utils/formatters";

const Footer = () => {
  const { state } = useDashboard();
  const { endDate, startDate } = state.appliedFilters;

  return (
    <footer className="border-border border-t pt-5 pb-2">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="border-border bg-muted/50 text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border">
            <Activity className="size-4" aria-hidden="true" />
          </div>

          <div>
            <p className="text-foreground text-sm font-semibold tracking-tight">
              Windscope
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Wind generation analytics
            </p>
          </div>
        </div>

        {/* Report context */}
        <div className="flex flex-col gap-2.5 sm:items-end">
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden="true" />
              Great Britain
            </span>

            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {formatDate(startDate)} – {formatDate(endDate)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" aria-hidden="true" />
              UTC
            </span>
          </div>

          <p className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
            <Database className="size-3.5 shrink-0" aria-hidden="true" />
            Illustrative demo data — not a live generation feed.
          </p>
        </div>
      </div>

      <div className="border-border/70 text-muted-foreground mt-5 flex flex-col gap-1 border-t pt-3 text-[11px] sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Windscope</span>
        <span>Wind generation insights at a glance.</span>
      </div>
    </footer>
  );
};

export default Footer;
