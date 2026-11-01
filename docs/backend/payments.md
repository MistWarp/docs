---
title: Payments and webhooks
---

# Payments and webhooks

Every payment is a Rotur payment request that the person approves on rotur.dev. Rotur tells mistwarp-api about payments, account changes and privacy requests through a signed webhook.

## Payments

Buying a game product, donating with a comment and refunding a game product are Rotur payment requests (`POST /v2/apps/<app>/payment-requests`). mistwarp-api never holds a permission to spend anyone's credits.

1. The editor asks for an intent. mistwarp-api asks Rotur for the payment, with a purchase key (`mwbuy_`, `mwgame_`, `mwdonate_` or `mwrefund_`) as its `reference`, and answers with the key and Rotur's `approveUrl`.
2. The person approves it on rotur.dev with their password. Rotur moves the credits, shared between everyone the sale pays: the creator, collaborators, the remixed project's creator and MistWarp's fee.
3. Rotur's `payment.completed` webhook marks the key paid and delivers game products. The editor's confirm call does the same if it gets there first, asking Rotur whether the request was paid. Whichever comes second finds it done.

Donations are delivered when their comment is posted, and refunds when the product is revoked. Paid keys waiting for that are kept for 30 days, and unpaid ones for an hour (Rotur's requests expire after 15 minutes).

### Project sales have ended

Projects can no longer be sold. `POST /v1/projects/:id/purchase/intent` and `/purchase/confirm` answer 410 with the code `project_sales_ended`, and a `PUT /v1/projects/:id` that sets a price above 0 answers 400 with the same code. A project that had a price plays, and can be remixed and seen inside, the same as a free one with the same settings. Remixes of paid projects are no longer kept private. The webhook still records a `mwbuy_` payment that was started before sales ended, so it can be refunded.

What was sold stays readable: buyers keep their records in `GET /v1/me/purchases`, and creators keep the buyers, revenue and sales history in their project analytics and `GET /v1/me/stats`.

`scripts/refund_project_sales.py` pays every buyer back the full price of every project they bought, from one Rotur account, with one transfer per buyer (`POST /v2/me/transfers`). It sends nothing without `--apply`. Each transfer is written to `data/project-sale-refunds.json` before it is sent and marked when Rotur answers, so running it again never pays a purchase twice. It stops if a project purchase can still be paid on Rotur, if the token doesn't belong to `--payer`, if the payer doesn't have enough credits, or if an earlier transfer's outcome is unknown (check the payer's Rotur transactions, then `--resolve <id>=sent` or `=failed`).

```sh
python3 scripts/refund_project_sales.py
ROTUR_REFUND_TOKEN=<token of the paying account> python3 scripts/refund_project_sales.py --apply --payer <that account>
```

Tests: `python3 -m unittest scripts/test_refund_project_sales.py`, and with a compiled binary `MWAPI_BIN=<path> python3 -m unittest scripts/test_project_sales_api.py`.

## Rotur webhooks

Set the MistWarp Rotur App's webhook to `https://api.mistwarp.org/v1/rotur/webhook` on rotur.dev/me/developer, with privacy requests on, and put its signing secret in `ROTUR_WEBHOOK_SECRET`.

- `user.deleted`, `user.left` and `user.banned` erase everything MistWarp holds about that person, the same as deleting their data from Settings (see [Erasing an account](/backend/accounts#erasing-an-account)). Rotur requires that within 30 days, and MistWarp does it straight away.
- A `privacy.request` for `erasure` does the same. One for `access` sends them a MistWarp notification pointing to the download in Settings.
- `payment.completed` finishes the purchase it names (see Payments).

Each delivery carries `Rotur-Webhook-Id`, `Rotur-Webhook-Timestamp` (Unix seconds) and `Rotur-Signature`. The signature is `v1=` and the hex HMAC-SHA256 of `<id>.<timestamp>.<raw body>`, keyed with the whole signing secret, `whsec_` prefix included. A delivery with a bad signature, or a timestamp more than five minutes out, answers 401, and one whose body `id` doesn't match the header answers 400.

Rotur waits 10 seconds for an answer, and erasing someone can take longer. So each delivery is saved to `data/rotur-webhooks.json`, answered, then handled by a worker, one event at a time. Handled events are kept for at least 7 days, longer than Rotur's 36 minutes of retries, so a retried delivery is only handled once. Anything not yet handled when the server stops is handled when it starts.

Rotur only sends these for people who have used MistWarp through Sign in with Rotur, or whose account was made on MistWarp. The five-minute check of `/accounts/deleted_check` stays for everyone else.
