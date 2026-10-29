# WindScope — Wind Generation Analytics

WindScope is a web application that compares Great Britain’s national wind generation forecasts with actual generation. It helps users understand forecast performance by examining forecast values, actual generation, and forecast errors for historical delivery periods.

The project was developed as part of a full-stack software engineering challenge for a UK energy utility use case.

## Demo

- **Live application:** https://wind-scope-app.vercel.app/
- **Backend API:** https://wind-analytics.onrender.com/
- **Video walkthrough:** https://youtu.be/e3i7YXngQFA

The video includes a product demonstration and a technical walkthrough covering the architecture, data processing, implementation, and future improvements.

## Features

- Compare forecasted and actual national wind generation.
- Filter historical data by date and forecast publication cutoff.
- View summary metrics, including total generation, average generation, and forecast accuracy.
- Explore forecast and actual generation through charts and a detailed data table.
- Select forecasts based on their publication time, ensuring that only forecasts available by the specified cutoff are considered.

## Technology Stack

**Frontend**

- React
- Vite
- Tailwind CSS
- Shadcn UI

**Backend**

- Python
- FastAPI

**Deployment and development**

- Vercel for the frontend
- Render for the backend
- Docker and Docker Compose for local development

## Data Sources

The application uses the following Elexon BMRS datasets:

- **FUELHH — Actual generation:** https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/FUELHH/stream
- **WINDFOR — Wind generation forecasts:** https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/WINDFOR/stream

The application considers records with `fuelType` set to `WIND` for actual generation.

Relevant fields:

| Field         | Meaning                                                       |
| ------------- | ------------------------------------------------------------- |
| `startTime`   | Start of the target delivery period                           |
| `generation`  | Wind generation value                                         |
| `publishTime` | Time when a forecast was published; used for forecast records |

The analysis focuses on delivery periods in January 2026.

### Data Processing and Analysis

1. Retrieve actual wind generation and forecast records for the relevant period.
2. Apply the selected forecast publication cutoff.
3. For each delivery period, select the latest forecast published at or before the cutoff.
4. Aggregate actual generation into hourly values and align it with the corresponding forecast periods.
5. Calculate summary metrics and forecast errors for the matching periods.
6. Return the processed data and metrics to the frontend for visualization.

This approach makes the forecast comparison reflect the information available at the selected decision cutoff, rather than using forecasts published later.

## Project Structure

```text
wind-analytics/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── index.html
│   ├── vite.config.ts
│   └── Dockerfile
├── compose.yaml
└── README.md
```

- `backend/app.py` — FastAPI application and backend data-processing logic.
- `backend/requirements.txt` — Python dependencies.
- `backend/Dockerfile` — Backend container configuration.
- `frontend/src/` — React application source code and UI components.
- `frontend/public/` — Static frontend assets.
- `frontend/package.json` — Frontend dependencies and scripts.
- `frontend/vite.config.js` — Vite configuration.
- `frontend/nginx.conf` — Nginx configuration for serving the production frontend.
- `frontend/Dockerfile` — Multi-stage frontend build and production serving configuration.
- `compose.yaml` — Configuration for running the application services locally.
- `README.md` — Project documentation and setup instructions.

## Run Locally with Docker

### Prerequisites

- Docker Engine
- Docker Compose plugin

Verify the installation:

```bash
docker --version
docker compose version
```

### Start the application

Clone the repository and enter the project directory:

```bash
git clone https://github.com/vignesh-g-05/wind-analytics.git
cd wind-analytics
```

Build and start the services:

```bash
docker compose up --build
```

Once the containers are running, open the frontend at:

**http://localhost:5173**

The backend API is available at:

**http://localhost:8000**

To stop the services, press `Ctrl+C`, then run:

```bash
docker compose down
```

## Deployment

- **Frontend:** https://wind-scope-app.vercel.app/
- **Backend:** https://wind-analytics.onrender.com/

The frontend and backend are deployed separately. The backend is configured to allow requests from the deployed frontend origin.

The first backend request may take longer if the hosting service has put the application to sleep.

## Scope and Limitations

- The analysis uses historical data for January 2026; it is not a live generation-monitoring system.
- The application focuses on national wind generation and does not include electricity demand, wholesale market prices, thermal generation, or other renewable sources.
- Forecast accuracy metrics describe the selected historical periods and should be interpreted in the context of the chosen dates and publication cutoff.
- This application supports understanding forecast performance; it does not automatically make or execute electricity procurement decisions.

## Potential Future Improvements

- Compare forecast performance across multiple date ranges.
- Track forecast errors and accuracy trends over time.
- Include electricity demand, market prices, and additional generation sources.
- Extend the analysis to support a broader view of day-ahead electricity procurement.

## AI Tool Usage

AI tools were used to assist with development tasks, including implementation support, code refinement, documentation, and preparation of the project walkthrough. The application was reviewed and configured for the assignment requirements, including local Docker execution and deployment.

## Assignment Deliverables

- **Product demo and technical walkthrough:** https://youtu.be/e3i7YXngQFA
- **Deployed application:** https://wind-scope-app.vercel.app/
- **Source code:** https://github.com/vignesh-g-05/wind-analytics.git
