# Spec Delta: Consent Flow

## ADDED Requirements

### CONSENT-FR-001 — Idle disclosure
The system shall display a camera-disclosure message on the idle screen
at all times prior to guest interaction.
- Priority: P1
- Verification: manual UI check
- Acceptance: message visible before PRESENCE_CANDIDATE is reached

### CONSENT-FR-002 — Explicit capture+processing consent
The system shall require an explicit touch or spoken confirmation
covering both photo capture and AI processing before transitioning to
CAPTURE.
- Priority: P1
- Verification: automated state-transition test; manual field test
- Acceptance: CAPTURE is unreachable without this confirmation event

### CONSENT-FR-003 — No implicit consent from presence or speech
The system shall NOT treat mere presence in the activation area or
conversational speech during DISCOVERY as consent to capture or
processing.
- Priority: P1
- Verification: code review of state-transition guards
- Acceptance: guard logic requires the explicit confirmation flag, not
  inferred from any other state
