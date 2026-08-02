# Spec Delta: Key Lifecycle

## ADDED Requirements

### KEY-FR-001 — Per-session key rotation
The API key shall be rotated after every test session or event day.
- Priority: P1
- Verification: manual checklist sign-off (design.md Pre/Post-Session
  Checklist)
- Acceptance: rotation checklist completed and logged for every session

### KEY-FR-002 — No key in source control
The API key shall never be committed to source control at any point.
- Priority: P1 (hard constraint)
- Verification: repo history scan / pre-commit hook check
- Acceptance: zero occurrences of a live key in git history

### KEY-FR-003 — Deployment boundary check
The system shall not be deployed to a public, unattended, or
multi-operator context without first revisiting ADR-001.
- Priority: P1
- Verification: manual review before any deployment beyond
  single-operator testing
- Acceptance: deployment checklist explicitly references ADR-001 status
