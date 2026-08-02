# VIBE Photo Booth — iPhone Prototype

This is a static Progressive Web App intended for private testing on an iPhone 14 Plus or iPad.

## Included

- Front-camera and microphone permission flow
- Synthetic VIBE voice using the device speech synthesizer
- Guided scene choice
- Contextual / custom / no-change treatment modes
- Spoken confirmation
- Camera countdown and capture
- Local branded result
- Download to the device
- Optional direct-browser image-edit API attempt
- Memory-only API-key handling
- Home Screen PWA manifest and service worker

## Important limitation

The direct OpenAI image request is experimental. A browser may block it because of CORS or API security constraints. The correct production design uses a small serverless gateway. The rest of the booth prototype works without a backend.

## Test locally

Camera access requires HTTPS. The easiest path is GitHub Pages.

## Deploy to GitHub Pages

1. Create a new GitHub repository, for example `vibe-photo-booth`.
2. Upload all files from this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.
6. Wait for the GitHub Pages URL.
7. Open that HTTPS URL in Safari on the iPhone.

## Add to the iPhone Home Screen

1. Open the GitHub Pages URL in Safari.
2. Tap the Share button.
3. Choose **Add to Home Screen**.
4. Launch VIBE from the new Home Screen icon.
5. Grant camera and microphone access.

## Private API-key test

- Paste a dedicated low-budget OpenAI API key on the startup screen.
- The key remains only in page memory.
- Reloading or closing the page clears it.
- Do not use a valuable or shared production key.
- Do not use this mode at a public event.

## Recommended iPhone setup

- Use portrait orientation for the current layout.
- Disable auto-lock during testing.
- Keep the phone connected to power.
- Turn media volume up.
- Use Safari rather than an in-app browser.
