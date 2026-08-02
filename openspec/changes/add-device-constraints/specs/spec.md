# Spec Delta: Device Constraints

## ADDED Requirements

### DEV-FR-001 — User-gesture-initiated WebRTC connection
The system shall initiate the Realtime WebRTC connection directly within
a user-gesture event handler (e.g. onClick/onTouchEnd), not after
intervening async operations.
- Priority: P1
- Verification: manual test on both devices, tab and PWA mode
- Acceptance: voice connects reliably in all 4 device/mode combinations

### DEV-FR-002 — Independent tab/PWA permission testing
The system's camera/mic permission flow shall be verified independently
for installed-PWA and browser-tab modes on both target devices.
- Priority: P1
- Verification: test matrix in design.md, all cells checked
- Acceptance: no permission-related failure in either mode

### DEV-FR-003 — Backgrounding treated as session end
The system shall treat app backgrounding during ACTIVE_SESSION as
equivalent to session end, not as a pausable state.
- Priority: P2
- Verification: manual test — background app mid-session, confirm state
  reset on return
- Acceptance: no stale/frozen session state after backgrounding
