# Design: Device-Specific Constraints

## Known iOS Safari Behaviors to Design Around

1. **Autoplay/mic permission**: WebRTC audio session establishment can
   silently stall if not initiated directly inside a user-gesture
   handler (tap). Voice subsystem CONNECTING state must be triggered
   from a direct tap event, not a programmatic call after async work.

2. **Permission persistence**: installed PWA (Add to Home Screen) and a
   plain Safari tab handle camera/mic permission grants differently —
   an installed PWA may re-prompt or reset more or less aggressively
   across iOS versions. Both modes must be tested independently; do not
   assume parity.

3. **No background audio/notifications in installed PWA**: any "idle
   listening" or "resume session after backgrounding" assumption is
   invalid on iOS PWA. Session should be treated as ended if the app is
   backgrounded during an active guest journey.

## Test Matrix

| Scenario | iPhone 14 Plus (tab) | iPhone 14 Plus (PWA) | iPad Air (tab) | iPad Air (PWA) |
|---|---|---|---|---|
| Camera permission grant | ☐ | ☐ | ☐ | ☐ |
| Mic permission grant | ☐ | ☐ | ☐ | ☐ |
| WebRTC connect via tap-gesture | ☐ | ☐ | ☐ | ☐ |
| App backgrounded mid-session | ☐ | ☐ | ☐ | ☐ |
| Reload during ACTIVE_SESSION | ☐ | ☐ | ☐ | ☐ |
