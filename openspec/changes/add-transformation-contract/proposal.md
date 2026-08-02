# Change: Add Transformation Contract

Status: Proposed

## Why

"Preserve recognizable identity" and "contextual mode" currently overlap
several unrelated concerns (realism, subject changes, cultural treatment)
in one undifferentiated setting. This makes the transformation behavior
impossible to test or bound. Needs to be split into independent axes with
explicit permission levels, especially for anything touching face, age,
or body.

## What Changes

- Introduce four independent axes: Scene, Visual Style, Subject
  Transformation, Cultural Treatment.
- Subject Transformation gets explicit tiers: None / Props only /
  Wardrobe+Props / Full contextual (face/age/body-affecting).
- Face/age/body/identity-affecting changes require explicit guest
  permission separate from general scene confirmation.
- Add a measurable identity-preservation rubric for evaluation.

## Impact

- Affected spec: scene confirmation flow, generation prompt construction
- Affected requirements: new FR series under `transformation-contract`
