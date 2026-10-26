import { Activity, ChevronDown, LoaderCircle } from "lucide-react";

import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const metricSkeletons = ["energy", "generation", "accuracy", "bias"];

const chartGridLines = [0, 1, 2, 3, 4];
const axisLabels = [0, 1, 2, 3, 4, 5];

const LoadingState = () => {
  return (
    <section
      role="status"
      aria-busy="true"
      aria-label="Loading wind generation dashboard"
      className="space-y-5"
    >
      {/* Loading heading */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LoaderCircle
              className="text-primary size-4 animate-spin"
              aria-hidden="true"
            />
            <h2 className="text-sm font-semibold tracking-tight sm:text-base">
              Preparing dashboard
            </h2>
          </div>

          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            Retrieving forecast and actual generation data.
          </p>
        </div>

        <Skeleton className="h-6 w-24 shrink-0 rounded-md" />
      </div>

      <div aria-hidden="true" className="space-y-5">
        {/* Summary metric skeletons */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metricSkeletons.map((metric) => (
            <Card
              key={metric}
              className="border-border/80 bg-card hover:border-border h-full gap-0 rounded-xl py-0 shadow-sm transition-colors"
            >
              <CardContent className="flex h-full min-w-0 flex-col p-4">
                {/* Title and icon */}
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-3.5 w-28 max-w-full" />

                  <div className="bg-muted/70 flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <Skeleton className="size-4 rounded-sm" />
                  </div>
                </div>

                {/* Metric value and unit */}
                <div className="mt-3 flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-1">
                  <Skeleton className="h-7 w-36 max-w-full" />
                  <Skeleton className="h-4 w-9" />
                </div>

                {/* Description */}
                <Skeleton className="mt-1.5 h-3 w-44 max-w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart skeleton */}
        <Card className="border-border gap-0 rounded-xl shadow-sm">
          {/* Matches the actual chart header */}
          <CardHeader className="gap-1 px-4 pt-4 pb-2 sm:px-5">
            <Skeleton className="h-4 w-52 max-w-full" />
            <Skeleton className="mt-1 h-3.5 w-72 max-w-full" />
          </CardHeader>

          <CardContent className="px-2 pt-2 pb-3 sm:px-4 sm:pb-4">
            {/* Matches ChartContainer: h-70 sm:h-85 */}
            <div
              aria-hidden="true"
              className="h-70 w-full animate-pulse sm:h-85"
            >
              <div className="flex h-full gap-3">
                {/* Y-axis labels */}
                <div className="flex w-10 shrink-0 flex-col justify-between pt-2 pb-14">
                  {chartGridLines.map((tick) => (
                    <Skeleton key={tick} className="h-3 w-8" />
                  ))}
                </div>

                {/* Plot and axes */}
                <div className="relative min-w-0 flex-1">
                  {/* Plot area */}
                  <div className="absolute inset-x-0 top-2 bottom-14">
                    {chartGridLines.map((line) => (
                      <div
                        key={line}
                        className="border-border/70 absolute inset-x-0 border-t border-dashed"
                        style={{ top: `${line * 25}%` }}
                      />
                    ))}

                    {/* Forecast and actual line placeholders */}
                    <svg
                      viewBox="0 0 800 240"
                      preserveAspectRatio="none"
                      className="absolute inset-0 size-full"
                    >
                      <path
                        d="M0 165 C70 145 95 175 150 130 S240 90 300 125 S390 165 450 105 S550 65 600 100 S710 135 800 55"
                        fill="none"
                        stroke="var(--chart-1)"
                        strokeOpacity="0.3"
                        strokeWidth="3"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />

                      <path
                        d="M0 190 C65 180 100 125 155 155 S245 185 300 145 S390 120 450 155 S550 125 600 145 S720 80 800 105"
                        fill="none"
                        stroke="var(--chart-2)"
                        strokeOpacity="0.3"
                        strokeWidth="3"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>

                  {/* X-axis labels */}
                  <div className="absolute inset-x-0 bottom-9 flex justify-between gap-2">
                    {axisLabels.map((tick) => (
                      <Skeleton key={tick} className="h-3 w-10 max-w-full" />
                    ))}
                  </div>

                  {/* Matches the actual chart's bottom legend */}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-0.5 w-5" />
                      <Skeleton className="h-3 w-14" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Skeleton className="h-0.5 w-5" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Matches the actual chart's helper text */}
            <div className="px-2 pt-2">
              <Skeleton className="h-3 w-80 max-w-full" />
            </div>
          </CardContent>
        </Card>
        {/* Collapsed hourly-details skeleton */}
        <Card className="border-border gap-0 overflow-hidden rounded-xl shadow-sm">
          <CardContent className="p-0">
            <div className="flex w-full items-center justify-between gap-4 p-4 sm:p-5">
              {/* Icon and text */}
              <div className="flex min-w-0 items-start gap-3">
                <div className="bg-muted mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <Skeleton className="size-4 rounded-sm" />
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 max-w-full" />
                  <Skeleton className="h-3.5 w-64 max-w-full" />
                </div>
              </div>

              {/* Record count and chevron */}
              <div className="flex shrink-0 items-center gap-3">
                <Skeleton className="hidden h-6 w-20 rounded-md sm:block" />

                <ChevronDown
                  className="text-muted-foreground/30 size-4 shrink-0"
                  aria-hidden="true"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keep imports intentional if this is your dashboard's visual identity. */}
        <div className="sr-only">
          <Activity aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default LoadingState;
