export type RequestStatus = "loading" | "success" | "error";

export type Filters = {
  startDate: string;
  endDate: string;
  cutoff: string;
};

export type WindGeneration = {
  startTime: string;
  generation: number;
};

export type WindForecast = {
  startTime: string;
  publishTime: string;
  generation: number;
};

export type WindApiResponse = {
  total_generation_mwh: number;
  average_generation_mw: number;
  forecast_accuracy: number | null;
  forecast_bias_mw: number;
  comparison_hours: number;
  wind_generations: WindGeneration[];
  wind_forecasts: WindForecast[];
};

export type ComparisonPoint = {
  startTime: string;
  forecast: number;
  actual: number;
  difference: number;
};
