# Spec Delta: Failure & Recovery

## ADDED Requirements

### FAIL-FR-001 — No state persistence across reload
The system shall not attempt to persist or recover session state across
a Safari reload or suspend event. On return, the system shall boot into
READY.
- Priority: P1
- Verification: manual test — reload mid-session, confirm clean READY
  state
- Acceptance: no stale or partial state visible after reload

### FAIL-FR-002 — Standard camera mode fallback
When network is unavailable at CAPTURE or GENERATION, the system shall
deliver an unmodified photograph labeled as a plain photo.
- Priority: P1
- Verification: manual test with network disabled
- Acceptance: guest receives a clearly labeled non-AI photo, no error
  dead-end

### FAIL-FR-003 — Per-category retry behavior
The system shall apply the retry behavior defined in design.md per
failure category, without exceeding the specified automatic retry counts.
- Priority: P1
- Verification: unit tests per category using mocked provider responses
- Acceptance: retry counts match design.md table for all 7 categories

### FAIL-FR-004 — Mid-session group change handling
The system shall apply the mid-session group-change rules in design.md
(ignore new arrivals until reset; return to DISCOVERY on early
departure; no re-analysis between CAPTURE and GENERATION).
- Priority: P2
- Verification: manual scenario test for each of the 3 cases
- Acceptance: behavior matches design.md for all 3 cases
