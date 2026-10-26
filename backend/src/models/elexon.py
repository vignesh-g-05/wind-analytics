from typing import TypedDict


class WindForecast(TypedDict):
    dataset: str
    publishTime: str
    startTime: str
    generation: float


class WindActual(TypedDict):
    startTime: str
    generation: float