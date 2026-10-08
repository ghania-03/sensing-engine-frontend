# Sensing Engine Frontend

A React dashboard for viewing demand trends, SKU forecasts, replenishment information, and dashboard settings.

## Overview

The frontend provides five routed views: Overview, Live Trends, Demand Forecast, Purchase Orders, and Settings. Trend, SKU mapping, social signal, and forecast data are requested from the FastAPI backend. Purchase Orders currently uses local sample data.

## Live Demo

**Frontend:** [View](https://sensing-engine-frontend-psi.vercel.app/ ) 

**API Documentation:**  [View](https://sensing-engine-backend-amber.vercel.app/docs) 

## Features

- Overview of trend-linked SKU metrics, social-signal alerts, and forecast revenue metrics.
- Live Trends view with keyword and source summaries, social posts, and signal polling every 30 seconds.
- Demand Forecast view with SKU and 7-, 14-, or 30-day horizon selection, forecast chart, and prediction table.
- Purchase Orders view with status filters and local sample orders.
- Dashboard theme toggle and settings controls.

## Technology

- React 18 and TypeScript
- Vite and SWC
- React Router and TanStack React Query
- Tailwind CSS
- Recharts
- Radix UI components and Lucide icons

## Project structure

```text
sensing-engine-frontend/
├── public/
│   └── Static assets
├── src/
│   ├── components/
│   │   ├── dashboard/    Dashboard charts, tables, and cards
│   │   ├── layout/       Shared dashboard layout and navigation
│   │   └── ui/           Reusable interface components
│   ├── hooks/             Forecast, theme, and UI hooks
│   ├── lib/               API client, response types, mock data, and utilities
│   ├── pages/             Routed application views
│   ├── App.tsx            Providers and routes
│   └── main.tsx           Application entry point
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Local setup

Install dependencies from the frontend repository root:

```sh
npm install
```

The API client reads the Vite environment variable `VITE_API_BASE`. It defaults to `http://localhost:8000` when the variable is not set. To use another backend, set `VITE_API_BASE` in a local `.env` file to the backend base URL, without the `/api` suffix. Keep local environment files out of source control.

Start the development server:

```sh
npm run dev
```

Vite is configured to serve on port `8080`. The FastAPI backend must be running at the configured API base for backend data to load.

## Backend API

API routes use the `/api` prefix. The frontend requests:

- `GET /api/trends`
- `GET /api/sku-mapping`
- `GET /api/forecast` with `sku`, `horizon`, and optionally `region` and `start_date`
- `GET /api/social`
- `GET /api/trends/signals`
- `GET /api/historic` with `sku`

The current backend registers the trends, SKU mapping, social, signals, and forecast routes. It does not register `/api/historic`; the Demand Forecast view can use historical points included in the forecast response when available.

## Current limitations

- Purchase Orders are local sample data and are not loaded from a backend endpoint.
- Forecast confidence labels, trend values, stockout estimates, or aggregate expected units may be unavailable depending on the API response; the interface displays unavailable values rather than generating replacements.
- Email, push, SMS, digest, and regional settings are UI controls; the current frontend does not connect them to a backend.
