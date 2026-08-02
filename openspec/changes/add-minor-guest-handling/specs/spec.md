# Spec Delta: Minor Guest Handling

## ADDED Requirements

### MINOR-FR-001 — Transformation cap when a minor is present
The system shall not make Full contextual (tier 4) Subject Transformation
reachable for a session the operator has flagged as including a minor.
- Priority: P1
- Verification: manual UX test — operator flag disables tier 4 control
- Acceptance: tier 4 UI control is disabled/hidden when the flag is set

### MINOR-FR-002 — Operator minor-presence flag
The system shall provide an operator-facing control to flag a session as
including a minor, defaulting to unflagged and resettable per session.
- Priority: P1
- Verification: manual UI check
- Acceptance: flag is session-scoped and resets on RESETTING

### MINOR-FR-003 — Adult consent attribution
The pre-session and consent-flow documentation shall state that
accompanying-adult consent is required for capture+processing when a
minor is part of the group.
- Priority: P2
- Verification: documentation review (runbook, consent-flow design.md
  cross-reference)
- Acceptance: rule stated in both the key-lifecycle pre-session checklist
  and consent-flow design.md
