# Design: Failure & Recovery

## Reload/Suspend Behavior

Decision: **full loss is acceptable** on Safari reload or suspend, given
the memory-only accepted-risk stance in project.md §3. No attempt is
made to persist session state across reload. On return, the app boots
fresh into READY.

## Network-Unavailable Fallback ("standard camera mode")

When network is unavailable at CAPTURE or GENERATION:
- Take and deliver an unmodified photograph (no AI transformation)
- Clearly label the result as a plain photo, not an AI-generated image
- No queueing for later generation (would require persistence this
  phase explicitly avoids)

## Retry Categories

| Failure | Behavior |
|---|---|
| Transient network error | Automatic retry, up to 2 attempts, silent to guest |
| Rate-limit | Automatic retry with backoff, up to 1 attempt; then fall back to standard camera mode |
| Provider error (5xx) | One automatic retry; then fall back to standard camera mode |
| Safety rejection | No retry with same input; prompt guest to adjust scene/pose |
| Invalid output (malformed/corrupt) | One automatic retry |
| Identity-preservation failure | Offer guest-initiated retry at lower transformation tier (see transformation-contract) |
| Guest-requested variation | Manual, guest-controlled, uses same source photo |

## Multi-Group / Mid-Session Changes

- Second group entering activation area during ACTIVE_SESSION: ignored
  until current session reaches RESETTING
- Person leaving after CONFIRMATION but before CAPTURE: treat as scene
  change, return to DISCOVERY
- Group size changing between CAPTURE and GENERATION: not detected
  automatically in this phase (no re-analysis); proceed with captured
  frame as-is
