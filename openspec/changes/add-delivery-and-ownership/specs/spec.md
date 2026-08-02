# Spec Delta: Delivery and Ownership

## ADDED Requirements

### DELIV-FR-001 — No on-device retention — SUPERSEDED
~~The system shall not write the generated image to the iPad's Photos
library or Files app as part of the delivery flow.~~ Superseded by
DELIV-FR-004: the product decision changed to prioritize guaranteed
guest delivery over shared-device privacy-by-default. See design.md
"Why this changed." Kept here (struck through, not deleted) so the
reversal is traceable rather than silently dropped.
- Status: Superseded

### DELIV-FR-002 — Delivery artifact TTL
The delivery artifact shall become inaccessible 15 minutes after
generation or immediately after first successful open, whichever occurs
first.
- Priority: P1
- Verification: automated test against the delivery endpoint/artifact
  lifecycle; manual timing check
- Acceptance: artifact confirmed inaccessible after either trigger

### DELIV-FR-003 — Guest-targeted delivery only — SUPERSEDED
~~Delivery shall occur only via QR-to-guest-device or the native share
sheet, both guest-initiated.~~ Superseded by DELIV-FR-004: automatic
on-device save is now the primary path. QR/share remain available as
secondary, guest-targeted options.
- Status: Superseded

### DELIV-FR-004 — Automatic on-device save
The system shall automatically save the generated image to the operating
device the moment generation completes, without requiring a guest tap.
- Priority: P1
- Verification: manual check — confirm a downloaded file appears after
  generation with no further guest interaction
- Acceptance: file present after generation completes, for every
  successful generation

### DELIV-FR-005 — Guest-controlled share to Photos
The "Spara bild" control shall, on tap, attempt the native share sheet
(so the guest can choose Save to Photos / AirDrop) before falling back to
a plain download.
- Priority: P2
- Verification: manual test on iPhone Safari — tap "Spara bild", confirm
  share sheet appears; disable share support and confirm fallback
  download still works
- Acceptance: share sheet appears when supported; download always
  succeeds as fallback

### DELIV-FR-006 — Device clearing between events (recommended, not yet a hard requirement)
Operators should clear saved photos from the device's Files/Photos
between events, given DELIV-FR-004 now leaves guest images on a shared
device. Tracked here pending a decision on whether to formalize this into
`add-key-lifecycle`'s session checklist.
- Priority: P3
- Status: Proposed, not yet accepted as a hard requirement
