---
title: Safety and moderation
---

# Safety and moderation

How mistwarp-api works with Rotur's safety features, handles reports, and keeps error reports anonymous.

## Safety signals

The MistWarp Rotur App declares that people can talk and can spend credits. Before a comment is posted, mistwarp-api asks Rotur's message signal about the owner of the project or profile and the author of the comment it replies to. Comments are public, like replies to Rotur posts, so only a block or a ban (`blocked`, `banned`) stops one. When someone's message settings don't take messages from the author (`settings`, `unavailable`), the comment is still posted but doesn't notify them, and the same goes for replies, mentions and other notifications that carry someone's words. Before a purchase or donation starts, it asks the purchase signal. A "no" is shown to the person in Rotur's own words.

Rotur only answers about people who have used MistWarp through Sign in with Rotur, or made their account on MistWarp. For anyone else, or if Rotur can't be reached, MistWarp carries on as it did before. Rotur counts credits towards a parent's monthly limit when it moves them, so the purchase signal only asks.

## Reports

Every report is also filed in the MistWarp Rotur App's report queue (`POST /v2/apps/<app>/reports`), naming the reporter when Rotur knows them as a MistWarp user. Reports use Rotur's categories. One in a priority category (`csea`, `threat_to_life`, `self_harm`, `terrorism`) goes to Rotur's safety team as soon as it's filed. MistWarp's own queue and actions are unchanged. Dismissing a report closes it on Rotur as dismissed, and any other action closes it as resolved, except reports Rotur is still reviewing.

Who a report is about, and the snapshot sent with it, are worked out by mistwarp-api from the content when the report is made, never taken from the reporter: a project's owner and its title, description, instructions and notes; a comment's author and its text; a profile's owner and bio. Moderation actions on a report (ban, warn) use the same person. A report whose subject can't be found stays MistWarp-only, because Rotur needs someone to name.

A report Rotur couldn't be reached for stays pending and is filed by the five-minute reconcile loop. One closed in MistWarp before Rotur had it is closed on Rotur as soon as it's filed.

## Error reports

The editor and community site send uncaught errors to `POST /v1/errors`, from `EDITOR_ORIGIN` or an origin in `ERROR_REPORT_ORIGINS`. A report holds the error message and stack, the kind of page (its address with IDs, usernames, query and fragment removed), the browser name, major version and operating system, the viewport, the app version and the time. It never holds the username, the project ID, the full user agent or the IP address, and resolving a report does not record who resolved it. Email addresses, URL queries, avatar usernames and usernames, class, student or project IDs in API and file paths are removed from the message and stack too. Admins read them through `GET /v1/admin/errors`.

Reports are kept for 7 days, resolved or not, and only the newest 1,000 are kept at all. Older ones are deleted when a new report comes in, when the server starts and every five minutes. Reports stored before this change are scrubbed the same way by the next sweep.

## Project source access

Projects with See inside disabled expose commits, branches, files, and workspace archives only to their owner. Pull-request inspection follows the same restriction. The project response exposes `canViewSource` for clients.

Deploy the API and client changes together. Purge previously cached project history and workspace responses from the CDN when deploying this policy; new responses use `private, no-store`. This policy controls MistWarp's inspection endpoints. Playback still sends the data required to run a Scratch project to the browser.
