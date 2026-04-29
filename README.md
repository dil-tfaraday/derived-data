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

## Deploy to Fly.io (password-protected)

The production image runs a small **Node + Express** server in front of the built dashboard. Access is gated with **HTTP Basic Authentication**:

- **`SITE_PASSWORD`** (required, min 8 characters) — the password browsers will prompt for (or send via `Authorization: Basic`).
- **`SITE_USER`** (optional) — username; defaults to **`viewer`**.

`/healthz` is public (no auth) for Fly health checks. All other routes require a valid username and password. Responses include `X-Robots-Tag: noindex, nofollow, noarchive` and `/robots.txt` disallows crawlers.

### One-time setup

1. Install the [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/) and log in: `fly auth login`
2. If the app name in `fly.toml` (`derived-data-prototype`) is already taken globally, change the `app =` line to a unique name.
3. Create the app (first time only):

   ```bash
   fly apps create derived-data-prototype
   ```

4. Set the site password (pick your own strong secret):

   ```bash
   fly secrets set SITE_PASSWORD='your-long-random-secret' -a derived-data-prototype
   ```

   Optional username:

   ```bash
   fly secrets set SITE_USER='you' -a derived-data-prototype
   ```

5. Deploy from the repository root:

   ```bash
   fly deploy -a derived-data-prototype
   ```

6. Open the HTTPS URL Fly prints. Sign in with **`SITE_USER` / `SITE_PASSWORD`** (defaults: `viewer` + your secret).

### Local Docker smoke test

```bash
docker build -t derived-data:local .
docker run --rm -e SITE_PASSWORD=testsecret12 -p 8080:8080 derived-data:local
# Visit http://127.0.0.1:8080/ — browser will ask for viewer / testsecret12
curl http://127.0.0.1:8080/healthz   # 200 without auth
```
