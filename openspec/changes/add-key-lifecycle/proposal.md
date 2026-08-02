# Change: Add Key Lifecycle Requirements

Status: Proposed

## Why

The accepted-risk decision (project.md §3, ADR-001) to hold the API key
client-side needs to be a testable, checklist-backed requirement, not
just a paragraph of prose that can be silently ignored during actual
testing/deployment.

## What Changes

- Codify key rotation as a per-session operational requirement.
- Add a manual pre/post-session checklist.
- Add an explicit boundary check: refuse to run in a mode this project
  is not scoped for (public/unattended/multi-operator).

## Impact

- Affected spec: none (operational/process requirement, not app behavior)
- Affected requirements: new FR series under `key-lifecycle`
