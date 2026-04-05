# Middleware: Cookies

Demonstrates cookie handling as Pipedown pipe steps using Deno's
standard library `@std/http/cookie`. Covers parsing incoming cookies,
setting response cookies with security flags, and signed cookies
for tamper detection.

```json
{
  "inputs": [
    { "_name": "noCookies" },
    { "_name": "withSession", "sessionId": "abc-123-def" }
  ]
}
```

## Parse Cookies

Read cookies from the incoming request. The `getCookies()` function
parses the `Cookie` header into a key-value object.

Ref: https://jsr.io/@std/http/doc/cookie/~/getCookies
Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies

```ts
import { getCookies } from "jsr:@std/http@1/cookie";

// ── Parse all cookies from the request ──
// getCookies() reads the Cookie header and returns a Record<string, string>.
// If no Cookie header is present, it returns an empty object.
// Ref: https://jsr.io/@std/http/doc/cookie/~/getCookies
const cookies = getCookies(input.request?.headers || new Headers());

// ── Attach parsed cookies for downstream steps ──
input.cookies = cookies;

// ── Example: read a session cookie ──
if (cookies.session) {
  input.sessionId = cookies.session;
}
```

## Set Cookies

Set response cookies with proper security flags. Uses `setCookie()`
which builds the `Set-Cookie` header with all directives.

Ref: https://jsr.io/@std/http/doc/cookie/~/setCookie
Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie

```ts
import { setCookie } from "jsr:@std/http@1/cookie";

// ── Build a Headers object to collect Set-Cookie headers ──
// setCookie() appends to an existing Headers object. We build one
// here and merge its values into responseOptions at the end.
const headers = new Headers();

// ── Set a session cookie ──
// HttpOnly: prevents JavaScript access (XSS protection)
// Secure: only sent over HTTPS
// SameSite=Lax: prevents CSRF on cross-site navigation but allows
//   top-level GET navigations (links from other sites work)
// Path=/: cookie is sent with all requests to this domain
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#security
setCookie(headers, {
  name: "session",
  value: input.sessionId || crypto.randomUUID(),
  httpOnly: true,     // Not accessible via document.cookie
  secure: true,       // Only sent over HTTPS
  sameSite: "Lax",    // CSRF protection with usability balance
  path: "/",          // Available on all routes
  maxAge: 60 * 60 * 24 * 7,  // 7 days in seconds
});

// ── Set a preferences cookie ──
// This one is NOT HttpOnly so client-side JS can read it
// (e.g., for theme/language preferences).
setCookie(headers, {
  name: "preferences",
  value: JSON.stringify({ theme: "dark", lang: "en" }),
  secure: true,
  sameSite: "Lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,  // 1 year
});

// ── Merge Set-Cookie headers into response ──
// Set-Cookie headers can't be combined — each cookie needs its own header.
// We store them for the server template to apply.
const setCookieHeaders = headers.getSetCookie();
if (setCookieHeaders.length) {
  input._setCookieHeaders = setCookieHeaders;
}

input.body = {
  message: "Cookies set",
  session: input.sessionId || "new session created",
};
```

## Delete Cookies

Remove a cookie by setting its `maxAge` to 0 or `expires` to a
past date. Useful for logout flows.

Ref: https://jsr.io/@std/http/doc/cookie/~/deleteCookie

- route: /logout

```ts
import { deleteCookie } from "jsr:@std/http@1/cookie";

// ── Delete the session cookie ──
// deleteCookie() sets the cookie's expiry to the epoch (Jan 1, 1970),
// which tells the browser to remove it.
// Ref: https://jsr.io/@std/http/doc/cookie/~/deleteCookie
const headers = new Headers();
deleteCookie(headers, "session", { path: "/" });

const setCookieHeaders = headers.getSetCookie();
if (setCookieHeaders.length) {
  input._setCookieHeaders = setCookieHeaders;
}

input.body = { message: "Logged out, session cookie deleted" };
```

## Signed Cookies

Use HMAC-signed cookies to detect tampering. The server signs the
cookie value with a secret key — if the value is modified by the
client, verification fails.

Ref: https://jsr.io/@std/http/doc/unstable-signed-cookie/

```ts
import { signCookie, verifySignedCookie, parseSignedCookie } from "jsr:@std/http@1/unstable-signed-cookie";
// getCookies is already imported in the "Parse Cookies" step above.
// In a standalone pipe, add getCookies to that step's import.

// ── Signing key ──
// In production, load from environment variables or a key store.
// The key must be a CryptoKey for HMAC-SHA256.
// Ref: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
const key = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode("pipedown-cookie-signing-secret-32ch"),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"],
);

// ── Read and verify an existing signed cookie ──
const cookies = getCookies(input.request?.headers || new Headers());
if (cookies.userId) {
  // verifySignedCookie() returns a boolean indicating whether the
  // signature is valid. Use parseSignedCookie() to extract the value.
  // Ref: https://jsr.io/@std/http/doc/unstable-signed-cookie/~/verifySignedCookie
  const isValid = await verifySignedCookie(cookies.userId, key);
  if (isValid) {
    // parseSignedCookie() strips the signature suffix and returns
    // the original value.
    // Ref: https://jsr.io/@std/http/doc/unstable-signed-cookie/~/parseSignedCookie
    input.verifiedUserId = parseSignedCookie(cookies.userId);
  } else {
    // Cookie was tampered with — reject the request
    input.response = new Response(JSON.stringify({ error: "Invalid cookie signature" }), {
      status: 403,
      headers: { "content-type": "application/json" },
    });
    return input;
  }
}

// ── Sign a new cookie value ──
// signCookie() appends an HMAC signature to the value.
// The resulting string looks like "value.signature".
// Ref: https://jsr.io/@std/http/doc/unstable-signed-cookie/~/signCookie
const signedValue = await signCookie("user-42", key);

input.body = {
  message: "Signed cookie demo",
  signedCookieValue: signedValue,
  verifiedUserId: input.verifiedUserId || "no signed cookie received",
};
```
