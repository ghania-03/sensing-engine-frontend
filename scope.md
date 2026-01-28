front end.
Please align the dashboard structure as outlined below.
Overview
Purpose: Quick executive snapshot
Widgets:
Trending SKUs at Risk (Top 5)
SKU Name
Trend Spike %
Estimated Time Until Stockout (hours/days)
Revenue at Risk ($)
Today’s AI Alerts
Example:
“Store-Level Demand Surge Detected — Green Silk Scarf (Chicago & SoHo)”
Status: Action Required / In Review
Projected Revenue Impact (Next 14 Days)
Example:
“$420K revenue protected through early detection”
Live Trends
Purpose: Show external demand signals driving in-store demand
Sections:
Trend Radar
Trending keywords / products
% change (24h / 7d)
Signal Sources
Social mentions (TikTok, Instagram, X)
Google search momentum
Optional: Influencer velocity score
SKU Mapping
Example:
“Green Silk Scarf → SKU #GS-019”
Confidence score (e.g., 92%)
Demand Forecast
Purpose: Convert trends into demand numbers
Features:
SKU-level predictions:
Expected units sold
Confidence band (Low / Medium / High)
Visuals:
Dual-line chart:
Historical Sales vs AI Forecast
AI-driven operational decisions
AI-Generated Recommendations
Reorder / transfer quantity
Suggested supplier or DC
Expected revenue protected
Action Status
Drafted
Sent for Approval
Approved / Rejected
Purchase Orders
Purpose: Execution visibility (can be lightweight for now)
Features:
Previous purchase / replenishment list
PO status (Draft / Approved)
Settings

_-_-_-

scope of project
Scope of this project
Summary
This document defines the scope for Part 2: Demand Analysis & Forecast Dashboard. The goal is to deliver a production ready forecasting system that ingests historic sales and social signals, produces reliable 7 , 14 , and 30 day forecasts, and exposes those forecasts through an interactive dashboard and APIs for operational use. The system includes data pipelines, model training and evaluation, model serving, monitoring, and alerting.
Objectives and Deliverables
•	Primary objective: Provide accurate short  and medium term demand forecasts and actionable signals to reduce stockouts and improve replenishment decisions.
•	Deliverables: 
o	ETL pipeline that ingests sales and social media signals.
o	Feature store with engineered calendar, lag, and promotion features.
o	Model suite (ARIMA/SARIMA, Prophet, XGBoost/LightGBM) with evaluation reports.
o	Forecast API that returns 7/14/30 day forecasts and confidence intervals.
o	Interactive dashboard with charts, KPIs, filters, and alerts.
o	Monitoring and alerting for model performance, data drift, and demand spikes.
o	Documentation: API spec, data schema, runbook for retraining and incident response.
Functional Scope
Data Ingestion and Preparation
•	Sources: historic sales (daily or weekly), product catalog, promotions/holidays, social signals (mentions, hashtags, trend scores).
•	Tasks: timestamp alignment, missing value imputation, outlier handling, aggregation options (daily/weekly), and enrichment with calendar flags and promotion indicators.
•	Output: clean time series per SKU or SKU group and a feature table for model training.
Modeling and Evaluation
•	Candidate models: ARIMA / SARIMA, Prophet, XGBoost, LightGBM.
•	Approach: baseline experiments, hyperparameter tuning, cross validation with rolling windows, and holdout evaluation.
•	Horizon strategy: either separate models per horizon (7/14/30 days) or a single multi horizon model depending on empirical performance.
•	Metrics: MAE, RMSE, MAPE, and stability across time windows. Include prediction intervals and calibration checks.
Serving and APIs
•	Forecast API endpoints: request forecasts by product, category, region, and date range; return point forecasts and confidence bands.
•	Operational endpoints: model status, last retrain timestamp, and health checks.
•	Security: API auth (OAuth2 or API keys), rate limiting, and audit logging for automated actions.
Dashboard and UX
•	Core views: historic sales vs forecast time series, model comparison view, heatmap of demand intensity, social signal panel, KPI cards (accuracy, stockout risk).
•	Controls: date range selector, forecast horizon toggle, product/category filters, region selector, and drill down into spikes.
•	Alerts: visual flags on dashboard and push notifications via Slack/Email for demand spikes or model degradation.
Implementation Roadmap and Milestones
1.	M1 Data Pipeline and Mock API 
o	Build ETL to load historic sales and promotions; create mock social signal feed; expose mock /api/forecasts.
2.	M2 Feature Store and Baseline Models 
o	Implement lag/rolling features; train ARIMA and Prophet baselines; evaluate metrics.
3.	M3 ML Models and Model Selection 
o	Train XGBoost/LightGBM with feature engineering; run hyperparameter tuning; select best model per horizon.
4.	M4 Serving, Retraining, and Monitoring
o	Deploy model endpoints, schedule daily retraining, implement drift detection and error monitoring.
5.	M5 Dashboard and Alerts  
o	Build interactive dashboard, integrate forecast API, implement alerting to Slack/Email.
6.	M6 Hardening and Handoff  
o	Load testing, security review, documentation, and handoff to operations.
Milestone acceptance criteria: reproducible forecasts, API responses within SLA, dashboard functional with filters and alerts, and monitored retraining pipeline.
Risks, Mitigations, and Next Steps
•	Risk: sparse or noisy SKU level data. Mitigation: aggregate to category level, use hierarchical forecasting, and apply robust imputation.
•	Risk: model overfitting to promotions or social noise. Mitigation: strict cross validation, regularization, and feature importance monitoring.
•	Risk: integration brittleness with external APIs. Mitigation: adapter pattern, contract tests, and retry/backoff logic.
•	Immediate next steps: 
1.	Finalize data schema and sample extract for one pilot SKU group.
2.	Implement the ETL to produce a clean time series and a mock /api/forecasts.
3.	Run baseline experiments (ARIMA and Prophet) and produce a short evaluation report.
Appendix (short checklist for the intern)
•	Data: obtain 12+ months of daily sales, promotions calendar, and sample social signal CSV.
•	Frontend: wireframe dashboard and implement TimeSeriesChart with mock data.
•	Backend: scaffold ETL, feature store, and a mock forecast endpoint.
•	Modeling: run ARIMA and Prophet baselines, log MAE/RMSE for 7/14/30 days.
