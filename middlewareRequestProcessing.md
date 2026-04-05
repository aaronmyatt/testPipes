# Middleware: Request Processing

Demonstrates request-level middleware patterns as Pipedown pipe steps:
body size limits, request timeouts, and content negotiation.
All use Web platform APIs — minimal external libraries needed.

```json
{
  "inputs": [
    { "_name": "basic" }
  ]
}
```

## Body Limit

Reject requests with bodies that exceed a maximum size. Prevents
denial-of-service attacks from oversized payloads consuming memory.

Check this early — before any body parsing happens.

Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413
Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length

- method: POST
- method: PUT
- method: PATCH

```ts
// ── Configuration ──
// Maximum allowed body size in bytes. 1 MB is a common default for
// JSON APIs. Increase for file upload endpoints.
const MAX_BODY_BYTES = 1 * 1024 * 1024;  // 1 MB

// ── Check Content-Length header ──
// Content-Length is set by the client and tells us the body size
// before we read it. This is a fast pre-check — but Content-Length
// can be absent (chunked transfer encoding) or spoofed.
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length
const contentLength = parseInt(
  input.request?.headers.get("content-length") || "0",
  10,
);

if (contentLength > MAX_BODY_BYTES) {
  // ── Reject oversized body immediately ──
  // 413 Payload Too Large tells the client the body exceeds limits.
  // Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413
  input.response = new Response(JSON.stringify({
    error: "Payload too large",
    maxBytes: MAX_BODY_BYTES,
    receivedBytes: contentLength,
  }), {
    status: 413,
    headers: { "content-type": "application/json" },
  });
  return input;
}

// ── Note on chunked bodies ──
// When Content-Length is absent (streaming/chunked uploads), you would
// read the body incrementally and abort if it exceeds the limit:
//
//   const reader = request.body.getReader();
//   let totalBytes = 0;
//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;
//     totalBytes += value.length;
//     if (totalBytes > MAX_BODY_BYTES) { /* reject */ }
//   }
```

## Request Timeout

Apply a timeout to the pipeline processing. If a request takes too
long (e.g., slow database, hanging external API), return a timeout
error rather than leaving the client waiting indefinitely.

Ref: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static
Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408
Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504

```ts
// ── Timeout configuration ──
// Set on the input object so downstream steps can check it.
// Steps doing async work should use this signal to abort gracefully.
const TIMEOUT_MS = 30_000;  // 30 seconds

// ── Create an abort signal that fires after the timeout ──
// AbortSignal.timeout() returns a signal that auto-aborts after
// the specified duration. Pass it to fetch() or other async APIs.
// Ref: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static
input.timeoutSignal = AbortSignal.timeout(TIMEOUT_MS);

// ── Example: using the signal in a downstream step ──
// In a later pipe step, use the signal when calling external APIs:
//
//   const res = await fetch("https://api.example.com/data", {
//     signal: input.timeoutSignal,
//   });
//
// If the timeout fires, fetch() throws an AbortError, which the
// pipeline catches and adds to input.errors.

// ── Alternative: Promise.race for whole-step timeouts ──
// Wrap any async operation in Promise.race with a timeout:
//
//   const result = await Promise.race([
//     doSlowThing(),
//     new Promise((_, reject) =>
//       setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)
//     ),
//   ]);
```

## Content Negotiation

Inspect the `Accept` header to determine what response format the
client prefers. Serve JSON, HTML, or plain text accordingly.

Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation
Ref: https://jsr.io/@std/http/doc/negotiation/

```ts
import { accepts } from "jsr:@std/http@1/negotiation";

// ── Determine preferred content type ──
// accepts() parses the Accept header and returns the best match
// from the provided list, respecting quality values (q=...).
// Ref: https://jsr.io/@std/http/doc/negotiation/~/accepts
const preferred = accepts(input.request, "application/json", "text/html", "text/plain");

// ── Example data to render in different formats ──
const data = {
  greeting: "Hello from Pipedown!",
  timestamp: new Date().toISOString(),
  version: "1.0.0",
};

switch (preferred) {
  case "text/html":
    // ── HTML response ──
    input.body = `<!doctype html>
<html><body>
  <h1>${data.greeting}</h1>
  <p>Time: ${data.timestamp}</p>
  <p>Version: ${data.version}</p>
</body></html>`;
    input.responseOptions.headers["content-type"] = "text/html; charset=utf-8";
    break;

  case "text/plain":
    // ── Plain text response ──
    input.body = `${data.greeting}\nTime: ${data.timestamp}\nVersion: ${data.version}`;
    input.responseOptions.headers["content-type"] = "text/plain; charset=utf-8";
    break;

  case "application/json":
  default:
    // ── JSON response (default) ──
    input.body = data;
    input.responseOptions.headers["content-type"] = "application/json";
    break;
}

// ── Add Vary header ──
// Tells caches that the response varies by Accept header, so different
// representations are cached separately.
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary
input.responseOptions.headers["vary"] = "Accept";
```
