# VIBE Photo Booth — iPhone Prototype

This is a static Progressive Web App intended for private testing on an iPhone 14 Plus or iPad.

## Included

- Front-camera and microphone permission flow
- Live VIBE voice conversation via OpenAI's Realtime API (WebRTC,
  flagship `gpt-realtime` model) when an API key is entered — real AI
  speech and listening for the *entire* guest journey, not just device
  text-to-speech and not just the scene-discovery step
- A floating, audio-reactive orb (Web Audio analyser on the live voice
  stream) that visibly moves/glows in sync with VIBE's actual speech
  volume, not a generic looping animation
- Push-to-talk (tap to start/stop) rather than continuous listening
- Voice drives the whole flow via three tools VIBE calls itself:
  `set_scene` (scene + treatment), `confirm_capture` (ready to shoot or
  change the scene), `result_action` (save / try again / finish) — a
  guest can complete an entire session without touching the screen
- Every voice step still has a full touch equivalent (scene screen,
  review buttons, save/retry/finish buttons) — voice is additive, not a
  replacement for the touch UI
- Fallback scripted greeting + device speech synthesizer when no API key
  is entered (interface-demo mode) or if the Realtime connection fails
- Contextual / custom / no-change treatment modes
- Camera countdown and capture
- Automatic on-device save the moment a generated image is ready (see
  "Where images end up" below for what "automatic" can and can't mean on
  iOS)
- Optional direct-browser image-edit API attempt (`gpt-image-1.5`)
- Memory-only API-key handling
- Home Screen PWA manifest and service worker

## Important limitations

- The direct OpenAI image-edit request is experimental. A browser may
  block it because of CORS or API security constraints. The rest of the
  booth prototype works without it.
- The Realtime voice integration talks directly to `api.openai.com` from
  the browser using the key entered on the setup screen (same
  client-held-key model as the image request — see
  `openspec/adr/ADR-001-client-only-architecture.md`). It was written
  against OpenAI's documented WebRTC flow but has not been verified
  against a live key from this environment; if session setup fails,
  check the browser console for the raw error from OpenAI first — it's
  usually a one-line fix (e.g. a renamed voice or session field).
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

**Voice — `gpt-realtime` (flagship):** $32 / 1M audio-input tokens, $64 /
1M audio-output tokens (600 input tokens/min, 1200 output tokens/min).
Works out to roughly **$0.06–$0.11 per minute** of active conversation
with prompt caching, more without it. Because voice now drives the whole
journey (greeting → scene → capture confirmation → save/retry/finish),
not just the scene-discovery step, a full guest conversation runs closer
to **1.5–3 minutes** of actual back-and-forth than the ~30–60 seconds
estimated when this used to be scoped to scene discovery only on the
mini model. That's roughly **$0.10–$0.30 per guest** for voice alone.

**Images — `gpt-image-1.5`:** at medium quality, 1024×1024, **$0.034 per
image** (low: $0.009, high: $0.133). This build requests one generation
per capture automatically, plus whatever "prova igen" (retry) requests
the guest makes via `result_action`.

**Combined, per guest:** roughly **$0.15–$0.35** for one photo with a
typical conversation length; more if the guest retries the image a few
times.

**Per event** (using the provisional envelope in
`openspec/changes/add-operating-parameters/design.md` — ~10 guests/hour,
up to 2 hours, ~20 guests): roughly **$3–$7 for voice** plus **$0.70–$1
for images**, so **call it $4–$8 for a full test event** at default
settings. Still cheap in absolute terms, but meaningfully more than the
`gpt-realtime-mini` + scene-discovery-only estimate from before this
change (~$1–2/event) — worth knowing given the model and scope choice
made here. Switching back to `gpt-realtime-mini` (change `REALTIME_MODEL`
in `app.js`) would cut the voice portion roughly 3x if cost becomes a
concern; pricing figures here couldn't be verified against OpenAI's live
pricing page from this environment (network-blocked) and are drawn from
third-party pricing trackers — sanity-check against
platform.openai.com/pricing before committing a real budget.

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

## Add to the iPhone Home Screen

1. Open the GitHub Pages URL in Safari.
2. Tap the Share button.
3. Choose **Add to Home Screen**.
4. Launch VIBE from the new Home Screen icon.
5. Grant camera and microphone access.

## Private API-key test

- Paste a dedicated low-budget OpenAI API key on the startup screen.
- The key remains only in page memory.
- Reloading or closing the page clears it.
- Do not use a valuable or shared production key.
- Do not use this mode at a public event.

## Recommended iPhone setup

- Use portrait orientation for the current layout.
- Disable auto-lock during testing.
- Keep the phone connected to power.
- Turn media volume up.
- Use Safari rather than an in-app browser.
