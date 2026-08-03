# VIBE Photo Booth — Source of Truth Spec

Status: v0.2 (superseding v0.1 monolithic brief)
Last updated: 2026-08-03

## 1. Overview

VIBE is a browser-based AI photo booth. Guests interact with a
voice-and-touch conversational agent ("VIBE") on an iPad/iPhone, select or
discover a scene, pose, and receive an AI-transformed photo.

This phase is a **developer / internal prototype** — not a staffed public
pilot, not a commercial deployment. Scope and risk tolerance below reflect
that.

## 2. Architecture

- Client-side only. React + Vite PWA. **No backend server.**
- OpenAI Realtime API session established directly from the browser via
  WebRTC.
- Image-generation requests submitted directly from the client to the
  provider API.
- Session state (conversation, captured photo, scene selection) lives in
  browser memory only. Nothing persists across a reload.
- Local camera/presence detection runs entirely on-device; no video leaves
  the device except the single captured frame submitted for generation.

See `architecture.md` for component breakdown and `adr/` for individual
technical decisions.

## 3. Accepted Risk — Client-Held Credential

The OpenAI API key is held in browser JavaScript memory for the duration
of a session.

This means the key is:
- Extractable via browser devtools, installed extensions, or network
  instrumentation
- Not subject to per-event rate limiting
- Not revocable mid-event
- Not audited server-side

**This is a deliberate, stated MVP boundary — not an oversight.**

Mitigations at this phase:
- Single-operator custody of the device at all times
- Key rotated after every test/event session
- Not deployed for public, unattended, or multi-operator use

This tradeoff should be revisited only if the project moves toward a
staffed-pilot or commercial operating model (see `adr/ADR-001-*` for the
threshold conditions). Reintroducing a backend gateway at that point is
the documented escape hatch, not a redesign.

### 3.1 Risk Acceptance Log

Dated instances where an operator has formally accepted the client-held
credential risk above for a specific deployment profile.

| Date | Operator | Profile | Cap | Notes |
|------|----------|---------|-----|-------|
| 2026-08-03 | joakim.weivert@gmail.com | Single iPad, isolated (not on a shared/public network), run and operated locally by the key owner | $5 hard spend cap set on the OpenAI project's Limits page | Accepted as within the existing mitigation profile (single-operator custody, non-public use) — no new mitigations required; see `docs/access-token-guide.md` §3 for cap setup |

## 4. Non-Goals (this phase)

- No backend/gateway
- No per-event usage/cost caps beyond client-side guardrails
- No credential revocation or rotation automation
- No multi-iPad / multi-operator event support
- No commercial or unattended deployment

## 5. Target Devices

- Primary test device: iPhone 14 Plus, Safari
- Secondary test device: iPad Air, Safari
- Both: installed PWA and plain browser-tab behavior must be tested
  separately (permission persistence differs between the two on iOS).

## 6. Requirements

Format: ID, statement, rationale, priority, verification, status.
Individual requirement sets are proposed and merged via `changes/`
delta specs, then recorded here once accepted.

| ID | Statement | Priority | Verification | Status |
|----|-----------|----------|---------------|--------|
| PRES-FR-003 | Stable-presence activation: 2s dwell in activation area transitions PRESENCE_CANDIDATE → GUEST_GREETING | P1 | Automated integration test + iPad field test | Accepted |
| *(pending)* | See open changes in `changes/` | — | — | Proposed |

## 7. Open Changes

- `add-transformation-contract`
- `add-consent-flow`
- `add-device-constraints`
- `add-failure-recovery`
- `add-key-lifecycle`
- `add-ai-behavior-policy`
- `add-minor-guest-handling`
- `add-delivery-and-ownership`
- `add-operating-parameters`

See `verification-plan.md` for how acceptance of these changes will be
demonstrated once implemented.

## 8. Provisional Product Decisions

(Carried from v0.1 review; still governing until explicitly revised.)

1. Voice preferred, fully usable by touch.
2. Target interaction ≤ 90 seconds before generation begins.
3. Guests give explicit confirmation covering both capture and AI
   processing (see `add-consent-flow`).
4. Default subject transformation is wardrobe-and-props only; face/age/
   body/identity changes require explicit permission (see
   `add-transformation-contract`).
5. "No changes" mode forbids intentional modification of face,
   expression, body, pose, hair, or clothing.
6. Operational telemetry (if any) contains timings and error codes only —
   never images, audio, or transcript content.
7. State machine implemented as four cooperating statecharts: booth
   lifecycle, guest journey, voice subsystem, generation subsystem (see
   `architecture.md` §3).
8. A single operator is physically present and attentive for the entire
   duration of every session; failure/recovery design may assume operator
   intervention is possible (see `add-operating-parameters`, ADR-001).
9. Conversation entry is hybrid, voice-preferred: every voice-driven step
   has an always-visible touch equivalent. **Revised 2026-08-03:**
   listening is continuous open-mic (server-side VAD), not tap-to-speak —
   the original tap-per-turn design defeated the point of a voice-driven
   booth by requiring a screen touch every turn. A manual mute toggle
   remains for a guest who wants to step away from the mic. Barge-in is
   supported (see `add-operating-parameters`).
