# Design: Delivery and Ownership

## Delivery Destination

**Revised (supersedes the original "no on-device retention" stance
below):** every generated image is now automatically saved to the
operating device the moment generation completes, so the guest leaves
with their image without depending on QR/network reliability. This is a
deliberate product decision, not an oversight — see "Why this changed"
below. QR/share delivery to the guest's own phone remains available as a
secondary option.

Concretely:

1. **Automatic on-device save (primary)** — as soon as `gpt-image-1.5`
   returns the generated image, the app triggers a browser download of
   it. On iOS Safari this lands in Files/Downloads; the web platform does
   not allow a page to silently write into the Photos library without a
   user-mediated interaction, so this is the closest to "automatic" that
   iOS permits without asking the guest to do anything.
2. **Manual "Spara bild" tap (secondary, guest-controlled)** — because
   this has a live user gesture, it can invoke the native share sheet
   (`navigator.share`), which does offer "Save to Photos" as a one-tap
   destination. This is the path to actually get the image into Photos,
   not just Files.
3. **QR code / guest's own phone** — still the recommended path when the
   photo should end up on the guest's *own* device, not the shared iPad.

### Why this changed

The original reasoning (a shared device must not accumulate guest
content) still holds as a privacy concern — it hasn't gone away, it's
just been outweighed for this phase by wanting a guaranteed take-home
result that doesn't depend on the guest scanning a QR code correctly
before walking away. This trades privacy-by-default for delivery
reliability. **Recommended mitigation, not yet implemented as a hard
requirement:** add a step to `add-key-lifecycle`'s post-session/
post-event checklist to clear saved photos from the device between
events. This is worth a deliberate decision (and probably a dedicated
checklist item), not something the app should paper over.

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
