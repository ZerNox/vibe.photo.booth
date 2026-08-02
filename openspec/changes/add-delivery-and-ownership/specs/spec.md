# Spec Delta: Delivery and Ownership

## ADDED Requirements

### DELIV-FR-001 — No on-device retention
The system shall not write the generated image to the iPad's Photos
library or Files app as part of the delivery flow.
- Priority: P1
- Verification: manual check — inspect device Photos/Files after a full
  session
- Acceptance: no guest image artifact present on the iPad after DELIVERY

### DELIV-FR-002 — Delivery artifact TTL
The delivery artifact shall become inaccessible 15 minutes after
generation or immediately after first successful open, whichever occurs
first.
- Priority: P1
- Verification: automated test against the delivery endpoint/artifact
  lifecycle; manual timing check
- Acceptance: artifact confirmed inaccessible after either trigger

### DELIV-FR-003 — Guest-targeted delivery only
Delivery shall occur only via QR-to-guest-device or the native share
sheet, both guest-initiated.
- Priority: P2
- Verification: UI/code review of DELIVERY state
- Acceptance: no delivery path exists that doesn't target a guest-chosen
  destination
