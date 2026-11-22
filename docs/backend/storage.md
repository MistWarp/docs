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
- `GET /v1/projects/:id/commits/:sha/changes` describes the same commit by what changed in each sprite instead of by file. `targets` has one entry per changed sprite folder (`path`, the sprite's `name` when its header can be read, and its `.fractch` region files in `files`), comparing all of the folder's region files together. Each target has:
  - `scripts`: each `added`, `removed`, `changed` or `moved` (to another region file), with its `head`, `file`, `before` and `after` text and canvas positions.
  - `items`: variables, lists, costumes, sounds, extensions and comments that were added, removed, renamed or changed. A costume or sound whose image or audio changed is `edited`, and a new costume or sound order is one `reordered` item.
  - `state`: what running the project changes rather than edits. That is variable and list values, sprite position, size, direction, layer and visibility, stage settings, the current costume, monitors and where scripts sit on the canvas.

  Reordering scripts or moving them on the canvas, a newer Fractch spelling of the same block (also inside `${...}` in template strings), a value hidden under a reporter, and rotation centres that differ by less than 0.005 are not reported as edits. Other files are listed in `files` like the plain endpoint with inline text. `totals` counts everything, and `totals.stateOnly` is true when saved state is all that changed. A sprite with a region file over 1 MiB, or whose region files together pass what is left of the 8 MiB response budget, is listed with `tooLarge: true` and no breakdown. Renaming a sprite renames its folder, so it shows as one target removed and another added. `GET /v1/projects/:id/pulls/:index/diff?view=changes` returns the same shape for a pull request in `inspection`.
- `GET /v1/projects/:id/commit-summaries?shas=<sha>,<sha>` returns a short summary for each listed commit, for commit lists. It uses the same access rule as `/commits/:sha/changes`, without the pull request exception. It takes up to 50 lowercase hex SHAs and ignores any that are malformed, repeated, or not recorded by the project. Commits that cannot be summarised (for example when the parent commit is missing) are left out of `summaries`. Each entry in `summaries` (keyed by SHA) has `totals` (the same counts as the changes view, comparing a merge commit with its first parent), `sprites` (the names of up to five sprite folders with script, item or asset changes; saved state alone does not name a sprite, and `fonts/` or root `assets/` files are counted in `totals` but name no sprite), `spriteCount`, `authoredFiles` (changed files that are not sprite code, assets or `fractch.json`), `tooLarge` (true when a sprite was too large to compare), `legacy`, and `initial` (true for a commit with no parent). Summaries are computed the first time they are asked for and kept in one cache file per project under `git-summaries/` in the temp directory, so saving the project does not recompute them. A project with no recorded branch heads returns an empty `summaries` object. Failures are cached for ten minutes. The file holds up to 2,000 entries and starts again from the current request when new entries would push it past that. The cache name carries its own version, which changes whenever the summary format does.
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

### Pull requests and remix sync

A pull request records the remix's head when it is opened, but an open pull request follows the remix: `GET /v1/projects/:id/pulls/:index`, its `diff` and its `merge` use the current head of the remix branch the pull request was opened from (`headBranch`). A pull request opened before branches were recorded follows the remix's only branch, or keeps its recorded head when the remix has several. If the branch no longer exists, they fall back to the recorded head. Merged and closed pull requests keep the head they had. `GET` shows the live head only to callers who can inspect the pull request. Its `baseCommit` stays the recorded fork point, so loading the pull request does no history work, and the diff response carries the live base. The diff compares the remix head with the closest commit it shares with the head of the target branch (`baseBranch`), or with the recorded base once that branch has been deleted, so changes the remix brought in from the target are not shown as part of the pull request. The `pull` object in a diff response carries that `baseCommit` and `headCommit`. The diff's merge base is cached by the two heads, because the commits behind a head never change, and a cached base is used only while both histories still contain it. Preparing a merge always walks the histories.

`POST /v1/projects/:id/pulls/:index/merge` merges against the same shared commit, or against the recorded `baseCommit` when the two histories no longer share one. It refuses with 409 `target_branch_changed` (with `branch`) while the target is on another branch than the pull request's `baseBranch`, 409 `target_branch_missing` once that branch has been deleted or renamed, and 409 `uncommitted_changes` while the target has saved changes that are not committed, unless the pull request is already merged, since closing it touches no project files. Projects without branch metadata skip the branch check. The upload repeats both branch checks and the `uncommitted_changes` refusal. `GET` reports `baseBranchMissing: true` once the target branch is gone, so a client can say so before anyone tries to merge. When the target's head is an ancestor of the remix head, the remix has no uncommitted changes and the remix is on the branch the pull request follows, the server writes a merge commit whose tree is the remix head and answers `{merged: true, fastForward: true}`. When the target already has the remix head, the pull request is marked merged under the project's save lock and the answer is `{merged: true, alreadyMerged: true}`. Otherwise it stores the remix head it merged on the pull request as `preparedSourceHead` and answers `{merged: false, merge, expectedHead, sourceHead}`, where `merge` is the three-way merge with `changes`, `conflicts` and `baseHead`. A merge that cannot be prepared answers 409 `pull_merge_unavailable`. The client applies `merge.changes` to the target tree at `expectedHead` and uploads the result with `pullId`, `expectedHead`, `mergeTree` and `mergeSourceHead` (the `sourceHead` it merged). If the remix has moved since, the upload answers 409 `pull_head_changed`. An upload without `mergeSourceHead` is checked against `preparedSourceHead` (or the recorded head before any merge was prepared), so an older client can merge what the server last prepared and fails with 409 `pull_head_changed` if the remix moved after that. A pull request upload must carry `mergeTree` and no `workspace`, `restoreCommit`, `mergeSourceBranch` or `mergeTargetBranch`, or it answers 400. It answers 409 `head_changed` without `expectedHead` or when the target moved, and 409 `pull_not_open` once the pull request was closed or merged. Merging needs the same edit access as saving the project, so admins and group managers who can edit it can merge too. Once merged, the pull request records the remix head it merged as `headCommit`.

`POST /v1/projects/:id/remix/sync` prepares a merge of the original project's current head into a remix. Only a maintainer of the remix who can see inside both projects may call it. It answers `{merge, sourceProjectId, sourceTitle, sourceHead, targetHead, expectedHead}`. `merge.alreadyMerged` is true when the remix already contains the original's head, and `merge.fastForward` when the remix has no commits of its own since. Text conflicts are marked `this remix` and `original`. A history that still stores the whole project as one `project.sb3` file has a single binary conflict for that file, so the choice is the whole remix or the whole original. The client applies the changes to the remix tree at `targetHead` and uploads them with `syncHead` (the `sourceHead`), `expectedHead` and `mergeTree`. The server then writes a merge commit, `Merge changes from <original title>`, whose parents are the remix head and the original's head. A sync writes that merge commit even when it could fast-forward. A sync refuses with:

- 404 when the project is not a remix, or its original no longer exists.
- 403 for anyone else, or once the original's source is no longer visible to the caller.
- 409 `sync_history_unavailable` when either project has no MistWarp history, 409 `sync_unavailable` when the two histories share no commit or the merge cannot be prepared, and 500 when a history exists but cannot be read.
- 409 `uncommitted_changes` while the remix has saved changes that are not committed, because the merged project would replace them.
- 409 `head_changed` when `expectedHead` is missing or the remix moved, and 409 `original_changed` when the original moved after the sync was prepared.
- 400 when `syncHead` is combined with `pullId`, branch merge fields, `restoreCommit` or `replaceHistory`, or the upload has no `mergeTree`.

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
