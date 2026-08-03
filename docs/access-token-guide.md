# Getting an OpenAI API Key for VIBE

VIBE requires an **OpenAI API key**, pasted directly into the setup screen
(see [`README.md`](README.md#openai-api-key-required)) — there is no
demo/no-key mode. This guide walks through creating a key that's safe to
use with this prototype.

There's no separate "access token" step to configure yourself: the key you
paste is used to call OpenAI's REST APIs directly, and for voice, the app
exchanges it for a short-lived ephemeral token internally (`mintEphemeralToken`
in `app.js`) before opening the WebRTC session — that exchange is automatic
and not something you need to set up.

## 1. Create the key

1. Sign in at [platform.openai.com](https://platform.openai.com) (a
   separate account/login from ChatGPT's consumer plans — API usage is
   billed independently, pay-as-you-go).
2. If you don't already have one, create a **dedicated project** for this
   booth (top-left project switcher → *Create project*) rather than using
   your default/personal project. This keeps usage, budget, and the key
   itself isolated from anything else you run on the account.
3. Go to **API keys** → **Create new secret key**, scoped to that project.
4. Give it a name you can recognize later, e.g. `vibe-booth-2026-08-03` —
   include the date so it's obvious when to rotate it out (see §3).
5. Copy the key now — OpenAI only shows it once.

## 2. Confirm the key can reach what this app calls

The app calls two OpenAI endpoints directly with this key:

- `POST /v1/realtime/client_secrets` — mints the ephemeral token used for
  the voice conversation (`gpt-realtime-2.1`)
- `POST /v1/images/edits` — the AI photo transformation (`gpt-image-2`)

Both need to be available on the project/account the key belongs to. If
either model isn't enabled, requests fail at that step — the app surfaces
the raw OpenAI error in the browser console (see the "Important
limitations" note in `README.md`), so check there first if setup fails.

## 3. Set a budget limit and rotate the key

This key is held in browser memory for the whole session (see
`openspec/project.md` §3 and `openspec/adr/ADR-001-client-only-architecture.md`
for why, and the accepted tradeoffs) — treat it as disposable, not as your
main account key:

- In the project's **Limits** settings, set a spend cap. Use the per-event
  estimate in `README.md` ("Cost per session and per event") to size it —
  e.g. ~$30 covers the ~$27 planning ceiling worked out there for an
  80-person event, with a little headroom.
- Create a fresh key per test session or event, and **revoke the old one**
  in the OpenAI dashboard right after (API keys → the key's `···` menu →
  Revoke). Don't reuse one key across multiple events.
- Never use your production or shared account key here.

## 4. Use it in the app

1. Open the deployed prototype and paste the key into **OpenAI API-nyckel**
   on the setup screen.
2. It stays in page memory only — reloading or closing the tab clears it
   (`state.apiKey`, never written to storage or sent anywhere but OpenAI).
3. Don't use this mode at a public event — it's for private/operator
   testing only, per the existing warning in `README.md`.

## Related reading

- `README.md` — cost estimates, limitations, deploy steps
- `openspec/project.md` §3 — the accepted-risk framing for holding the key
  client-side
- `openspec/adr/ADR-001-client-only-architecture.md` — why there's no
  backend gateway yet, and the conditions for revisiting that
- `openspec/changes/add-key-lifecycle/proposal.md` — proposed (not yet
  accepted) operational checklist for key rotation and custody
