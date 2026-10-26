from datetime import date, time

import httpx
from config import settings
from fastapi import FastAPI, HTTPException
from services.elexon import get_wind_analytics

app = FastAPI(title=settings.app_name)


@app.get("/health")
def check_health() -> dict[str, str]:
    return {"status": "healthy"}


@app.get("/api/analytics")
async def analytics(
    start_date: date = date(2026, 1, 1),
    end_date: date = date(2026, 1, 31),
    cutoff_time: time = time(11, 30),
):
    try:
        return await get_wind_analytics(start_date, end_date, cutoff_time)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except httpx.HTTPError:
        raise HTTPException(
            status_code=502,
            detail="Failed to retrieve data from Elexon",
        )
