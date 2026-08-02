# Design: Transformation Contract

## Axes (independent, each separately selectable)

**Scene** — e.g. Paris café, jungle, moon surface (unbounded, discovery-driven)

**Visual Style** — Photorealistic | Cinematic | Illustrated | Vintage
postcard | Absurd

**Subject Transformation** (tiered, each tier a superset of the previous)
1. None — no intentional changes to face, expression, gaze direction,
   hands, body, pose, hair (including hair edges), clothing (including
   clothing edges), or any occluded area (nothing is synthesized into
   regions the source photo doesn't show). Lighting/color-matching,
   compositing, and edge correction against the new background remain
   permitted — those are scene-integration operations, not subject
   changes.
2. Props only — added objects/accessories, no wardrobe change
3. Wardrobe + Props — clothing changed, face/body untouched (**default**)
4. Full contextual — permits facial hair, hairstyle, apparent age,
   makeup, skin texture, eye color changes. **Requires explicit
   permission**, separate toggle from scene confirmation.

**Cultural Treatment** — Minimal | Authentic | Playful

## Identity-Preservation Rubric (for evaluation, see verification-plan)

Score per generated image, 1–5:
- Facial geometry match to source
- Recognizability by a third-party rater blind to the source
- Absence of unintended age/gender/expression drift

Threshold: tier 1–3 must score ≥4/5 average. Tier 4 is evaluated
separately and does not need to meet the same bar (guest has opted in).

## Failure Behavior

If identity preservation fails at the guest's selected tier:
- Offer to retry at a lower transformation tier
- Never silently escalate to a higher tier than requested
