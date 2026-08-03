# Architecture

Status: v0.2 — client-only

## 1. Component Diagram

```
iPad / iPhone Browser (Safari, PWA)
├── Presence Module
│   └── local camera frame sampling, on-device only, nothing uploaded
├── Voice Module
│   └── WebRTC connection directly to OpenAI Realtime API
│       (session auth: client-held key — see project.md §3)
├── Capture Module
│   └── single frame capture on confirmation
├── Generation Module
│   └── direct HTTPS request to image-generation endpoint
├── Delivery Module
│   └── QR code pointing to a provider-hosted or short-lived
│       client-generated delivery artifact (no server storage)
└── State Layer
    └── in-memory only; cleared on reload (see add-failure-recovery)
```

No backend service exists in this phase. Every arrow above terminates
either on-device or at the third-party provider directly.

**Implementation status**: the Voice Module is implemented in
`docs/app.js` using the flagship `gpt-realtime-2.1` model (WebRTC,
hands-free — server-side VAD keeps the mic live for the whole session, no
tap-to-talk) — lower latency and GPT-5-class reasoning versus the
earlier plain `gpt-realtime`. The session now stays open for the entire
guest journey —
greeting, scene discovery, capture confirmation, and the post-result
decision (save/retry/finish) — via three tools (`set_scene`,
`confirm_capture`, `result_action`), not just the initial scene
conversation. An API key is required to start a session at all — there is
no demo mode and no text/local fallback if the Realtime connection fails;
the operator sees the raw error and retries instead. Local device
text-to-speech is used only for short cues outside the live session itself
(camera-ready and session-reset chimes), never as a stand-in for the
voice-guided journey. The booth orb is audio-reactive: a Web Audio analyser tapped
onto the live Realtime audio stream (analysis-only, not wired into
playback, so a failure there never silences VIBE) drives the orb's
scale/glow in real time while VIBE is actually speaking. Generated images
are auto-saved to the device on completion (see
`add-delivery-and-ownership` DELIV-FR-004 — this supersedes that change's
original "no on-device retention" stance). Image generation uses
`gpt-image-2` (current flagship as of April 2026; superseded
`gpt-image-1.5`, which itself superseded `gpt-image-1`, retiring
2026-10-23), requested at explicit `quality: "high"`, per the confirmed
product priority that frontier-quality voice and image generation matter
more than minimizing cost (`add-operating-parameters` §Trade-Off Priority
Ranking). Unlike `gpt-image-1.5`, `gpt-image-2` has no `input_fidelity`
parameter — the API rejects it (400) — because the model always processes
image inputs at high fidelity automatically, which satisfies
`add-transformation-contract`'s identity-preservation rubric without the
app needing to request it.
See `docs/README.md` for known integration caveats and cost trade-offs —
none of the OpenAI wire-format details here have been verified against a
live key from this environment.

## 2. Why Client-Only (and what it costs)

Removing the gateway that v0.1 proposed removes:
- Deployment complexity (one static site, e.g. GitHub Pages)
- Operational surface area (nothing to host, patch, or scale)

It costs:
- Key exposure (see project.md §3, Accepted Risk)
- No server-side usage limits, audit trail, or revocation
- No cross-session cost control beyond client logic

This is treated as an explicit, reversible tradeoff. See `adr/ADR-001`.

## 3. State Machines

Four cooperating statecharts, not one flat machine:

**Booth lifecycle**
`BOOT → SETUP → READY → ACTIVE_SESSION → RESETTING → READY`

**Guest journey**
`DETECTED → GREETING → DISCOVERY → CONFIRMATION → CAPTURE → GENERATION → RESULT → DELIVERY`

**Voice subsystem**
`OFF → CONNECTING → LISTENING → THINKING → SPEAKING → INTERRUPTED → RECOVERING`

**Generation subsystem**
`PREPROCESSING → SUBMITTING → PROCESSING → VALIDATING → COMPLETE | RETRYABLE_FAILURE | TERMINAL_FAILURE`

Rationale: voice turn-taking, cancellation, retries, Safari
suspend/reload, and operator controls interact in ways a single flat
machine cannot cleanly express.

## 4. Device-Specific Constraints

See `changes/add-device-constraints/` for the full delta spec. Summary:

- iOS Safari resets camera/mic permissions differently for an installed
  PWA vs. a plain browser tab — must test both explicitly.
- WebRTC autoplay and mic-permission prompts can silently block Realtime
  session start; requires an explicit user-gesture unlock step.
- No background audio/notification support in installed iOS PWAs —
  affects any "idle listening" assumption.

## 5. Data Lifetime

| Layer | Lifetime |
|---|---|
| Browser session state | Cleared on reload (memory-only) |
| Captured photo | Held in memory until generation request completes, then discarded client-side |
| Provider-side processing/retention | Governed by provider policy — not controlled by this app |
| Delivery artifact (QR) | Short-lived, see `add-failure-recovery` / delivery TTL decision |
| Telemetry | Timings + error codes only, if enabled at all |
