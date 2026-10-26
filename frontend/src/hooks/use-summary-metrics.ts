import { useMemo } from "react";

import type { ComparisonPoint } from "@/types";

import { useDashboard } from "@/context";

export function useSummaryMetrics(points: ComparisonPoint[]) {
  const { state } = useDashboard();

  return useMemo(() => {
    if (points.length === 0) return null;

    const totalEnergy = points.reduce((sum, point) => sum + point.actual, 0);
    const forecastBias =
      points.reduce((sum, point) => sum + point.difference, 0) / points.length;

    return {
      averageGeneration: totalEnergy / points.length,
      comparisonHours: points.length,
      forecastAccuracy: state.data?.forecast_accuracy ?? null,
      forecastBias,
      totalEnergy,
    };
  }, [points, state.data?.forecast_accuracy]);
}
