# Design: Delivery and Ownership

## Delivery Destination

The iPad never saves the result to its own Photos library or Files app —
the device is shared across guests and must not accumulate guest content.
Two delivery paths, both guest-device-targeted:

1. **QR code (primary)** — guest scans with their own phone, opens the
   delivery artifact directly on their device.
2. **Native share sheet (secondary, on-device fallback)** — Web Share API
   triggered by a guest tap, offering AirDrop / Messages / any installed
   app as the target. Still guest-initiated, still leaves no copy on the
   iPad.

## Delivery Artifact TTL

The delivery artifact (whatever the QR resolves to) is available for
**15 minutes from generation, or until first successful open/download,
whichever comes first**. After expiry, the link is dead — the guest would
need to repeat the session, since no server-side persistence exists in
this phase to support regeneration or extension.

## Ownership and Reuse

The guest owns the generated image. The event operator does not retain a
copy through this app and may not reuse, republish, or redistribute a
guest's generated image — the app itself makes no operator-facing copy
available. Any reuse arrangement (e.g. an event organizer wanting a photo
wall) requires a separate, explicit agreement outside this app's scope
and is not something the product does implicitly.
