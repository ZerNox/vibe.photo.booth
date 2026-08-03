# Change: Add Operating Parameters

Status: Proposed

## Why

Several product-level decisions remain undecided and block UX/throughput
design: the operator-presence assumption, expected event load, trade-off
priority ranking, conversation-entry mode, listening mode, and whether
barge-in is supported (v0.1 review Q2, Q3, Q5, Q11–13).

## What Changes

- State the operator-presence assumption explicitly (not just implied by
  key-lifecycle).
- Set provisional event-load bounds for this prototype phase.
- Rank trade-off priorities.
- Decide conversation-entry mode: hybrid, voice-preferred, touch always
  available.
- Decide listening mode: continuous open-mic via server-side VAD, not
  tap-to-speak (revised 2026-08-03 — see OPS-FR-002).
- Make barge-in an explicit, testable requirement (currently only implied
  by the voice statechart's INTERRUPTED state).

## Impact

- Affected spec: project.md §8 (Provisional Product Decisions), voice
  subsystem statechart
- Affected requirements: new FR series under `operating-parameters`
