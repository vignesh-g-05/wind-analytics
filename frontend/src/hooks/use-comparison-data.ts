import { useMemo } from "react";

import type {
  ComparisonPoint,
  Filters,
  WindApiResponse,
  WindForecast,
} from "@/types";

import { useDashboard } from "@/context";

export function useComparisonData() {
  const { state } = useDashboard();

  return useMemo(() => {
    if (!state.data) return [];

    return selectComparisonData(state.data, state.appliedFilters);
  }, [state.data, state.appliedFilters]);
}

function selectComparisonData(
  data: WindApiResponse,
  filters: Filters,
): ComparisonPoint[] {
  const start = Date.parse(`${filters.startDate}T00:00:00Z`);
  const end = Date.parse(`${filters.endDate}T23:59:59.999Z`);

  const actualByTime = new Map<string, number>();

  for (const actual of data.wind_generations) {
    const timestamp = Date.parse(actual.startTime);

    if (timestamp >= start && timestamp <= end) {
      actualByTime.set(actual.startTime, actual.generation);
    }
  }

  const forecastsByTime = new Map<string, WindForecast[]>();

  for (const forecast of data.wind_forecasts) {
    if (!actualByTime.has(forecast.startTime)) continue;

    const list = forecastsByTime.get(forecast.startTime) ?? [];
    list.push(forecast);
    forecastsByTime.set(forecast.startTime, list);
  }

  const [cutoffHour, cutoffMinute] = filters.cutoff.split(":").map(Number);
  const comparison: ComparisonPoint[] = [];

  for (const [startTime, actual] of actualByTime) {
    const deliveryDate = new Date(startTime);

    // Interpret the chosen cutoff against the UTC calendar day before delivery.
    const cutoffTime = Date.UTC(
      deliveryDate.getUTCFullYear(),
      deliveryDate.getUTCMonth(),
      deliveryDate.getUTCDate() - 1,
      cutoffHour,
      cutoffMinute,
    );

    const forecasts = (forecastsByTime.get(startTime) ?? [])
      .filter((forecast) => Date.parse(forecast.publishTime) <= cutoffTime)
      .sort((a, b) => Date.parse(b.publishTime) - Date.parse(a.publishTime));

    const latestForecast = forecasts[0];

    if (!latestForecast) continue;

    comparison.push({
      actual,
      difference: Number((latestForecast.generation - actual).toFixed(2)),
      forecast: latestForecast.generation,
      startTime,
    });
  }

  return comparison.sort(
    (a, b) => Date.parse(a.startTime) - Date.parse(b.startTime),
  );
}
