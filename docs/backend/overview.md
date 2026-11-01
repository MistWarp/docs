---
title: Backend Overview
sidebar_position: 1
---

# Backend Overview

mistwarp-api is the OSL service behind the MistWarp community platform. It handles Rotur sign-in, projects and their history, Cloudflare R2 storage, comments and other community features, MistWarp Classroom, game data, and pull requests between MistWarp forks. Rotur Git can be connected as an optional external Git provider. The source is at [MistWarp/api](https://github.com/MistWarp/api).

Community data lives in SQLite at `data/community.db`. Sessions, indexes and queues are JSON files under `data/`. Project files go to R2, or to `data/blobs/` when no bucket is configured.

## Running it locally

Copy `.env.example` to `.env`, fill in the values, then run:

```
osl run main.osl
```

See [Configuration](/backend/configuration) for every setting and the order they are read in.

The API needs OSL 3.0. `opal.json` lists the usual commands:

| Command | Does |
| --- | --- |
| `osl test` | Runs every `*.test.osl` |
| `osl lsp check main.osl` | Type checks the whole program |
| `osl compile main.osl -o main` | Builds the server binary |
| `python3 scripts/route_dump.py .` | Prints every registered route with its middleware |
| `python3 scripts/e2e_smoke.py <binary> [<other binary>]` | Runs an offline end to end smoke test, and diffs the responses of two builds |

## Source layout

`main.osl` only composes the app: it imports each domain directory, runs startup and migrations, builds the router and starts it. Everything else lives in `src/<domain>/`:

| Directory | Owns |
| --- | --- |
| `config` | Reading `.env` and the environment, data paths, size limits, the R2 client |
| `core` | Shared helpers and the community database |
| `http` | Request body helpers, request size limits, auth and admin middleware, cache headers |
| `auth` | Sessions, user identity, editor sessions, the agreement, blocks and mutes, settings, privacy |
| `storage` | Blob storage on R2 or disk, the upload queue, thumbnails, quotas, the Rotur storage ledger, the backpack |
| `projects` | Projects, sharing, remixes, releases, extensions, live collaboration, monetisation |
| `history` | Project history, deltas, history backfill and commit metadata |
| `git` | Git inspection, pull requests and Rotur Git |
| `games` | Game saves, inventories and marketplace products |
| `realtime` | The multiplayer and site WebSockets |
| `community` | Spaces, roadmap, comments, bounties, profiles, news, notifications, milestones, standing, reports, groups |
| `admin` | Admin tools, bans and shadow bans, moderation, error reports, funnel events |
| `classroom` | MistWarp Classroom |
| `rotur` | The Rotur App, plans and perks, payments, signals, badges and webhooks |

Each directory registers its routes in its own `routes.osl` (`registerProjectRoutes(api)` and so on), and `main.osl` calls them in order under `/v1` and `/api`. Each file lists what other directories may use in an `export {...}` block at the top; anything not exported is private to its directory. Global caches live next to the code that uses them. Tests sit beside the file they test as `<name>.test.osl`.

## Where it runs

The site and editor are one scratch-gui build (community pages live in `scratch-gui/src/community`), served on the frontend domain:

| Path | Serves |
| --- | --- |
| / | community app (`index.html`) |
| /editor | scratch-gui editor |
| /embed.html | scratch-gui embed player (project pages iframe this) |
| /project/*, /explore, /users/*, /settings | community app (client routing) |

This API runs at `api.mistwarp.org`, with `mwapi.mistium.com` retained as a backwards-compatible hostname. The frontend calls it at `https://api.mistwarp.org/v1` directly. The scratch-gui dev server talks to the live API too (see
[Building and Running](/contributing/building-running)). Auth is Bearer-token based (the session token returned by `/v1/auth`), so a cross-domain API works without shared cookies. CORS echoes the request Origin with credentials, so any frontend origin is accepted.

`/v1` is the canonical route group. Every route is also registered under `/api` for backwards compatibility, including uploads and their larger body limits. New clients and generated URLs must use `/v1`.

R2 bucket only needs public GET through `R2_PUBLIC_BASE`, and the public domain must expose the bucket's `assets/` prefix and allow CORS GET requests from the MistWarp frontend. Project metadata keeps the API `/blobs/assets` base. That endpoint serves a local asset when its file exists under `data/blobs/assets/`; otherwise it redirects to `R2_PUBLIC_BASE`. All writes go through this server. With no R2 configured, the server falls back to local disk (`data/blobs/`, served at `/blobs`) so it runs locally with zero setup.
