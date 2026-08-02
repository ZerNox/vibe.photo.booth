# Change: Add Explicit Consent Flow

Status: Proposed

## Why

The current confirmation step approves the scene but conflates four
distinct consents: capturing a photo, uploading it for AI processing,
accepting an AI-generated result, and saving/sharing it. Given this is a
client-only build with no backend audit trail, explicit UI-level consent
is the only accountability mechanism available.

## What Changes

- Split "confirm" into distinct, sequential consent moments.
- Idle-state camera disclosure shown before any interaction begins.
- No implicit consent from mere approach/participation.

## Impact

- Affected spec: guest journey CONFIRMATION state
- Affected requirements: new FR series under `consent-flow`
