# Derived data — Risk & Audit synthetic cohort

Synthetic organization extracts and a small **dashboard** prototype for exploring Object Library–aligned benchmarks and a cohort roadmap for data quality.

## Dashboard

```bash
cd dashboard
npm install
npm run dev
```

The dev script aggregates metrics from the synthetic extracts, then starts Vite (default port **5174**).

```bash
npm run build   # aggregate + production build
```

## Data

Synthetic JSON lives under `risk_and_audit_test/` (one folder per organization). The aggregation script reads those folders automatically.
