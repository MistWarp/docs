---
title: Projects and storage
---

# Projects and storage

How projects are uploaded, stored and versioned, how storage limits are counted, and how the backpack syncs.

## Upload pipeline

The editor POSTs a sparse sb3 to `POST /v1/projects/:id/upload` (multipart, fields `project` and optional `thumbnail`). The server extracts at most 256 MiB of `project.json`, validates it incrementally, requires asset filenames to match their content, and limits every asset to 10 MiB and all assets to 50 MiB. The JSON is accepted only when its gzip representation is at most 20 MiB.

### Commit inspection

The read-only commit endpoints inspect the stored `.mwp` on the server. Clients do not need to download the complete workspace to render history or browse an old revision.

- `GET /v1/projects/:id/commits/:sha` returns commit metadata, its first parent, and changed-file records. Each record has `path`, `status`, `oldOid`, `newOid`, `oldSize`, and `newSize`. With `?inline=1`, small text changes also include `oldData` and `newData`, encoded as base64 and capped at 1 MiB per file and 8 MiB per response. Root commits report every file as added. `legacy: true` means the change includes an old `project.sb3`; clients that need the expanded Fractch diff should use their legacy conversion fallback.
- `GET /v1/projects/:id/commits/:sha/tree` returns `commit` and a flat `files` array. Each file has `path`, `oid`, `mode`, `size`, and `binary`.
- `GET /v1/projects/:id/commits/:sha/file?path=<path>` returns one file record and `content`, encoded as base64 by JSON.
- `GET /v1/projects/:id/commits/:sha/co-authors` returns the Rotur users credited on that commit. The older `/collaborators` path remains an alias.
- `PATCH /v1/projects/:id/commits/:sha` accepts `{coAuthors: string[]}` with at most 25 existing Rotur usernames. `{collaborators: string[]}` remains an input alias. It replaces the commit's co-author metadata without rewriting Git objects or changing any SHA. Responses expose canonical `coAuthors` records as `{username, userId}` and a compatibility `collaborators` alias. Only the project owner, a maintainer, or an administrator may patch commit credits.

These routes use the same see-inside policy as workspace downloads. The server caches materialized workspace layers and computed JSON by the ordered content-addressed layer keys. Public projects may be cached by the CDN for one hour; private and unlisted responses use `private, no-store`. Stable ETags let browsers revalidate without reparsing Git objects. The local inspection cache keeps at most 256 files or 2 GiB and removes entries older than 24 hours.

Before extraction, the API rejects archives with unsafe paths, duplicate entries, symlinks, unsupported compression methods, or more entries and expanded bytes than the endpoint allows. MistWarp history archives are capped at 128 MiB compressed and 20,000 entries. Their expanded-byte ceiling matches the account's maximum project size, including its tier-specific asset allowance. The API reads each history entry through that ceiling before storing it, so forged ZIP metadata cannot bypass the limit.

- `assets/<md5ext>`: content addressed, shared across all projects and remixes, uploaded once ever
- `projects/<id>/project.json`: the gzip-encoded playable snapshot
- `projects/<id>/thumb.png`

Project JSON, history archives, and assets are staged on local disk before the upload request returns. The API serves those files locally until the project has been inactive for seven days. Every edit restarts that window, including saves with unchanged content. Shared files wait until every project referencing them has been inactive for seven days. The background loop checks every five minutes, uploads eligible files to R2, and removes each local copy only after a successful upload. Failed uploads stay local for retry. Existing local copies recorded in the R2 storage index are also removed after inactivity without uploading them again. With R2 disabled, files stay local. Git carries every save. `data/assets-index.json` tracks known assets so duplicates are never re-uploaded.

The first editor save uploads a compact MWP archive containing the Git repository without a duplicate worktree. Later saves compare the local HEAD with the server HEAD and send only new Git objects plus updated refs. The API stores those archives as content-addressed layers, so remixes share their parent's history instead of copying it. It compacts a chain after eight layers. If the user saves without making a commit, the editor sends a full archive with the worktree so uncommitted changes are not lost.

For a delta whose `baseHead` still matches the stored head, the API removes loose Git objects already present in the materialized base before storing the new layer. It retains the delta manifest and refs, verifies the combined archive, and stitches only the new commits and graph nodes ahead of `baseHead` onto the inherited metadata. A final locked head comparison rejects concurrent history changes before project metadata is saved.

### Generated history

Projects saved before history existed, or uploaded without a history archive, get one generated from their stored snapshot. At every start, `HISTORY_MIGRATION_WORKERS` background workers backfill every project that has none, salvaging what they can when old assets are missing. An upload without history generates it straight away, needs every asset, and is still saved if generation fails.

A remix's history is built on its parent's, at the base commit recorded for the remix, so the parent's history is generated first. A missing base never leads to a new root commit or to using the parent's current head. When the parent can't be read or its history can't be copied yet, generation fails and the project is left as it was, so the next upload or the next server start tries again. A deleted parent or an unrecorded base commit fails the same way, and only succeeds if the parent comes back or the original history is restored. A project whose recorded edits go beyond its base needs its original repository and always fails.

The first start after history sizes were recorded measured the history of existing projects once, from local copies and the R2 inventory. The `migration:project-history-bytes-v1` diagnostic record marks it done.

Upload callers hold the project's save lock (`project-history-<id>`). History preparation takes that lock itself, after resolving ancestors, and checks the saved source hasn't changed since. So an upload releases its lock while history is prepared and takes it back afterwards. That avoids deadlocking on its own lock and holding nested locks across a chain of remix ancestors.

### Serving snapshots

Project, release and report-evidence snapshots are served from the local copy while one exists. Otherwise the API fetches the object from R2 through a presigned URL and passes it on as stored, with `Content-Encoding: gzip` when the stored copy is gzipped:

- The fetch asks for `Accept-Encoding: identity`, so the HTTP client doesn't decompress R2's body before it's passed on.
- The body is a raw binary string. Code handling it must not assert it as `byte[]`, which would base64-decode it.
- R2 answering 404 is a real 404, and so is a missing local copy when R2 isn't configured. Any other failure, such as a refused credential or an R2 outage, answers 502 `project snapshot unavailable` rather than saying the project has no snapshot. So does an empty body, or one over 20 MiB.

## Storage limits

MistWarp has no total storage limit of its own for Rotur accounts. Their projects, assets and backpack items count against the person's one Rotur storage allowance, which their Rotur plan sets and which they share with Rotur's other apps. The Rotur API keeps the count in its storage ledger, under three objects for MistWarp:

| Object | Counts |
| --- | --- |
| `projects` | `project.json` snapshots, including the ones releases keep, and history archives |
| `assets` | Costumes and sounds |
| `backpack` | Backpack item bodies |

Projects in the trash count until they're permanently deleted. Each blob counts once per person, however many of their projects use it: a costume in ten of their projects counts once, and so does a remix's `project.json` until the remix is first saved. Counting is per person: two people using the same asset each count it, though it's stored once. Thumbnails, share cards and backpack previews don't count.

### Holding and settling

1. Before something is stored, mistwarp-api works out each object's new total. Any object that would grow is reserved at its new total, and the ledger only holds the difference. When that doesn't fit, the request answers 413 with the code `storage_full`. Saves, uploads, remixes and the backpack also send `shared: true`, `used`, `limit`, `remaining`, `needed` and `membershipUrl`; transferring a project to a new owner only sends `error` and `needed`. A change that leaves every object at or below what the ledger already counts always fits. Admins aren't stopped by a full allowance.
2. Once it's stored, the totals are worked out again from what's really there and the ledger is set to them, which commits the reservation. A reservation that is never committed or released expires on its own, after the ledger's default of an hour.
3. Permanently deleting a project from the trash, deleting backpack items and anything else that only frees space doesn't reserve anything. It settles a couple of seconds later, once however many changes arrive meanwhile. Deleting a project only moves it to the trash, where it still counts.

Every six hours, starting two minutes after the server starts, everyone is settled. That catches anything a settle missed while Rotur couldn't be reached. When Rotur can't be reached or answers with an error, MistWarp saves anyway rather than lose someone's work, and the next settle counts it.

Someone who stores more than their allowance, for example after their plan ends, keeps everything they have. The ledger stays at what it last counted for them, and they can't add more until they're back under it.

An asset uploaded ahead of the save that uses it holds room for up to a week. The hold is released when a save references the asset, or when its upload fails. Deleting an account frees everything MistWarp counted for it.

Without `ROTUR_SERVICE_SECRET`, or with a `ROTUR_LOCAL_API_URL` that isn't a loopback address (see [Configuration](/backend/configuration)), the server logs a warning at start and nothing is counted or refused for Rotur accounts.

### Classroom students

Classroom students aren't Rotur accounts, so they stay outside the ledger. Their class's plan gives them storage, shared by every student in the plan's classes: 1 GiB on the free plan, 25 GiB on Classroom and 250 GiB on School. An admin can set another amount on a paid plan, but not on the free one. A student's count includes their backpack, and each of their projects counts its assets, compressed `project.json` and history archive, even when an asset is shared with another project, and assets uploaded ahead of a save count as pending for up to 7 days.

### Quota

`GET /v1/me/quota` returns:

| Field | Value |
| --- | --- |
| `shared` | `true` for Rotur accounts, `false` for classroom students |
| `known` | `false` when Rotur couldn't say. `used`, `limit` and `remaining` are then 0 |
| `used`, `limit`, `remaining` | For a Rotur account, their whole Rotur storage, including other apps. For a student, `used` is their own storage and `limit` is that plus what's left in their plan's shared pool |
| `pending` | Bytes uploaded ahead of a save. Always 0 for Rotur accounts. When Rotur answered, their holds are part of `mistwarp` |
| `mistwarp` | MistWarp's part of `used`: what the ledger counts plus what it holds. When Rotur can't say, MistWarp's own measure of what's stored, without holds |
| `backpack` | The bytes held in the backpack |
| `largest` | The five largest projects, trashed ones included, as `id`, `title`, `bytes` and `trashed`. Each project's `bytes` includes every asset it uses, so a shared asset shows in each |
| `membershipUrl` | Where to get more Rotur storage |


### Backfilling the ledger

Rotur's one-off `claw storage-backfill` loads what MistWarp already stores into the ledger. Make its input with the API stopped:

```sh
./main storage-report <file>
```

It measures any release snapshots without a recorded size, writes `{service: "mistwarp", accounts: {<user id>: {projects, assets, backpack}}}` to the file and exits. Only accounts that store something are listed, and an object they don't use is left out.

## Backpack

The editor backpack syncs to the signed-in account. Items are scripts, sprites, costumes and sounds, stored as a body file plus an optional PNG or JPEG thumbnail under `backpack/<random id>/` in R2 (or `data/blobs/` locally), with the per-user list in `data/backpack/`. Blob URLs are unguessable and served sandboxed with `nosniff`; only the owner can list items.

| Route | Purpose |
| --- | --- |
| `GET /v1/me/backpack?type=&offset=&limit=` | Newest first, up to 100 per page, with `total`, `count` and `bytes` |
| `POST /v1/me/backpack` | Multipart `type`, `mime`, `name`, `body`, and optional `thumbnail` with `thumbnailMime`; checked against their Rotur storage, or class storage for students |
| `PATCH /v1/me/backpack/:id` | Rename with `{name}` |
| `DELETE /v1/me/backpack/:id` | Delete one item |
| `POST /v1/me/backpack/delete` | Delete several with `{ids}`; returns `deleted` and `freedBytes` |

A body may be up to 20 MB and a backpack holds up to 2000 items. Account deletion, deleted Rotur accounts and data export all include the backpack.
