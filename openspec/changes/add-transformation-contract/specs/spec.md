# Spec Delta: Transformation Contract

## ADDED Requirements

### TRANS-FR-001 — Independent transformation axes
The system shall expose Scene, Visual Style, Subject Transformation, and
Cultural Treatment as independently selectable settings, not a single
combined field.
- Priority: P1
- Verification: UI inspection + unit test on generation-prompt builder
- Acceptance: changing one axis does not alter the value of another

### TRANS-FR-002 — Subject transformation tiers
The system shall support four Subject Transformation tiers (None / Props
only / Wardrobe+Props / Full contextual) with Wardrobe+Props as default.
- Priority: P1
- Verification: automated test asserting default tier on session start
- Acceptance: default tier is Wardrobe+Props unless guest changes it

### TRANS-FR-003 — Explicit permission for Full contextual tier
The system shall require a separate, explicit guest confirmation before
enabling Full contextual tier, distinct from scene/pose confirmation.
- Priority: P1
- Verification: manual UX test — confirm two distinct confirmation
  events are logged (non-content telemetry only)
- Acceptance: Full contextual cannot be reached via the default
  confirmation path

### TRANS-FR-004 — Identity-preservation evaluation rubric
Generated images at tiers 1–3 shall be evaluated against the identity-
preservation rubric (design.md) with a minimum average score of 4/5.
- Priority: P2
- Verification: manual rubric scoring during test sessions on both
  target devices
- Acceptance: rubric documented and applied to a test batch of ≥10
  generations before sign-off
