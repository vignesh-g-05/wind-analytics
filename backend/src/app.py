from fastapi import FastAPI

from settings import settings

app = FastAPI(title=settings.app_name)

print(settings.app_name)


@app.get("/health")
def check_health() -> dict[str, str]:
    return {"status": "healthy"}
