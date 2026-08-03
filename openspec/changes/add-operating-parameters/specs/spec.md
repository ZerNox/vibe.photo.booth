# Spec Delta: Operating Parameters

## ADDED Requirements

### OPS-FR-001 — Touch parity for every voice step
Every guest-journey step reachable by voice shall have an equivalent,
always-visible touch control, not gated behind a voice-failure fallback.
- Priority: P1
- Verification: manual UX walkthrough completing a full session by touch
  only, no voice input
- Acceptance: full DETECTED→DELIVERY journey completable without speaking

### OPS-FR-002 — Continuous hands-free listening
**Revised 2026-08-03** (superseded the original tap-to-speak draft below
before it was ever accepted — requiring a screen tap every turn defeated
the point of a voice-driven booth). The voice subsystem shall enter
LISTENING automatically for the whole session via server-side voice
activity detection; no per-turn guest tap is required to talk. A manual
mute control shall remain available for a guest who wants to pause the
mic.
- Priority: P1
- Verification: code review of voice subsystem state entry; manual test
  completing a full session speaking freely, without tapping any
  talk/listen control
- Acceptance: LISTENING is reachable purely from guest speech onset;
  a mute control exists and is reachable by touch

~~The voice subsystem shall require an explicit per-turn guest activation
(tap) before entering LISTENING; it shall not listen continuously.~~
(original draft, superseded above)

### OPS-FR-003 — Barge-in support
A guest tap or speech onset during SPEAKING shall transition the voice
subsystem to INTERRUPTED and stop VIBE's audio output within 300ms.
- Priority: P1
- Verification: automated timing test + manual field test
- Acceptance: audio stops within 300ms of interrupt trigger in ≥95% of
  test trials

### OPS-FR-004 — Operator-presence assumption documented
The system's failure-recovery and safety design shall assume a single
attentive operator is present for every session; this assumption shall be
stated in project.md and re-evaluated before any staffed-pilot or
unattended deployment.
- Priority: P2
- Verification: documentation review
- Acceptance: assumption stated in project.md §8 and cross-referenced
  from ADR-001
