# Change: Add Delivery and Ownership Terms

Status: Proposed

## Why

Where the final image goes, how long a QR delivery link stays valid, and
who owns the result are all unanswered (v0.1 review Q21–24). Architecture
already assumes a QR delivery module exists but never specifies its TTL
or destination behavior.

## What Changes

- Make QR-to-guest's-own-device the primary delivery path; the iPad's own
  Photos library is never used as a delivery target.
- Define a concrete TTL for the delivery artifact.
- State image ownership and reuse terms.

## Impact

- Affected spec: DELIVERY guest-journey state, architecture.md Delivery
  Module
- Affected requirements: new FR series under `delivery-and-ownership`
