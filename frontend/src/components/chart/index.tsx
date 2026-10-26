import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { ComparisonPoint } from "@/types";

import {
  formatAxisDate,
  formatAxisTime,
  formatDeliveryTime,
  formatNumber,
  formatSigned,
  integerFormat,
} from "@/utils/formatters";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "../ui/chart";

type ChartProps = {
  points: ComparisonPoint[];
};

type TooltipPayload = {
  payload?: ComparisonPoint;
};

type GenerationTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
};

const chartConfig = {
  actual: {
    color: "var(--chart-2)",
    label: "Actual generation",
  },
  forecast: {
    color: "var(--chart-1)",
    label: "Forecast",
  },
} satisfies ChartConfig;

const GenerationTooltip = ({ active, payload }: GenerationTooltipProps) => {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;

  if (!point) return null;

  const DifferenceIcon =
    point.difference > 0
      ? TrendingUp
      : point.difference < 0
        ? TrendingDown
        : Activity;

  return (
    <div className="border-border bg-popover text-popover-foreground min-w-52 space-y-3 rounded-lg border p-3 shadow-md">
      <p className="text-muted-foreground text-xs font-medium">
        {formatDeliveryTime(point.startTime)} UTC
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--color-forecast)" }}
            />
            Forecast
          </span>

          <span className="font-medium tabular-nums">
            {formatNumber(point.forecast)} MW
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--color-actual)" }}
            />
            Actual
          </span>

          <span className="font-medium tabular-nums">
            {formatNumber(point.actual)} MW
          </span>
        </div>
      </div>

      <div className="border-border flex items-center justify-between gap-4 border-t pt-2">
        <span className="text-muted-foreground text-xs">Forecast − actual</span>

        <span className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums">
          <DifferenceIcon
            className="text-muted-foreground size-3.5"
            aria-hidden="true"
          />
          {formatSigned(point.difference)} MW
        </span>
      </div>
    </div>
  );
};

const Chart = ({ points }: ChartProps) => {
  if (points.length === 0) return null;

  return (
    <Card className="border-border gap-0 rounded-xl shadow-sm">
      <CardHeader className="gap-1 px-4 pt-4 pb-2 sm:px-5">
        <CardTitle className="text-sm font-semibold tracking-tight sm:text-base">
          Forecast vs. actual generation
        </CardTitle>

        <CardDescription className="text-xs sm:text-sm">
          Hourly wind power output across the selected period, measured in MW.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-2 pb-3 sm:px-4 sm:pb-4">
        <ChartContainer config={chartConfig} className="h-70 w-full sm:h-85">
          <LineChart
            accessibilityLayer
            data={points}
            margin={{ bottom: 4, left: 0, right: 12, top: 8 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="startTime"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={36}
              interval="preserveStartEnd"
              tick={{ fontSize: 11 }}
              tickFormatter={(value: string) =>
                `${formatAxisDate(value)} ${formatAxisTime(value)}`
              }
            />

            <YAxis
              width={54}
              domain={[0, "auto"]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              tickFormatter={(value: number) => integerFormat.format(value)}
            />

            <ChartTooltip
              cursor={{
                stroke: "var(--border)",
                strokeDasharray: "4 4",
              }}
              content={<GenerationTooltip />}
            />

            <ChartLegend
              verticalAlign="bottom"
              content={<ChartLegendContent />}
            />

            <Line
              dataKey="forecast"
              type="linear"
              stroke="var(--color-forecast)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={false}
            />

            <Line
              dataKey="actual"
              type="linear"
              stroke="var(--color-actual)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>

        <p className="text-muted-foreground px-2 pt-2 text-xs">
          Hover over the chart to compare forecast and actual output at each
          delivery hour.
        </p>
      </CardContent>
    </Card>
  );
};

export default Chart;
