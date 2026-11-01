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

## Storage limits

Each plan has a total storage limit: 500 MB on Free, 2 GB on Lite, 10 GB on Plus and 50 GB on Pro. A user's usage is the sum of every project they own, trashed projects included. Each project counts its assets, its compressed project JSON and its history archive, even when an asset is shared with other projects. Saving is checked against the owner's limit before anything is stored. A save may make a project bigger only while it fits in the free space, so a user over the limit can still save a project at its current size or smaller. Assets uploaded ahead of a save count as pending until a saved project references them, or for 7 days. Deleting a project frees its space once it is removed from the trash. Backpack items count toward the same limit, and deleting one frees its space straight away. `GET /v1/me/quota` returns `used`, `pending`, `limit`, `remaining`, `backpack` (the bytes held in the backpack) and the five largest projects. On first start after this change, the server measures the history size of existing projects from local copies and the R2 inventory.

## Backpack

The editor backpack syncs to the signed-in account. Items are scripts, sprites, costumes and sounds, stored as a body file plus an optional PNG or JPEG thumbnail under `backpack/<random id>/` in R2 (or `data/blobs/` locally), with the per-user list in `data/backpack/`. Blob URLs are unguessable and served sandboxed with `nosniff`; only the owner can list items.

| Route | Purpose |
| --- | --- |
| `GET /v1/me/backpack?type=&offset=&limit=` | Newest first, up to 100 per page, with `total`, `count` and `bytes` |
| `POST /v1/me/backpack` | Multipart `type`, `mime`, `name`, `body`, and optional `thumbnail` with `thumbnailMime`; checked against the storage limit |
| `PATCH /v1/me/backpack/:id` | Rename with `{name}` |
| `DELETE /v1/me/backpack/:id` | Delete one item |
| `POST /v1/me/backpack/delete` | Delete several with `{ids}`; returns `deleted` and `freedBytes` |

A body may be up to 20 MB and a backpack holds up to 2000 items. Account deletion, deleted Rotur accounts and data export all include the backpack.
