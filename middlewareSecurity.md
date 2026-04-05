# Middleware: Security

Demonstrates security middleware patterns as Pipedown pipe steps:
secure response headers, CSRF origin validation, rate limiting,
and request ID generation. All use Web platform APIs — no external
libraries required.

```json
{
  "inputs": [
    { "_name": "basic" }
  ]
}
```

## Request ID

Generate a unique identifier for each request. Useful for log
correlation, debugging, and distributed tracing. Should be one of
the first steps so downstream steps and logs can reference it.

Ref: https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID

```ts
// ── Generate a unique request ID ──
// crypto.randomUUID() produces a v4 UUID — guaranteed unique across
// all requests without coordination (no database or counter needed).
// Ref: https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
const requestId = crypto.randomUUID();

// ── Attach to input for downstream step logging ──
input.requestId = requestId;

// ── Add to response headers ──
// X-Request-Id is a de facto standard for request correlation.
// Clients and load balancers can use it to trace requests through
// multiple services.
input.responseOptions.headers["x-request-id"] = requestId;
```

## CSRF Origin Check

Validate the `Origin` header on state-changing requests (POST, PUT,
DELETE, PATCH) to prevent Cross-Site Request Forgery attacks.
Combined with `SameSite=Lax` cookies, this covers most CSRF vectors.

Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSRF
Ref: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

- method: POST
- method: PUT
- method: DELETE
- method: PATCH

```ts
// ── Define allowed origins ──
// In production, read from environment variables or pipe config.
// Only requests from these origins are allowed to make state-changing
// requests (POST, PUT, DELETE, PATCH).
const ALLOWED_ORIGINS = [
  "http://localhost:8000",
  "https://myapp.example.com",
];

// ── Check Origin header ──
// The Origin header is sent automatically by browsers on cross-origin
// requests and same-origin POST requests. If absent, check Referer.
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin
const origin = input.request?.headers.get("origin") || "";
const referer = input.request?.headers.get("referer") || "";

// ── Determine the request source ──
let requestOrigin = origin;
if (!requestOrigin && referer) {
  // Fallback: extract origin from Referer header
  try {
    const refUrl = new URL(referer);
    requestOrigin = refUrl.origin;
  } catch {
    // Malformed Referer — reject
  }
}

if (!requestOrigin) {
  // No Origin or Referer on a state-changing request is suspicious.
  // Some legitimate cases (curl, Postman) omit it, so you might
  // want to relax this for API-only endpoints.
  input.response = new Response(JSON.stringify({ error: "Missing Origin header" }), {
    status: 403,
    headers: { "content-type": "application/json" },
  });
  return input;
}

if (!ALLOWED_ORIGINS.includes(requestOrigin)) {
  input.response = new Response(JSON.stringify({ error: "Origin not allowed" }), {
    status: 403,
    headers: { "content-type": "application/json" },
  });
  return input;
}
```

## Rate Limiting

Simple in-memory sliding window rate limiter. Limits requests per
IP address over a configurable time window. Returns 429 Too Many
Requests when the limit is exceeded.

For production with multiple server instances, use Deno KV or Redis
instead of an in-memory Map.

Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429
Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After

```ts
// ── Configuration ──
const MAX_REQUESTS = 100;          // Max requests per window
const WINDOW_MS = 60 * 1000;       // Window size: 60 seconds

// ── In-memory store ──
// Each entry tracks timestamps of recent requests from that IP.
// The store is module-level so it persists across requests (but not
// across server restarts). For distributed rate limiting, use Deno KV.
// Ref: https://docs.deno.com/deploy/kv/manual/
if (!globalThis.__rateLimitStore) {
  globalThis.__rateLimitStore = new Map();
}
const store = globalThis.__rateLimitStore;

// ── Identify the client ──
// Use X-Forwarded-For if behind a reverse proxy, otherwise fall back
// to a default. In Deno.serve, the remote address isn't on the Request
// object — you'd need Deno.ServeHandlerInfo for that.
const clientIp = input.request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  || "unknown";

// ── Sliding window check ──
const now = Date.now();
const timestamps = store.get(clientIp) || [];

// Remove timestamps outside the current window
const recent = timestamps.filter((t) => now - t < WINDOW_MS);

if (recent.length >= MAX_REQUESTS) {
  // ── Rate limit exceeded ──
  const retryAfter = Math.ceil((recent[0] + WINDOW_MS - now) / 1000);
  input.response = new Response(JSON.stringify({
    error: "Too many requests",
    retryAfter,
  }), {
    status: 429,
    headers: {
      "content-type": "application/json",
      // Retry-After tells the client how many seconds to wait.
      // Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
      "retry-after": String(retryAfter),
      "x-ratelimit-limit": String(MAX_REQUESTS),
      "x-ratelimit-remaining": "0",
      "x-ratelimit-reset": String(Math.ceil((recent[0] + WINDOW_MS) / 1000)),
    },
  });
  return input;
}

// ── Record this request ──
recent.push(now);
store.set(clientIp, recent);

// ── Add rate limit info headers to successful responses ──
input.responseOptions.headers["x-ratelimit-limit"] = String(MAX_REQUESTS);
input.responseOptions.headers["x-ratelimit-remaining"] = String(MAX_REQUESTS - recent.length);
input.responseOptions.headers["x-ratelimit-reset"] = String(Math.ceil((now + WINDOW_MS) / 1000));
```

## Secure Response Headers

Add security-related HTTP headers to every response. These headers
instruct browsers to enable various security protections.

Ref: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security

```ts
// ── X-Content-Type-Options ──
// Prevents browsers from MIME-sniffing the response away from the
// declared content-type. Stops attacks that disguise scripts as images.
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
input.responseOptions.headers["x-content-type-options"] = "nosniff";

// ── X-Frame-Options ──
// Prevents the page from being embedded in an iframe (clickjacking).
// Use "DENY" to block all framing, or "SAMEORIGIN" to allow same-origin.
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
input.responseOptions.headers["x-frame-options"] = "DENY";

// ── Strict-Transport-Security (HSTS) ──
// Tells browsers to only access the site over HTTPS for the next year.
// includeSubDomains extends this to all subdomains.
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
input.responseOptions.headers["strict-transport-security"] = "max-age=31536000; includeSubDomains";

// ── Referrer-Policy ──
// Controls how much referrer information is sent with navigations.
// "strict-origin-when-cross-origin" sends the full URL for same-origin
// requests but only the origin for cross-origin requests.
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
input.responseOptions.headers["referrer-policy"] = "strict-origin-when-cross-origin";

// ── Permissions-Policy ──
// Restricts which browser features the page can use. Disabling unused
// features reduces attack surface (e.g., no camera, no geolocation).
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
input.responseOptions.headers["permissions-policy"] = "camera=(), microphone=(), geolocation=()";

// ── Content-Security-Policy (CSP) ──
// Restricts which resources the page can load. This is a restrictive
// default — adjust for your app's needs (e.g., allow specific CDNs).
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
// Ref: https://csp-evaluator.withgoogle.com/
input.responseOptions.headers["content-security-policy"] =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'";
```
