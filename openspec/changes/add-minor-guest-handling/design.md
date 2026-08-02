# Design: Minor Guest Handling

## No Automated Age Detection

This phase does not attempt to detect a guest's age from the camera feed
— that capability doesn't exist and building it is out of scope. Instead,
the policy relies on the single physically-present operator (per
`add-key-lifecycle` custody assumption) to apply the rules below by
observation, the same way a photographer at a public event would.

## Transformation Cap

Whenever the operator identifies that a minor is part of the group in
frame, Subject Transformation is capped at tier 2 (Wardrobe+Props). Tier
4 (Full contextual — facial hair, hairstyle, apparent age, makeup, skin
texture, eye color) is never offered or reachable for that session,
regardless of guest request.

## Consent Attribution

When minors are present, the explicit capture+processing consent
(`add-consent-flow` CONSENT-FR-002) must be given by an accompanying
adult, not the minor. The consent UI does not need to detect this itself
— it's an operator-enforced process rule, documented on the pre-session
checklist alongside key rotation.

## Prohibited Observations

VIBE's prohibited-observation rules (`add-ai-behavior-policy` AI-FR-001)
apply with no relaxation for minors; age-related commentary is prohibited
for guests of any age, so no separate rule is needed there beyond
explicit scope confirmation.

## Event Signage

Where this booth is used at an event with minors expected, host signage
should note the booth uses AI-generated imagery and that the event
organizer, not this app, is responsible for age-appropriate event
placement. This is a documentation requirement, not an app behavior.
