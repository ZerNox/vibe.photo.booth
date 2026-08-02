# ADR-001: Client-Only Architecture (No Backend Gateway)

Status: Accepted
Date: 2026-08-02

## Context

The original v0.1 brief proposed a minimal serverless gateway to hold the
permanent OpenAI API key, issue ephemeral Realtime credentials, and
enforce per-event limits. This project's current phase runs entirely
client-side with no backend.

## Decision

Ship the PWA as a fully static client. The OpenAI API key is held in
browser memory. No server component exists in this phase.

## Consequences

**Accepted:**
- Simpler deployment (static hosting only)
- Faster iteration, no backend to build or maintain during prototyping

**Cost (see project.md §3 for full framing):**
- Key is extractable client-side
- No revocation, no per-event rate limiting, no server-side audit trail
- Single-operator custody becomes a load-bearing assumption, not a nicety

## Threshold for Revisiting

Reintroduce a backend gateway (per v0.1's original design) if any of the
following becomes true:
- Deployment moves from single-operator prototype to staffed pilot or
  public/unattended use
- Cost or abuse from key exposure becomes material
- Per-event usage limits or auditing become a hard requirement

This ADR does not need to be "won" against — it's a phase-appropriate
tradeoff with a documented exit condition.
