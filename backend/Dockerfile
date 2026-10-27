FROM python:3.12-slim

ENV PYTHONPATH=/src \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN python -m pip install --no-cache-dir --upgrade pip \
    && python -m pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

EXPOSE 8000

CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8000"]