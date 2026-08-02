# Change: Add Failure & Recovery Behavior

Status: Proposed

## Why

Session state is memory-only by design (client-only architecture). A
Safari reload or suspend currently means total loss with no defined
recovery path, and there's no agreed behavior for network loss,
generation errors, or mid-session group changes.

## What Changes

- Define "standard camera mode" fallback when network is unavailable.
- Define retry semantics per failure category (transient, rate-limit,
  provider error, safety rejection, invalid output, identity failure).
- Define acceptable-loss boundary on reload (accept full loss; do not
  attempt persistence, matching the client-only accepted-risk stance).

## Impact

- Affected spec: generation subsystem, booth lifecycle RESETTING state
- Affected requirements: new FR series under `failure-recovery`
