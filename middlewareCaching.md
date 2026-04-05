# Middleware: Caching & ETags

Demonstrates HTTP caching patterns as Pipedown pipe steps.
ETags enable conditional requests — the server can respond with
304 Not Modified when content hasn't changed, saving bandwidth.
Cache-Control headers tell browsers and CDNs how long to cache.

```json
{
  "inputs": [
    { "_name": "fresh" },
    { "_name": "withEtag", "etagToMatch": "\"test-etag\"" }
  ]
}
```

## Generate Content

A business logic step that produces some cacheable content.
In a real pipe, this would fetch data, render HTML, etc.

```ts
// ── Simulate content generation ──
// This represents your actual business logic. The caching steps
// below operate on whatever body is produced here.
input.body = {
  items: [
    { id: 1, name: "Widget A", price: 9.99 },
    { id: 2, name: "Widget B", price: 19.99 },
    { id: 3, name: "Widget C", price: 29.99 },
  ],
  generatedAt: new Date().toISOString(),
};
```

## ETag Generation & Conditional Response

Calculate an ETag from the response body using Deno's standard library.
If the client sends a matching `If-None-Match` header, respond with
304 Not Modified — the client uses its cached copy.

Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag
Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match
Ref: https://jsr.io/@std/http/doc/etag/

```ts
import { eTag, ifNoneMatch } from "jsr:@std/http@1/etag";

// ── Serialize body for hashing ──
// ETags need a stable string representation. JSON.stringify with
// sorted keys ensures the same content always produces the same ETag.
const bodyStr = typeof input.body === "string"
  ? input.body
  : JSON.stringify(input.body);

// ── Calculate the ETag ──
// eTag() hashes the content and returns a quoted ETag string
// like '"1a2b3c..."'. It accepts string or Uint8Array.
// Ref: https://jsr.io/@std/http/doc/etag/~/eTag
const etag = await eTag(bodyStr);

if (etag) {
  // ── Check If-None-Match ──
  // ifNoneMatch() compares the request's If-None-Match header against
  // the computed ETag. Returns true if they match (content unchanged).
  // Ref: https://jsr.io/@std/http/doc/etag/~/ifNoneMatch
  if (input.request && ifNoneMatch(input.request, etag)) {
    // Content hasn't changed — tell the client to use its cached copy.
    // 304 responses MUST NOT include a body.
    // Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304
    input.response = new Response(null, {
      status: 304,
      headers: { "etag": etag },
    });
    return input;
  }

  // ── Attach ETag to response headers ──
  input.responseOptions.headers["etag"] = etag;
}
```

## Cache-Control Headers

Set Cache-Control directives to control browser and CDN caching.
These are pure header-setting operations — no library needed.

Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
Ref: https://web.dev/articles/http-cache

```ts
// ── Choose caching strategy based on content type ──
// Different routes and content types benefit from different strategies.
const url = input.request?.url || "";
const pathname = new URL(url, "http://localhost").pathname;

if (pathname.startsWith("/api/")) {
  // ── API responses: revalidate on every request ──
  // no-cache means the browser MUST revalidate with the server before using
  // its cached copy (pairs well with ETags above).
  // Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#no-cache
  input.responseOptions.headers["cache-control"] = "no-cache";
} else if (pathname.startsWith("/static/") || pathname.match(/\.(js|css|png|jpg|woff2)$/)) {
  // ── Static assets: cache aggressively with immutable ──
  // max-age=31536000 (1 year) + immutable tells the browser to never
  // revalidate. Use content-hashed filenames to bust the cache.
  // Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#immutable
  input.responseOptions.headers["cache-control"] = "public, max-age=31536000, immutable";
} else {
  // ── Default: short cache with revalidation ──
  // Cache for 5 minutes, but always revalidate after that.
  // stale-while-revalidate allows serving stale content while fetching fresh.
  // Ref: https://web.dev/articles/stale-while-revalidate
  input.responseOptions.headers["cache-control"] = "public, max-age=300, stale-while-revalidate=60";
}

// ── Vary header ──
// Tell caches that responses vary by these headers — prevents serving
// a gzipped response to a client that doesn't support compression.
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary
input.responseOptions.headers["vary"] = "Accept, Accept-Encoding";
```
