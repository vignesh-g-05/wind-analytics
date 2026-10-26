import type { WindApiResponse } from "@/types";

const baseUrl =
  import.meta.env.VITE_APP_SERVER_BASE_URL ?? "http://localhost:8000";

export async function getWindAnalytics({
  cutoffTime = "11:30:00",
  endDate = "2026-01-31",
  startDate = "2026-01-01",
}: {
  startDate?: string;
  endDate?: string;
  cutoffTime?: string;
} = {}): Promise<WindApiResponse> {
  const params = new URLSearchParams({
    cutoff_time: cutoffTime,
    end_date: endDate,
    start_date: startDate,
  });
  const response = await fetch(`${baseUrl}/api/analytics?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch analytics (${response.status})`);
  }

  return (await response.json()) as WindApiResponse;
}
