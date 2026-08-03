# Design: Operating Parameters

## Operator Presence

A single operator is physically present and attentive for the entire
duration of every session — this is the same custody assumption
`add-key-lifecycle` already depends on, made explicit here as a product
(not just security) constraint. Failure behaviors in this phase are
allowed to assume an operator can intervene; fully unattended recovery is
out of scope (see ADR-001 threshold conditions).

## Provisional Event-Load Envelope (prototype phase)

- **~80 total attendees, 2–3 people per photo** (confirmed target for
  cost planning) — works out to roughly **27–40 booth sessions**
  (80 ÷ 3 to 80 ÷ 2), not 80 sessions. Voice-session length and
  image-generation cost are per *session* (per booth visit), not per
  individual person in frame, so group size changes session count but
  not per-session cost — see `docs/README.md` "Cost per session and per
  event" for the worked estimate against this figure.
- Event duration / guests-per-hour: not yet specified — still open
- One iPad, one operator
- No formal queue system — informal line, operator manages manually

These are prototype-phase planning bounds, not hard system limits; revisit
before any staffed-pilot scope change (see ADR-001).

## Trade-Off Priority Ranking (this phase)

1. Guest privacy
2. Frontier-quality voice and image generation — **confirmed decision**:
   both `gpt-realtime-2.1` (voice) and `gpt-image-2` at high quality /
   high input fidelity (image) are the deliberate choice over their
   cheaper siblings (`gpt-realtime-2.1-mini`, lower `IMAGE_QUALITY`
   tiers). This is
   treated as the key success factor for the experience, not an
   afterthought — see `docs/README.md` "Cost per session and per event"
   for what that costs in practice (~$9–22 for the 80-attendee target
   event) and the explicit note that cost is a sanity check here, not a
   lever to quietly trade quality away.
3. Memorable conversation
4. Simplicity of implementation
5. Fast throughput
6. Low cost per session — deliberately below quality in this ranking; see
   above.
7. Creative freedom
8. Reliable unattended operation — deprioritized deliberately; this phase
   requires operator presence anyway (ADR-001), so unattended reliability
   isn't load-bearing yet.

## Conversation Entry Mode

Hybrid, voice-preferred: every voice-driven step has a visible touch
equivalent at all times, not hidden behind a failure fallback. A guest
who never speaks can complete the full journey by touch alone.

## Listening Mode

**Revised 2026-08-03:** continuous open-mic via server-side VAD, not
tap-to-speak. The original tap-to-speak draft traded away the actual goal
— a voice-driven booth a guest never has to touch — for noise/cross-talk
robustness; live feedback confirmed that trade-off wasn't acceptable, since
requiring a tap every turn is indistinguishable in practice from a
touch-driven booth with a voice feature bolted on. Noise/cross-talk risk
is now managed by tuning the VAD threshold and turn-silence duration for a
party environment (see `REALTIME_TURN_DETECTION` in `docs/app.js`) instead
of by gating every turn behind a tap; `semantic_vad` is the documented
fallback if false triggers or premature cutoffs show up in the field. A
manual mute control remains for a guest who wants to step away from the
mic. This is compatible with the existing 1.5s stable-presence dwell
(PRES-FR-003), which triggers greeting, not listening.

## Barge-In

Supported. A guest tap or new speech onset during VIBE's SPEAKING state
transitions the voice subsystem to INTERRUPTED and stops VIBE's audio
output within 300ms, then proceeds to LISTENING for the guest's new
input.
