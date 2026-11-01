---
title: Accounts and sign-in
---

# Accounts and sign-in

MistWarp accounts are Rotur accounts. This page covers how a Rotur sign-in becomes a MistWarp session, and how plans and bans carry over from Rotur.

## Sign-in flow

1. Client holds a Rotur token from Sign in with Rotur, with the `validators:generate` scope.
2. Client calls `POST https://api.rotur.dev/v2/validators` with `{"key": "<ROTUR_CLIENT_ID>"}` and the token in the `Authorization` header, never the URL. MistWarp's own token can always make validators for its app, without `validators:generate`. Older editors send `ROTUR_APP_KEY` instead. It must be the same Rotur instance the server validates against.
3. Client calls `POST /v1/auth?v=<validator>`; the API validates it against `https://api.rotur.dev/validate`, with the app ID first and then the old key, and returns a 7 day session token (also set as the auth_token cookie). Bearer header and cookie are both accepted. For the app ID, Rotur also refuses anyone the app has banned, or who otherwise can't use MistWarp, with a message for them.

Only MistWarp's own sign-in token can make app-ID validators (rotur/api#85), so the desktop app, which still uses the old sign-in, and older tokens send the old key. Rotur doesn't check the old key against MistWarp's Rotur App, so for those sign-ins Rotur's suspension, adults-only, parental approval and age settings aren't enforced, and a rotur.dev ban only applies once the five-minute ban sync has brought it in. Old-key validators made by another Rotur App's sign-in are refused. The gap closes once the desktop app uses Sign in with Rotur through a loopback redirect, which needs Rotur to accept any port on `http://127.0.0.1`.

Rotur answers every validator request with HTTP 200, valid or not, and every "no" comes back as `valid: false` with a `code`. Only `valid: true` signs anyone in. An `invalid_validator` code moves on to the next key, so a validator made for the old key still works. Any other code is a refusal, answered with 403 and its `code`, `error` and `redirectUrl`, and for an app ban its `reason` and `until`. A validator no key accepts answers 401, and so does a non-2xx answer from Rotur.

## Plans

Perks follow the person's Rotur plan. mistwarp-api asks the apps API (`GET /v2/apps/<client id>/users/<id>/plan`), which answers whatever their privacy settings. Rotur's public profile hides the plan from anyone who can't see the balance, which covers every account without a date of birth, so it's only read for people the apps API doesn't know. Answers are kept for 5 minutes, and during an outage the last known plan stays.

### Vanity project URLs

A vanity project URL (`/p/<slug>`, resolved by `GET /v1/vanity/:slug`) needs a plan that includes one, which today is Rotur Pro. Once the owner's plan stops including it, the URL stops working but stays reserved for them for 30 days, so resubscribing brings it straight back. After that it's released for anyone to claim. The owner still sees it as `vanityReserved` with `vanityLapsed: true`, so they can keep it or clear it.

The 30 days only start when Rotur says the plan no longer includes it. While Rotur can't be reached nothing changes: a working URL keeps working, the clock doesn't start, and a lapsed URL isn't released. A loop checks every 15 minutes, so URLs are released on time even if nobody visits them.

## Bans

A MistWarp ban is also a ban from the MistWarp Rotur App (`PUT /v2/apps/<app>/bans/<user>`), so Rotur enforces it too: the person's MistWarp tokens stop working and Rotur won't let them sign in to MistWarp. Rotur shows them the ban's reason, and never who made it. Lifting a ban lifts both.

Every five minutes MistWarp reads the app's bans. Bans made or lifted on rotur.dev/me/developer reach MistWarp's own list, and any ban or unban Rotur couldn't be told about yet is sent again. A ban lifted in MistWarp is never brought back from Rotur while that's pending. Rotur won't ban the app's owner or managers, classroom students, or accounts it doesn't know, so those bans stay MistWarp-only. Bans whose reason only names a report are sent with a general reason instead.

## Erasing an account

Someone deleting their data from Settings, a Rotur erasure request, and Rotur saying the account was deleted, left MistWarp or was banned (see [Rotur webhooks](/backend/payments#rotur-webhooks)) all erase everything MistWarp holds about the person. That includes their projects and trash, backpack, game data, sessions and community records, and frees everything they counted against their Rotur storage.

When a teacher is erased, each class they owned passes to its first remaining co-teacher, who gets a notification and an audit record of the transfer. A class with no co-teacher is deleted with its students. The teacher leaves every class they co-taught, and their school. When that leaves the school without an admin, its first remaining teacher becomes school admin.
