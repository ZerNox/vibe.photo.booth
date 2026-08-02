# Design: Consent Flow

## Idle-State Disclosure

Idle screen always shows:
> "Camera active for local presence detection. Idle video is not stored
> or uploaded."

Shown before any guest interaction; not dismissible by approach alone.

## Consent Sequence (guest journey)

1. **Capture consent** — explicit touch or spoken "yes" before the photo
   is taken (not before this point)
2. **Processing consent** — bundled with capture consent screen: "This
   photo will be sent to an AI service to generate your image." Single
   combined prompt, not separate friction.
3. **Result acceptance** — implicit in guest choosing to proceed to
   RESULT/DELIVERY (no separate step; viewing the result and choosing
   Retry vs Deliver is the acceptance signal)
4. **Save/share consent** — explicit at DELIVERY: QR display or download
   action is itself the consent (no passive auto-save)

## What Does NOT Imply Consent

- Standing in the activation area (only triggers greeting, not capture)
- Speaking to VIBE during discovery (only triggers scene search)
- Silence or inactivity (never treated as agreement)
