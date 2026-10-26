import type { WindApiResponse, WindForecast, WindGeneration } from "@/types";

import { CUTOFF_OPTIONS } from "@/constants";

export function getWindAnalytics(): WindApiResponse {
  const wind_generations: WindGeneration[] = [];
  const wind_forecasts: WindForecast[] = [];

  for (let day = 1; day <= 31; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const startTime = new Date(Date.UTC(2026, 0, day, hour)).toISOString();

      // Deterministic, plausible wind generation with daily and multi-day
      // variation. Values are for UI demonstration, not real grid data.
      const dailyVariation = Math.sin((hour / 24) * Math.PI * 2);
      const weatherVariation =
        Math.sin(day * 0.61) * 2100 +
        Math.cos(day * 0.23) * 1400 +
        Math.sin(day * 1.73 + hour * 0.12) * 750;

      const actual = Math.max(
        250,
        6200 +
          dailyVariation * 900 +
          weatherVariation +
          Math.sin(hour * 0.48 + day) * 550,
      );

      wind_generations.push({
        generation: Number(actual.toFixed(2)),
        startTime,
      });

      for (
        let cutoffIndex = 0;
        cutoffIndex < CUTOFF_OPTIONS.length;
        cutoffIndex++
      ) {
        const cutoff = CUTOFF_OPTIONS[cutoffIndex];
        const [cutoffHour, cutoffMinute] = cutoff.split(":").map(Number);

        const publishTime = new Date(
          Date.UTC(2025, 11, day, cutoffHour, cutoffMinute),
        ).toISOString();

        // Forecast uncertainty increases for earlier forecasts.
        const uncertainty = (CUTOFF_OPTIONS.length - cutoffIndex) * 85;
        const forecastError =
          Math.sin(day * 0.83 + hour * 0.31 + cutoffIndex) * uncertainty +
          Math.cos(day * 0.29 + hour * 0.17) * 190;

        wind_forecasts.push({
          generation: Number(Math.max(150, actual + forecastError).toFixed(2)),
          publishTime,
          startTime,
        });
      }
    }
  }

  const actualTotal = wind_generations.reduce(
    (sum, point) => sum + point.generation,
    0,
  );

  return {
    average_generation_mw: Number(
      (actualTotal / wind_generations.length).toFixed(2),
    ),
    comparison_hours: 0,
    forecast_accuracy: null,
    forecast_bias_mw: 0,
    total_generation_mwh: Number(actualTotal.toFixed(2)),
    wind_forecasts,
    wind_generations,
  };
}
