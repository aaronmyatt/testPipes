# Middleware: Response Compression

Demonstrates HTTP response compression using the built-in
`CompressionStream` API and content negotiation from `@std/http`.
Compression reduces bandwidth usage for text-heavy responses
(JSON, HTML, CSS, JS) by 60–80%.

```json
{
  "inputs": [
    { "_name": "gzip" },
    { "_name": "noCompression" }
  ]
}
```

## Generate Content

Produce a response body large enough that compression provides benefit.
In practice, compression helps most with text responses over ~1 KB.

```ts
// ── Generate a JSON payload with enough data to benefit from compression ──
const items = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  description: `This is a detailed description for item number ${i + 1} in our catalog.`,
  price: Math.round(Math.random() * 10000) / 100,
  category: ["electronics", "clothing", "books", "home"][i % 4],
  inStock: i % 3 !== 0,
}));

input.body = { items, total: items.length };
input.responseOptions.headers["content-type"] = "application/json";
```

## Compress Response

Check what compression the client supports via `Accept-Encoding`,
then pipe the response through a `CompressionStream`.

Ref: https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream
Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding

```ts
// ── Check client capabilities ──
// The Accept-Encoding header lists compression algorithms the client supports.
// Common values: gzip, deflate, br (Brotli). We check for gzip and deflate
// since CompressionStream supports these natively in Deno.
// Ref: https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream#supported_compression_formats
const acceptEncoding = input.request?.headers.get("accept-encoding") || "";

// ── Pick the best supported algorithm ──
// Prefer gzip (broadest support), fall back to deflate.
let encoding = "";
if (acceptEncoding.includes("gzip")) {
  encoding = "gzip";
} else if (acceptEncoding.includes("deflate")) {
  encoding = "deflate";
}

// ── Skip compression for small bodies or unsupported clients ──
const bodyStr = typeof input.body === "string"
  ? input.body
  : JSON.stringify(input.body);

// Don't compress responses under 1 KB — the compression overhead
// can actually make them larger.
if (!encoding || bodyStr.length < 1024) {
  // Ensure body is serialized even without compression
  if (typeof input.body !== "string") {
    input.body = bodyStr;
  }
  return input;
}

// ── Compress the body ──
// CompressionStream is a TransformStream that compresses data chunks.
// We pipe the body through it and collect the compressed output.
// Ref: https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream
const encoder = new TextEncoder();
const readable = new ReadableStream({
  start(controller) {
    controller.enqueue(encoder.encode(bodyStr));
    controller.close();
  },
});

// Pipe through the compression transform and collect result
const compressed = await new Response(
  readable.pipeThrough(new CompressionStream(encoding))
).arrayBuffer();

// ── Build a compressed response ──
// Set Content-Encoding so the client knows to decompress.
// Remove Content-Length (if set) since the compressed size differs.
// Add Vary: Accept-Encoding so caches store separate versions.
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
input.response = new Response(compressed, {
  status: input.responseOptions.status || 200,
  headers: {
    ...input.responseOptions.headers,
    "content-encoding": encoding,
    "vary": "Accept-Encoding",
    // Content-Length is automatically set by Response for ArrayBuffer
  },
});
```
