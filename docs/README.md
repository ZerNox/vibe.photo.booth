# VIBE Photo Booth — iPhone Prototype

This is a static Progressive Web App intended for private testing on an iPhone 14 Plus or iPad.

## Included

- Front-camera and microphone permission flow
- Live VIBE voice conversation via OpenAI's Realtime API (WebRTC,
  `gpt-realtime-2.1` — lower latency and GPT-5-class reasoning vs the
  earlier `gpt-realtime`) — real AI speech and listening for the *entire*
  guest journey. An API key is required to start the app at all; there is
  no demo mode and no text-only fallback — voice is the only supported
  flow
- A floating, audio-reactive orb (Web Audio analyser on the live voice
  stream) that visibly moves/glows in sync with VIBE's actual speech
  volume, not a generic looping animation
- Hands-free listening — the mic stays live for the whole session
  (server-side voice activity detection decides when a guest's turn
  starts/ends), no tap required to talk. A mute button lets a guest pause
  the mic if they want to step away from it.
- Voice drives the whole flow via three tools VIBE calls itself:
  `set_scene` (scene + treatment), `confirm_capture` (ready to shoot or
  change the scene), `result_action` (save / try again / finish) — a
  guest can complete an entire session without touching the screen
- Every voice step still has a full touch equivalent (scene screen,
  review buttons, save/retry/finish buttons) — voice is additive, not a
  replacement for the touch UI
- VIBE's live voice is instructed to speak in a Gothenburg (göteborgska)
  dialect — best-effort, since OpenAI's realtime voices don't expose a
  dialect parameter; it's an instruction the model follows, not a
  guaranteed authentic accent.
- If the Realtime connection fails, the app shows the real error (alert +
  under Operatör) and lets the operator retry — it does not drop into any
  other flow
- Contextual / custom / no-change treatment modes
- Ten-second camera countdown that bursts four candidate shots near the
  start (while the on-screen number reads 10, 9, 8, 7), then lets AI pick
  the best one (`BEST_SHOT_MODEL`, a vision-capable chat model judging
  open eyes / expression / motion blur / framing) before continuing —
  falls back to a local sharpness heuristic (Laplacian variance) only if
  that one API call itself fails, not as a separate app mode
- Automatic on-device save the moment a generated image is ready (see
  "Where images end up" below for what "automatic" can and can't mean on
  iOS)
- Direct-browser image-edit API call (`gpt-image-2`, high quality; the
  model always processes inputs at high fidelity, so there's no separate
  `input_fidelity` setting to make)
- Memory-only API-key handling
- Home Screen PWA manifest and service worker
- Party touches to make capture feel like an event, not a form: a rising
  countdown beep and camera-flash + shutter sound on every burst shot, a
  few hype captions during the countdown ("Le som att du precis vann på
  Bingolotto!"), rotating light-hearted captions while the AI transform is
  cooking, and a confetti burst + fanfare chime the moment the AI photo is
  ready. All synthesized locally (Web Audio + CSS), so they work offline
  and never compete with VIBE's live voice for bandwidth. VIBE's own
  system prompt also now explicitly invites it to drop in a short joke or
  playful aside during the conversation.

## Important limitations

- The direct OpenAI image-edit request is experimental. Unlike the
  Realtime voice endpoint below (which OpenAI built for direct browser
  calls), `/v1/images/edits` is a plain server-side REST endpoint and
  most likely never sends CORS headers, so a browser is expected to
  block the response even when the request itself reaches OpenAI fine.
  The rest of the booth prototype works without it. If generation fails,
  check **Operatör → Senaste bildgenereringsfel**: the app runs a
  `no-cors` `GET` probe against a separate, lightweight endpoint
  (`/v1/models`, not the upload URL itself — a bodyless probe POST
  straight to the upload endpoint risked tripping its own WAF/body
  validation and misreporting a CORS block as "no network") to tell a
  real network failure apart from a CORS policy block (browsers
  otherwise report both identically to script) and shows which one it
  confirmed, plus the raw browser error.
  A request that fails before reaching OpenAI's server at all (dropped
  wifi/mobile data, or the domain itself unreachable) is retried
  silently up to twice before this error is ever shown to the guest — a
  CORS block, a timeout, or an HTTP error response from OpenAI is never
  retried this way.
- The Realtime voice integration talks directly to `api.openai.com` from
  the browser using the key entered on the setup screen (same
  client-held-key model as the image request — see
  `openspec/adr/ADR-001-client-only-architecture.md`). It was written
  against OpenAI's documented WebRTC flow but has not been verified
  against a live key from this environment; if session setup fails, the
  app now shows the raw OpenAI/network error in an alert and under
  **Operatör → Senaste röstanslutningsfel** (no need to dig through the
  browser console on-device) — it's usually a one-line fix (e.g. a
  renamed voice or session field, or an invalid/under-scoped key).
- The correct production design for either of the above uses a small
  serverless gateway, per ADR-001's stated revisit conditions.

## Where images end up

The generated image is saved automatically the moment generation
finishes — no guest tap required. What "automatic" means in practice on
iOS Safari, because the platform doesn't allow anything stronger:

- **Automatic save** downloads the file (lands in Files/Downloads).
  iOS does not let a web page silently write into the Photos library
  without the guest actively choosing that in a share sheet — there's no
  way around that from a website, automatic or not.
- Tapping **"Spara bild"** afterward opens the native share sheet (a live
  guest gesture, so `navigator.share` is allowed to run), where **Save to
  Photos** is one tap away. That's the real path into Photos.
- A QR-code-to-guest's-own-phone option was designed earlier
  (`openspec/changes/add-delivery-and-ownership`) and is still the better
  fit if the goal is getting the photo onto the *guest's* device rather
  than the shared iPad. This build prioritizes guaranteed on-device
  delivery instead — see that change's design.md for the explicit
  trade-off and a recommended (not yet enforced) operator step to clear
  saved photos between events, since images now persist on a device
  shared across every guest at the event.

## Cost per session and per event

Two components, both metered by OpenAI, both pay-as-you-go against the
key entered on the setup screen — not a ChatGPT-subscription flat rate.

**Voice — `gpt-realtime-2.1` (flagship):** $32 / 1M audio-input tokens,
$64 / 1M audio-output tokens (600 input tokens/min, 1200 output
tokens/min) — these per-token rates were already the ones used in this
estimate before the model-name bump, so the cost figures below are
unchanged by the 2.1 upgrade; only latency and reasoning quality improve.
Works out to roughly **$0.06–$0.11 per minute** of active conversation
with prompt caching, more without it. Because voice now drives the whole
journey (greeting → scene → capture confirmation → save/retry/finish),
not just the scene-discovery step, a full guest conversation runs closer
to **1.5–3 minutes** of actual back-and-forth than the ~30–60 seconds
estimated when this used to be scoped to scene discovery only on the
mini model. That's roughly **$0.10–$0.30 per guest** for voice alone.

**Images — `gpt-image-2`** (current flagship, released April 2026 —
supersedes `gpt-image-1.5`): at 1024×1024, roughly **$0.006 low /
$0.053 medium / $0.211 high** per image. This build requests `quality:
"high"` explicitly (`IMAGE_QUALITY` in `app.js`) — frontier tier, not the
API default and not the cheaper mid-tier this project briefly used.
**Confirmed product priority: frontier-quality voice and image
generation, cost secondary.** Identity preservation — the thing
`add-transformation-contract`'s ≥4/5 identity-preservation rubric holds to
a hard bar — no longer needs an explicit `input_fidelity` setting on this
model: `gpt-image-2` always processes image inputs at high fidelity and
rejects the parameter if it's sent (confirmed live; `gpt-image-1.5`
required setting it explicitly). One generation happens automatically per
capture, plus whatever "prova igen" (retry) requests the guest makes via
`result_action`.

**Best-shot picker — `gpt-5.1` (`BEST_SHOT_MODEL`):** one chat-completions
call per capture with four low-detail JPEG frames attached, so this is a
few thousand input tokens and a handful of output tokens — a small
addition on top of the two costs above (not independently priced here;
sanity-check against platform.openai.com/pricing along with the other
figures). Falls back to the free local sharpness heuristic only if this
one API call itself fails.

**Combined, per booth session (one photo, regardless of group size):**
roughly **$0.35–$0.55** at high quality / high fidelity with a typical
conversation length; more with retries.

Note this cost is **per session, not per person** — a group of 2–3 posing
together for one photo costs the same as a single guest, since voice
conversation length and image-generation pricing don't scale with how
many people are in frame.

### Worked estimate: 80 attendees, 2–3 people per photo

This is the actual target to plan against, and it's **not 80 sessions**
— since cost is driven by booth sessions, not headcount, 80 attendees at
2–3 per photo works out to **27–40 sessions** (80 ÷ 3 ≈ 27, 80 ÷ 2 = 40):

| Group mix | Sessions | Total @ $0.35–$0.55/session |
|---|---|---|
| Mostly 3-person groups | ~27 | **~$9–$15** |
| Mixed 2s and 3s | ~32 | **~$11–$18** |
| Mostly 2-person groups | ~40 | **~$14–$22** |

**Call it $9–$22 for the full event** across a realistic group-size mix,
with ~$11–$18 the realistic middle. Add ~15–20% headroom for guests who
use "prova igen" (retry) — a practical planning ceiling of **~$27 total**
for an 80-person event at current settings (`gpt-realtime-2.1` flagship
voice, `gpt-image-2` high quality / high input fidelity). This is a cost
estimate, not an enforced cap — see the open question in
`add-operating-parameters` about whether a per-event budget ceiling
should become an actual hard requirement (mentioned but not yet built)
rather than just a planning number. Given frontier quality is now the
confirmed priority, that ceiling should be read as a sanity check against
a misbehaving/looping session, not a lever to trade quality away —
if cost needs to come down, that's a decision to revisit deliberately,
not something to quietly walk back by dropping `IMAGE_QUALITY` again.
Pricing figures here couldn't be verified against OpenAI's live pricing
page from this environment (network-blocked) and are drawn from third-party
pricing trackers — sanity-check against platform.openai.com/pricing
before committing a real budget.

## Test locally

Camera access requires HTTPS. The easiest path is GitHub Pages.

## Deploy to GitHub Pages

1. Create a new GitHub repository, for example `vibe-photo-booth`.
2. Upload all files from this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.
6. Wait for the GitHub Pages URL.
7. Open that HTTPS URL in Safari on the iPhone.

## Checking which version is deployed

Every push to `main` triggers `.github/workflows/stamp-deploy-version.yml`,
which stamps `docs/version.json` with the deploy datetime (UTC) and commit
SHA. The app shows it as "Version: …" on the setup screen and in the
operator dialog — useful for confirming a Home Screen PWA has picked up
the latest build rather than a stale service-worker cache.

## Add to the iPhone Home Screen

1. Open the GitHub Pages URL in Safari.
2. Tap the Share button.
3. Choose **Add to Home Screen**.
4. Launch VIBE from the new Home Screen icon.
5. Grant camera and microphone access.

## OpenAI API key (required)

See [`access-token-guide.md`](access-token-guide.md) for how to create a
dedicated OpenAI API key for this app, including which API access it
needs and how to budget/rotate it.

- A key is required to start the app — there is no demo/no-key mode.
- Paste a dedicated low-budget OpenAI API key on the startup screen.
- The key remains only in page memory.
- Reloading or closing the page clears it.
- Do not use a valuable or shared production key.
- Given the client-held-key model (see ADR-001), this build is for
  private/operator testing only — not for a public event.

## Recommended iPhone setup

- Use portrait orientation for the current layout.
- Disable auto-lock during testing.
- Keep the phone connected to power.
- Turn media volume up.
- Use Safari rather than an in-app browser.
