// CORS-only relay for OpenAI's /v1/images/edits.
//
// OpenAI's REST endpoints (unlike the Realtime endpoints app.js also
// calls, which OpenAI built for direct browser use) send no CORS headers
// for browser origins, so a browser blocks reading the response no
// matter how healthy the connection is. This worker holds no secret of
// its own — it forwards the Authorization header the browser already
// sends (the same key entered on the app's setup screen) straight
// through to OpenAI, server-to-server, where CORS doesn't apply, and
// hands the response back with this app's origin allowed to read it.

const OPENAI_IMAGE_EDIT_URL = "https://api.openai.com/v1/images/edits";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (!isAllowedOrigin(origin, env)) {
      return new Response("Forbidden origin", { status: 403 });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders(origin) });
    }

    const authorization = request.headers.get("Authorization");
    if (!authorization) {
      return jsonResponse({ error: { message: "Missing Authorization header" } }, 401, origin);
    }

    const upstream = await fetch(OPENAI_IMAGE_EDIT_URL, {
      method: "POST",
      headers: {
        "Authorization": authorization,
        "Content-Type": request.headers.get("Content-Type") || ""
      },
      body: request.body,
      duplex: "half"
    });

    const headers = corsHeaders(origin);
    headers.set("Content-Type", upstream.headers.get("Content-Type") || "application/json");
    return new Response(upstream.body, { status: upstream.status, headers });
  }
};

function isAllowedOrigin(origin, env) {
  const allowed = (env.ALLOWED_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
  return allowed.includes(origin);
}

function corsHeaders(origin) {
  return new Headers({
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  });
}

function jsonResponse(body, status, origin) {
  const headers = corsHeaders(origin);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(body), { status, headers });
}
