# Change: Add Minor Guest Handling

Status: Proposed

## Why

Whether children use the booth is unaddressed, but it touches consent
design, transformation defaults, and prohibited-observation scope
simultaneously (v0.1 review Q8). The system has no reliable automated
age-detection capability, and this phase has no backend to build one
against, so this must be an operator/consent-process answer, not a
detection feature.

## What Changes

- Assume minors may be present at any session (no age gate at the door).
- Cap Subject Transformation tier at Wardrobe+Props whenever a minor is
  visually part of the group — Full contextual (age/face-affecting)
  changes are never applied to a group containing a minor.
- Require the accompanying adult, not the minor, to give the capture and
  processing consent (`add-consent-flow`) when minors are present.
- Extend prohibited-observation scope (`add-ai-behavior-policy`) to
  explicitly cover minors.

## Impact

- Affected spec: CONFIRMATION consent step, Subject Transformation tier
  selection, ai-behavior prohibited observations
- Affected requirements: new FR series under `minor-guest-handling`
- Depends on: `add-consent-flow`, `add-transformation-contract`,
  `add-ai-behavior-policy`
