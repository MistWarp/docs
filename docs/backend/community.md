---
title: Community Features
sidebar_position: 7
---

# Community Features

Badges, milestone notifications and the development feed.

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

## Development feed

`/v1/development/pulls` lists MistWarp's own open and recently merged pull requests, and `/v1/roadmap` resolves the ones linked to each entry.

GitHub's search quota is 10 requests a minute for an unauthenticated caller and is counted per IP, so the feed is built to stay well inside it:

- One search covers the whole org, so a refresh costs two requests rather than
  one per repository.
- A refresh happens at most once every five minutes. The snapshot is stored, so
  a restart reuses it and costs nothing - a crash loop cannot burn the budget.
- Every response's `X-RateLimit-*` headers are recorded, and a refresh is
  refused when the remaining quota would not cover it, keeping a small reserve
  for anything else on the same address.
- A 403 or 429 backs off until the window reopens, honouring `Retry-After`.

Search responses carry no `ETag` and are sent `no-cache`, so a conditional request cannot earn a free 304; not spending the request is the only lever.

`GITHUB_TOKEN` raises the ceiling but is not required.
