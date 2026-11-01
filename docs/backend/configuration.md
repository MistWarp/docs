---
title: Configuration
---

# Configuration

The server loads `.env` from the directory it runs in. A value is looked up in this order: `MISTWARP_<NAME>` in the real environment, then `.env`, then `<NAME>` in the real environment. Put per-process overrides in `MISTWARP_<NAME>` (for example `MISTWARP_PORT`), so a shared shell that exports another project's variables can't replace this API's configuration.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| PORT | 5627 | Listen port |
| HISTORY_MIGRATION_WORKERS | 4 | Concurrent background workers used to backfill missing project histories (clamped to 1-8) |
| APP_URL | https://api.mistwarp.org | Public URL of this API |
| ROTUR_BASE | https://api.rotur.dev | The public Rotur API, for sign-in, profiles, plans, notifications and the apps API |
| ROTUR_APP_KEY | mistwarp | The old validator key, for editors that predate validators keyed to the Rotur App |
| COMMERCE_SERVICE_KEY | | Key registered for `mistwarp` in Rotur's `COMMERCE_SERVICE_KEYS`. Only bounty awards and the groups integration still use it |
| ROTUR_CLIENT_ID | | The MistWarp Rotur App's client ID (`app_1938b6a87799f862`). With the secret, mistwarp-api calls the apps API as MistWarp |
| ROTUR_CLIENT_SECRET | | One of the MistWarp Rotur App's secrets, made with **New secret** on rotur.dev/me/developer |
| MISTWARP_ROTUR_USER | | Rotur account that gets MistWarp's share of game product sales. Without it, the MistWarp Rotur App's owner gets it |
| ROTUR_WEBHOOK_SECRET | | Signing secret (`whsec_…`) of the MistWarp Rotur App's webhook. Without it `POST /v1/rotur/webhook` answers 503 |
| ROTUR_SERVICE_SECRET | | The Rotur API's own `ROTUR_SERVICE_SECRET`. mistwarp-api uses it to call the Rotur API's storage ledger as the official app `mistwarp`. Without it, storage isn't counted against anyone's Rotur storage (see [Storage limits](/backend/storage#storage-limits)) |
| ROTUR_LOCAL_API_URL | http://127.0.0.1:5602 | The Rotur API on this machine. It must be `http://127.0.0.1:<port>`, `http://localhost:<port>` or `http://[::1]:<port>` with nothing after the port but an optional trailing slash, so the service secret never leaves the machine. Any other value logs a warning at start and turns storage counting off |
| R2_ENDPOINT | | https://accountid.r2.cloudflarestorage.com |
| R2_BUCKET | mistwarp | R2 bucket name |
| R2_ACCESS_KEY_ID | | R2 access key |
| R2_SECRET_ACCESS_KEY | | R2 secret key |
| R2_PUBLIC_BASE | | Public custom domain for the bucket |
| GITEA_URL | https://git.rotur.dev | Optional Rotur Git instance |
| GITEA_ADMIN_TOKEN | | Optional Rotur Git integration token |
| EDITOR_ORIGIN | https://mistwarp.org | Public editor base URL used in links |
| ERROR_REPORT_ORIGINS | (empty) | Comma-separated origins, besides EDITOR_ORIGIN, whose error reports `POST /errors` accepts. Reports from any other origin are ignored |
| ADMIN_USERS | mist | Comma separated admin usernames |
| CLASSROOM_ENABLED | (off) | Set to `true` to open MistWarp Classroom. While it is off, every `/classroom/*` route answers 404 and student accounts cannot sign in, except for MistWarp admins and the students of classes an admin owns, so Classroom can still be tested |
| GITHUB_ORG | MistWarp | GitHub org whose pull requests appear on the roadmap's Changes tab |
| GITHUB_TOKEN | | Optional GitHub token; only raises the search rate limit, the feed works without one |
| REALTIME_URL | wss://api.mistwarp.org/v1/connect | Public multiplayer WebSocket endpoint |
| STRIPE_SECRET_KEY | | Stripe secret key for Classroom plans; online payment is off while any Stripe value is empty |
| STRIPE_WEBHOOK_SECRET | | Signing secret of the Stripe webhook pointed at `/v1/classroom/billing/webhook` |
| STRIPE_CLASSROOM_PRICE | | Recurring Stripe price for one Classroom plan |
| STRIPE_SEAT_PACK_PRICE | | Optional recurring Stripe price for each pack of 10 extra student seats |
| STRIPE_CLASSROOM_PRICE_YEARLY | | Yearly Stripe price for one Classroom plan; when set, checkout offers yearly billing and uses it by default. Online payment needs at least one of the monthly and yearly Classroom prices |
| STRIPE_SEAT_PACK_PRICE_YEARLY | | Optional yearly Stripe price for each pack of 10 extra student seats, used with the yearly Classroom price |

The multiplayer WebSocket runs inside this API process at `/v1/connect`. It
uses the same listener, domain, and deployment as the HTTP API.

mistwarp-api runs on the same machine as the Rotur API. It calls the public Rotur API (`ROTUR_BASE`) like any other app, and the storage ledger directly on `ROTUR_LOCAL_API_URL`.
