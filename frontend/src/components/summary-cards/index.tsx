import {
  Activity,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

import type { ComparisonPoint } from "@/types";

import { useSummaryMetrics } from "@/hooks/use-summary-metrics";
import { formatNumber, formatSigned, integerFormat } from "@/utils/formatters";

import MetricCard from "./metric-card";

const SummaryCards = ({ points }: { points: ComparisonPoint[] }) => {
  const metrics = useSummaryMetrics(points);

  if (!metrics) return null;

  const BiasIcon = metrics.forecastBias >= 0 ? TrendingUp : TrendingDown;

  const biasDescription =
    metrics.forecastBias > 0
      ? "Forecasts averaged above actual generation."
      : metrics.forecastBias < 0
        ? "Forecasts averaged below actual generation."
        : "Forecast and actual averages matched.";

  return (
    <section aria-label="Summary metrics" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-tight sm:text-base">
            Period summary
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Key generation and forecast metrics
          </p>
        </div>

        <span className="border-border bg-muted/50 text-muted-foreground rounded-md border px-2.5 py-1 text-xs tabular-nums">
          {integerFormat.format(metrics.comparisonHours)} matching hours
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total wind energy"
          value={formatNumber(metrics.totalEnergy)}
          unit="MWh"
          description="Total energy generated in this period."
          icon={Zap}
        />

        <MetricCard
          title="Average generation"
          value={formatNumber(metrics.averageGeneration)}
          unit="MW"
          description="Average actual wind power."
          icon={Activity}
        />

        <MetricCard
          title="Forecast accuracy"
          value={
            metrics.forecastAccuracy == null
              ? "Not available"
              : formatNumber(metrics.forecastAccuracy)
          }
          unit={metrics.forecastAccuracy == null ? undefined : "%"}
          description="How closely forecasts matched actual generation."
          icon={CheckCircle2}
        />

        <MetricCard
          title="Forecast bias"
          value={formatSigned(metrics.forecastBias)}
          unit="MW"
          description={biasDescription}
          icon={BiasIcon}
        />
      </div>
    </section>
  );
};

export default SummaryCards;
