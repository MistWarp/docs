---
title: Community features
---

# Community features

Badges, milestone notifications, organisations and the development feed.

## Badges

MistWarp gives badges on people's Rotur profiles as the MistWarp Rotur App. Which badges exist, and what earns them, is data. Define the badges on rotur.dev/me/developer, then map MistWarp's events to them in `data/rotur-badges.json`:

```json
{"events": {
  "project_shared": [{"badge": "creator", "delta": 1}],
  "love_received": [{"badge": "loved", "delta": 1}],
  "remixed": [{"badge": "remixed", "delta": 1}],
  "comment_posted": [{"badge": "commenter", "delta": 1}],
  "streak": [{"badge": "streak", "progress": "value"}]
}}
```

| Event | When |
| --- | --- |
| `project_shared` | Someone shares a project for the first time |
| `love_received` | Someone else loves their project, counted once per person per project |
| `remixed` | Someone else shares a remix of their project |
| `comment_posted` | They post a comment anywhere |
| `streak` | They save a project on a new day. The value is how many days in a row they have done so |

`delta` adds to their progress. `"progress": "value"` sets it to the event's value. A rule with neither is skipped. Updates are sent in the background, and Rotur only gives badges to people who have used MistWarp through Sign in with Rotur. Without the file, nothing is sent. The file is read on every event, so changing it needs no restart.

## Milestone notifications

MistWarp sends one-time notifications at 5, 25, 50, 100, 500, and 1,000 likes or followers. Likes are counted separately for each project, comment, roadmap post, space, news post, profile post, and theme. The `like_milestones` collection stores progress independently of the inbox, so clearing notifications, unliking, and re-liking do not reset it.

Project and community reactions check milestones when saved. Profile-post, theme, and follower checks read existing public APIs and keep their state in MistWarp. The client requests a check after a like or follow; opening the inbox also checks the current account's followers. These sampled counts can detect a threshold crossed between visits, but cannot detect a count that rose and fell entirely between checks. Existing counts establish a baseline without sending every earlier milestone. No Rotur or WarpTheme server changes are required.

## Organisations

A Rotur organisation is a Rotur account with `account_type: "org"`. It can own MistWarp projects and spaces directly: the record's `owner` is the organisation's username, `ownerId` its Rotur id, and `ownerType` is `"org"`. Projects and spaces made by a person have an empty `ownerType`.

Members of the organisation whose Rotur permissions include `apps` or `admin` are its publishers. A publisher can create projects and spaces for the organisation (send `org: "<name>"` when creating), move their own content into it (an ownership transfer to the organisation's name), and manage, transfer or delete anything it owns, as if they were the owner. Billing-only and plain members cannot. Site admins always can. A publisher only manages content whose `ownerId` matches the organisation's current Rotur id, so a new organisation that later takes a freed name gets none of the old one's content.

MistWarp asks Rotur who is in an organisation with `COMMERCE_SERVICE_KEY`, through `GET /v2/integrations/mistwarp/orgs/:name` (the organisation and every member with their permissions, including members who are not listed publicly) and `GET /v2/integrations/mistwarp/users/:id/orgs` (a person's organisations). On Rotur's side that key is the `mistwarp` entry of its `COMMERCE_SERVICE_KEYS`. Rotur leaves out members who cannot sign in (banned, suspended or age-restricted), so they stop publishing for the organisation. Answers are cached for a minute. When Rotur cannot be reached, anything that needs an organisation's members answers 503 `rotur_unavailable` instead of refusing. That includes a move to an account whose Rotur profile says it is an organisation but whose members cannot be read.

Creating for an organisation can be refused with `code`: `org_not_found` (400, the name is not an organisation), `org_forbidden` (403, the person does not publish for it) or `rotur_unavailable` (503).

| Route | What it returns |
| --- | --- |
| `GET /v1/orgs/:name` | `{org, members, projects, spaces, isMember, canManage}`. `members` lists only publicly listed members unless the viewer is a member or a site admin. Drafts and private spaces are included only for publishers |
| `GET /v1/me/orgs` | `{orgs: [{username, displayName, perms, canPublish}]}` for the signed-in person |

Notifications about content an organisation owns (loves, comments, remixes, reviews, contributions, sales, challenge entries and moderation) go to each of its publishers, up to 25 of them. The same event about the same content is sent once every ten minutes, so toggling a love does not repeat it. When a publisher enters an organisation's project in a challenge, the publisher, not the organisation, is recorded as the participant. On a challenge an organisation owns, its publishers are judges as well as anyone invited. `judges` lists the publicly listed ones, and `judgeCount` counts all of them.

The Rotur groups integration (`/v1/groups/:tag` and the `groupTag` field) was removed. Organisations replace it.

## Development feed

`/v1/development/pulls` lists MistWarp's own open and recently merged pull requests, and `/v1/roadmap` resolves the ones linked to each entry.

GitHub's search quota is 10 requests a minute for an unauthenticated caller and is counted per IP, so the feed is built to stay well inside it:

- One search covers the whole org, so a refresh costs two requests rather than
  one per repository.
- A successful refresh happens at most once every five minutes. A failed one is
  retried on the next tick, if the recorded quota allows. The snapshot is stored, so
  a restart reuses it and costs nothing, and a crash loop cannot burn the budget.
- The loop ticks every minute, more often than the refresh window, so a tick
  landing a moment early cannot push the next refresh out by a whole interval.
  A tick that finds the snapshot fresh costs nothing.
- A refresh where both searches fail keeps the last good snapshot rather than
  overwriting it with nothing. If only one fails, the snapshot is replaced with
  what the other found.
- Every response's `X-RateLimit-*` headers are recorded, and a refresh is
  refused when the remaining quota would not cover it, keeping a small reserve
  for anything else on the same address.
- A 403 or 429 backs off until the window reopens, honouring `Retry-After`.

Search responses carry no `ETag` and are sent `no-cache`, so a conditional request cannot earn a free 304; not spending the request is the only lever.

`GITHUB_TOKEN` raises the ceiling but is not required.
