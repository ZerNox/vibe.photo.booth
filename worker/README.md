# Image-edit CORS proxy

A minimal Cloudflare Worker that exists for one reason: OpenAI's
`/v1/images/edits` endpoint sends no CORS headers for browser origins, so
`docs/app.js` calling it directly gets blocked by the browser regardless of
network health (see `docs/README.md`'s "Important limitations" section).
This worker forwards the request to OpenAI server-to-server — where CORS
doesn't apply — and hands the response back with `docs/app.js`'s origin
allowed to read it.

It holds **no secret of its own**. The `Authorization` header the browser
already sends (the same key the operator types into the app's setup screen)
is forwarded through unchanged. This does not change the client-held-key
model documented in `openspec/adr/ADR-001-client-only-architecture.md` — it
only removes the CORS block.

## One-time setup

1. Create a free Cloudflare account at https://dash.cloudflare.com/sign-up
   (no credit card required for the Workers free tier — 100k requests/day).
2. Create an API token: **My Profile → API Tokens → Create Token → Edit
   Cloudflare Workers** template. Copy the token.
3. Find your Account ID: any domain/Workers overview page in the dashboard
   sidebar shows it.
4. In this GitHub repo, go to **Settings → Secrets and variables → Actions**
   and add two repository secrets:
   - `CLOUDFLARE_API_TOKEN` — the token from step 2
   - `CLOUDFLARE_ACCOUNT_ID` — the ID from step 3
5. Push to `main` (or re-run the "Deploy image-proxy worker" workflow from
   the Actions tab) — `.github/workflows/deploy-worker.yml` deploys
   `worker/` automatically from then on, on every push that touches it.
6. After the first deploy, find the worker's URL in the Cloudflare dashboard
   under **Workers & Pages** — it's `https://vibe-photo-booth-image-proxy.
   <your-subdomain>.workers.dev` (the `<your-subdomain>` part is chosen by
   your Cloudflare account and can't be predicted in advance).
7. Open `docs/app.js`, find `IMAGE_EDIT_PROXY_URL` near the top, and replace
   the placeholder with that real URL. Commit and push — GitHub Pages picks
   it up automatically, same as any other `docs/` change.

## If you ever host the app on a different origin

`ALLOWED_ORIGIN` in `wrangler.toml` is hardcoded to
`https://zernox.github.io` (this project's GitHub Pages origin, scheme +
host only, no path). Update it and redeploy if the app moves elsewhere —
requests from any other origin are rejected with a plain 403 before ever
reaching OpenAI.
