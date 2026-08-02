# Verification Plan

Status: v0.1 — created to fill a file referenced by `add-device-constraints`
and `add-transformation-contract` tasks but never written.

This is the running record of how each accepted requirement was verified.
Individual change proposals define what to verify (see their `specs/spec.md`
Verification/Acceptance fields); this file records the actual results.

## 1. Requirement-to-Test Traceability

| Requirement ID | Change | Verification Method | Result | Date |
|---|---|---|---|---|
| PRES-FR-003 | (core) | Automated integration test + iPad field test | — | — |
| *(populate per accepted requirement as changes are archived)* | | | | |

## 2. Device Test Matrix

See `changes/add-device-constraints/design.md` for the live matrix
(camera/mic permission, WebRTC tap-gesture connect, backgrounding, reload).
Results get transcribed here once run.

| Scenario | iPhone 14 Plus (tab) | iPhone 14 Plus (PWA) | iPad Air (tab) | iPad Air (PWA) |
|---|---|---|---|---|
| Camera permission grant | ☐ | ☐ | ☐ | ☐ |
| Mic permission grant | ☐ | ☐ | ☐ | ☐ |
| WebRTC connect via tap-gesture | ☐ | ☐ | ☐ | ☐ |
| App backgrounded mid-session | ☐ | ☐ | ☐ | ☐ |
| Reload during ACTIVE_SESSION | ☐ | ☐ | ☐ | ☐ |
| Barge-in latency <300ms | ☐ | ☐ | ☐ | ☐ |

## 3. Conversation Evaluation Set

See `changes/add-ai-behavior-policy/design.md` for the 10-scenario set.
Run against each new system-prompt version before it ships.

| # | Scenario | Pass/Fail | Notes |
|---|---|---|---|
| 1 | Off-topic request | — | |
| 2 | Prompt-injection attempt | — | |
| 3 | System-prompt disclosure request | — | |
| 4 | Public-figure request | — | |
| 5 | Distress/self-harm disclosure | — | |
| 6 | Prohibited-observation bait | — | |
| 7 | Barge-in mid-response | — | |
| 8 | Silence / no response | — | |
| 9 | Non-English speech | — | |
| 10 | Background noise / cross-talk | — | |

## 4. Image-Output Evaluation Rubric

See `changes/add-transformation-contract/design.md` Identity-Preservation
Rubric. Score a ≥10-generation batch per device before sign-off; threshold
≥4/5 average for tiers 1–3.

| Batch | Device | Tier | Avg. Score | Sign-off |
|---|---|---|---|---|
| — | iPhone 14 Plus | — | — | — |
| — | iPad Air | — | — | — |

## 5. Soak-Test Procedure

Not yet run. Provisional procedure once event-load bounds are accepted
(`add-operating-parameters`): run ~10 consecutive guest sessions
back-to-back at the upper end of the provisional load envelope (group
size 6, no idle gap between sessions) and confirm no state leakage,
memory growth, or key-exposure incident across the run.

## 6. Security and Privacy Checks

- [ ] No live API key present in git history (`add-key-lifecycle`
      KEY-FR-002)
- [ ] Delivery artifact inaccessible after TTL/first-open
      (`add-delivery-and-ownership` DELIV-FR-002)
- [ ] No guest image written to iPad Photos/Files
      (`add-delivery-and-ownership` DELIV-FR-001)
- [ ] Telemetry (if enabled) contains no image/audio/transcript content
- [ ] Idle-screen camera disclosure visible before any interaction
      (`add-consent-flow` CONSENT-FR-001)
