# vibe.photo.booth

VIBE is a browser-based, voice-and-touch AI photo booth. Guests talk to
VIBE, pick or discover a scene, pose, and get an AI-transformed photo.

## Live prototype

**https://zernox.github.io/vibe.photo.booth/**

Served via GitHub Pages from [`docs/`](docs/) on `main`. Open it in
Safari on an iPhone or iPad and use **Share → Add to Home Screen** for
the full-screen PWA experience. See [`docs/README.md`](docs/README.md)
for device setup, permissions, and the private API-key test mode.

This is a client-only prototype: no backend, memory-only API key, no key
ever committed to this repo. See `openspec/adr/ADR-001-client-only-architecture.md`
for why, and its stated conditions for revisiting that.

## Specs

Project documentation follows the [OpenSpec](openspec/) convention:

- [`openspec/project.md`](openspec/project.md) — source of truth: scope,
  architecture summary, accepted requirements, provisional decisions
- [`openspec/architecture.md`](openspec/architecture.md) — component
  breakdown and state machines
- [`openspec/adr/`](openspec/adr/) — architecture decision records
- [`openspec/changes/`](openspec/changes/) — proposed spec deltas not yet
  merged into `project.md`
- [`openspec/verification-plan.md`](openspec/verification-plan.md) — how
  acceptance is demonstrated (device matrix, conversation eval set, image
  rubric, security/privacy checks)
