# Design: Key Lifecycle

## Rotation Policy

- API key is rotated (revoked + reissued via provider dashboard) after
  every test session or event day, whichever is more frequent.
- Key is never committed to source control, ever — entered manually into
  the running app each session.

## Pre-Session Checklist (manual, operator-run)

1. Confirm previous key has been revoked in provider dashboard
2. Enter fresh key into app for this session only
3. Confirm device is under single-operator physical custody for the
   duration
4. Confirm app is not being deployed to a public/unattended URL

## Post-Session Checklist

1. Revoke the key used this session
2. Clear browser data on device (or rely on reload — see
   add-failure-recovery)
3. Note session outcome in test log (timings/errors only, no content)

## Explicit Boundary Check

This build must refuse (organizationally, not necessarily in code) to
run in any of these modes without first re-opening ADR-001:
- Public unattended kiosk
- Multi-operator / multi-device simultaneous event
- Any deployment where physical custody of the device cannot be
  guaranteed
