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
- Optional direct-browser image-edit API attempt (`gpt-image-2`, high
  quality + high input fidelity)
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

**Images — `gpt-image-2`** (current flagship, released April 2026 —
supersedes `gpt-image-1.5`): at 1024×1024, roughly **$0.006 low /
$0.053 medium / $0.211 high** per image. This build requests `quality:
"high"` and `input_fidelity: "high"` explicitly (`IMAGE_QUALITY` /
`IMAGE_INPUT_FIDELITY` in `app.js`) — both settings at their frontier
tier, not the API default and not the cheaper mid-tier this project
briefly used. **Confirmed product priority: frontier-quality voice and
image generation, cost secondary.** `input_fidelity` is the one that's
also a named spec requirement regardless of that priority — it controls
how much of the source photo's actual face/detail survives the edit,
which `add-transformation-contract`'s ≥4/5 identity-preservation rubric
holds to a hard bar (confirmed for `gpt-image-1.5`, presumed to carry
over to `gpt-image-2` but not independently verified). One generation
happens automatically per capture, plus whatever "prova igen" (retry)
requests the guest makes via `result_action`.

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
for an 80-person event at current settings (`gpt-realtime` flagship
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
