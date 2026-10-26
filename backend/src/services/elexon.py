import asyncio
from collections import defaultdict
from datetime import UTC, date, datetime, time, timedelta
from typing import Any

import httpx
from config import settings
from constants.elexon import CUTOFF_TIMES, MAX_DATE, MIN_DATE
from models.elexon import WindActual, WindForecast


def select_forecasts(
    forecasts: list[WindForecast],
    start_date: date,
    end_date: date,
    cutoff_time: time,
) -> list[WindForecast]:
    eligible: dict[str, list[WindForecast]] = defaultdict(list)

    for forecast in forecasts:
        delivery = datetime.fromisoformat(forecast["startTime"])
        delivery_date = delivery.date()

        if not start_date <= delivery_date <= end_date:
            continue

        cutoff = datetime.combine(
            delivery_date - timedelta(days=1),
            cutoff_time,
            tzinfo=UTC,
        )

        if datetime.fromisoformat(forecast["publishTime"]) <= cutoff:
            eligible[forecast["startTime"]].append(forecast)

    return [
        max(entries, key=lambda f: f["publishTime"]) for entries in eligible.values()
    ]


def aggregate_actuals_hourly(
    actuals: list[WindActual],
    start_date: date,
    end_date: date,
) -> list[WindActual]:
    grouped: dict[str, list[float]] = defaultdict(list)

    for actual in actuals:
        timestamp = datetime.fromisoformat(actual["startTime"])

        if start_date <= timestamp.date() <= end_date:
            hour = timestamp.strftime("%Y-%m-%dT%H:00:00Z")
            grouped[hour].append(float(actual["generation"]))

    return [
        {
            "startTime": hour,
            "generation": round(sum(values) / 2, 2),
        }
        for hour, values in sorted(grouped.items())
        if len(values) == 2
    ]


async def get_wind_analytics(
    start_date: date,
    end_date: date,
    cutoff_time: time,
) -> dict[str, Any]:
    if end_date < start_date:
        raise ValueError("end_date must be on or after start_date")

    if start_date < MIN_DATE or end_date > MAX_DATE:
        raise ValueError("Dates must be within January 2026")

    if cutoff_time.strftime("%H:%M") not in CUTOFF_TIMES:
        raise ValueError("invalid cutoff time")

    publish_from = datetime.combine(
        start_date - timedelta(days=1), time.min, tzinfo=UTC
    )
    publish_to = datetime.combine(end_date, time.max, tzinfo=UTC)

    async with httpx.AsyncClient(timeout=30.0) as client:
        actual_response, forecast_response = await asyncio.gather(
            client.get(
                f"{settings.elexon_base_url}/datasets/FUELHH/stream",
                params={
                    "settlementDateFrom": start_date.isoformat(),
                    "settlementDateTo": end_date.isoformat(),
                    "fuelType": "WIND",
                },
            ),
            client.get(
                f"{settings.elexon_base_url}/datasets/WINDFOR/stream",
                params={
                    "publishDateTimeFrom": publish_from.isoformat(),
                    "publishDateTimeTo": publish_to.isoformat(),
                },
            ),
        )

        actual_response.raise_for_status()
        forecast_response.raise_for_status()

        actuals = actual_response.json()
        forecasts = forecast_response.json()

    generations = aggregate_actuals_hourly(actuals, start_date, end_date)
    forecasts = select_forecasts(forecasts, start_date, end_date, cutoff_time)

    actual_by_time = {item["startTime"]: item["generation"] for item in generations}
    forecast_by_time = {item["startTime"]: item["generation"] for item in forecasts}

    matched_times = actual_by_time.keys() & forecast_by_time.keys()
    actual_values = [actual_by_time[t] for t in matched_times]
    forecast_values = [forecast_by_time[t] for t in matched_times]

    total_actual = sum(actual_values)
    total_error = sum(
        abs(forecast - actual)
        for forecast, actual in zip(forecast_values, actual_values)
    )

    return {
        "total_generation_mwh": round(
            sum(item["generation"] for item in generations), 2
        ),
        "average_generation_mw": (
            round(sum(item["generation"] for item in generations) / len(generations), 2)
            if generations
            else 0.0
        ),
        "forecast_accuracy": (
            round((1 - total_error / total_actual) * 100, 2)
            if total_actual > 0
            else None
        ),
        "forecast_bias_mw": (
            round(
                sum(f - a for f, a in zip(forecast_values, actual_values))
                / len(actual_values),
                2,
            )
            if actual_values
            else None
        ),
        "comparison_hours": len(matched_times),
        "wind_generations": generations,
        "wind_forecasts": sorted(forecasts, key=lambda item: item["startTime"]),
    }
