# Design: Operating Parameters

## Operator Presence

A single operator is physically present and attentive for the entire
duration of every session — this is the same custody assumption
`add-key-lifecycle` already depends on, made explicit here as a product
(not just security) constraint. Failure behaviors in this phase are
allowed to assume an operator can intervene; fully unattended recovery is
out of scope (see ADR-001 threshold conditions).

## Provisional Event-Load Envelope (prototype phase)

- Up to ~10 guests/hour
- Group size: 1–6 people
- Single continuous test/demo block, ≤2 hours
- One iPad, one operator
- No formal queue system — informal line, operator manages manually

These are prototype-phase planning bounds, not hard system limits; revisit
before any staffed-pilot scope change (see ADR-001).

## Trade-Off Priority Ranking (this phase)

1. Guest privacy
2. Memorable conversation
3. High-quality final image
4. Simplicity of implementation
5. Fast throughput
6. Low cost per session
7. Creative freedom
8. Reliable unattended operation — deprioritized deliberately; this phase
   requires operator presence anyway (ADR-001), so unattended reliability
   isn't load-bearing yet.

## Conversation Entry Mode

Hybrid, voice-preferred: every voice-driven step has a visible touch
equivalent at all times, not hidden behind a failure fallback. A guest
who never speaks can complete the full journey by touch alone.

## Listening Mode

Tap-to-speak, not continuous open-mic. Each conversational turn is
explicitly activated by the guest (tap to talk), bounding accidental
activation, cross-talk pickup, and event-noise interference. This is
compatible with the existing 1.5s stable-presence dwell (PRES-FR-003),
which triggers greeting, not listening.

## Barge-In

Supported. A guest tap or new speech onset during VIBE's SPEAKING state
transitions the voice subsystem to INTERRUPTED and stops VIBE's audio
output within 300ms, then proceeds to LISTENING for the guest's new
input.
