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
`docs/app.js` (`gpt-realtime-mini`, WebRTC, push-to-talk), scoped to the
greeting + scene-discovery conversation. Capture/review/result status
lines remain on local device text-to-speech rather than staying connected
to Realtime for the whole session, to bound per-guest cost. See
`docs/README.md` for known integration caveats.

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
