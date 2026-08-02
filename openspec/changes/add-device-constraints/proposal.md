# Change: Add Device-Specific Constraints

Status: Proposed

## Why

Primary test device is iPhone 14 Plus, secondary is iPad Air, both
Safari. iOS Safari has known quirks around WebRTC autoplay, mic/camera
permission persistence, and PWA background behavior that will silently
break assumptions carried over from the original spec.

## What Changes

- Document explicit per-device test requirements.
- Add a user-gesture unlock step before Realtime WebRTC connection.
- Separate test matrix entries for installed-PWA vs. browser-tab mode.

## Impact

- Affected spec: voice subsystem CONNECTING state, verification plan
- Affected requirements: new FR series under `device-constraints`
