# Middleware: Authentication

Demonstrates common authentication patterns as Pipedown pipe steps.
Each step guards a different route prefix, so they coexist in one pipe.
On auth failure, steps short-circuit by setting `input.response` directly —
the server template returns that response without running further steps.

```json
{
  "inputs": [
    {
      "_name": "validBasic",
      "request": "new Request('http://localhost/basic/hello', { headers: { 'Authorization': 'Basic ' + btoa('admin:secret123') } })"
    },
    {
      "_name": "validBearer",
      "request": "new Request('http://localhost/bearer/data', { headers: { 'X-API-Key': 'sk_test_my_secret_key' } })"
    }
  ]
}
```

## Basic Auth

Parse the `Authorization: Basic <base64>` header, decode credentials,
and validate against known username/password. Uses constant-time
comparison to prevent timing attacks.

RFC 7617 defines the Basic HTTP Authentication Scheme.
Ref: https://datatracker.ietf.org/doc/html/rfc7617

- route: /basic/*

```ts
// ── Extract the Authorization header ──
// The Basic scheme sends credentials as base64-encoded "username:password".
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization
const authHeader = input.request?.headers.get("authorization") || "";

if (!authHeader.startsWith("Basic ")) {
  // No Basic auth header present — challenge the client with a 401.
  // The WWW-Authenticate header tells the client which scheme to use.
  // Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate
  input.response = new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Pipedown"' },
  });
  return input;
}

// ── Decode and split credentials ──
// atob() decodes base64 → "username:password"
// Ref: https://developer.mozilla.org/en-US/docs/Web/API/atob
const decoded = atob(authHeader.slice(6));
const colonIdx = decoded.indexOf(":");
const username = decoded.slice(0, colonIdx);
const password = decoded.slice(colonIdx + 1);

// ── Validate credentials ──
// In production, compare against a database or environment variables.
// Use timing-safe comparison to prevent timing side-channel attacks.
// Ref: https://jsr.io/@std/crypto/doc/~/timingSafeEqual
const VALID_USER = "admin";
const VALID_PASS = "secret123";

const encoder = new TextEncoder();
const userMatch = username.length === VALID_USER.length &&
  crypto.subtle.timingSafeEqual
    ? await crypto.subtle.timingSafeEqual(encoder.encode(username), encoder.encode(VALID_USER))
    : username === VALID_USER;
const passMatch = password.length === VALID_PASS.length &&
  crypto.subtle.timingSafeEqual
    ? await crypto.subtle.timingSafeEqual(encoder.encode(password), encoder.encode(VALID_PASS))
    : password === VALID_PASS;

if (!userMatch || !passMatch) {
  input.response = new Response("Invalid credentials", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Pipedown"' },
  });
  return input;
}

// ── Auth passed — attach user identity for downstream steps ──
input.user = { username, authMethod: "basic" };
input.body = { message: `Hello, ${username}!`, authMethod: "basic" };
```

## Bearer Token / API Key

Extract a token from the `Authorization: Bearer <token>` header or a
custom `X-API-Key` header. Validate against a known value.

This pattern works for static API keys, pre-shared tokens, and as a
foundation for JWT validation (see next step).

- route: /bearer/*

```ts
// ── Check both Authorization: Bearer and X-API-Key headers ──
// Supporting multiple header styles is common in real APIs.
// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
const authHeader = input.request?.headers.get("authorization") || "";
const apiKey = input.request?.headers.get("x-api-key") || "";

let token = "";
if (authHeader.startsWith("Bearer ")) {
  token = authHeader.slice(7);
} else if (apiKey) {
  token = apiKey;
}

if (!token) {
  input.response = new Response(JSON.stringify({ error: "Missing API key or Bearer token" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
  return input;
}

// ── Validate the token ──
// In production, look up in a database or verify a JWT.
// Here we compare against a known value using timing-safe comparison.
// Ref: https://jsr.io/@std/crypto/doc/~/timingSafeEqual
const VALID_KEY = "sk_test_my_secret_key";
const encoder = new TextEncoder();
const tokenBytes = encoder.encode(token);
const validBytes = encoder.encode(VALID_KEY);

const isValid = token.length === VALID_KEY.length &&
  (crypto.subtle.timingSafeEqual
    ? await crypto.subtle.timingSafeEqual(tokenBytes, validBytes)
    : token === VALID_KEY);

if (!isValid) {
  input.response = new Response(JSON.stringify({ error: "Invalid API key" }), {
    status: 403,
    headers: { "content-type": "application/json" },
  });
  return input;
}

input.user = { apiKey: token.slice(0, 8) + "...", authMethod: "bearer" };
input.body = { message: "Authenticated via API key", authMethod: "bearer" };
```

## JWT Verification

Verify a JSON Web Token from the `Authorization: Bearer <jwt>` header
using the `jose` library. Supports both symmetric (HMAC) and asymmetric
(RSA, EC, EdDSA) algorithms and remote JWKS endpoints.

Library: jose — the most widely-used JWT library in the JS ecosystem.
Ref: https://jsr.io/@panva/jose
Ref: https://github.com/panva/jose

- route: /jwt/*

```ts
import { jwtVerify, SignJWT } from "jsr:@panva/jose";

// ── Extract Bearer token ──
const authHeader = input.request?.headers.get("authorization") || "";
if (!authHeader.startsWith("Bearer ")) {
  input.response = new Response(JSON.stringify({ error: "Missing Bearer token" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
  return input;
}

const token = authHeader.slice(7);

// ── Verification key ──
// For symmetric signing (HS256), use a shared secret.
// For asymmetric (RS256, ES256), use createRemoteJWKSet() from
// "jsr:@panva/jose" to fetch public keys from an identity provider's
// JWKS endpoint, e.g.:
//   const JWKS = createRemoteJWKSet(new URL("https://.../.well-known/jwks.json"));
// Ref: https://github.com/panva/jose/blob/main/docs/functions/jwks_remote.createRemoteJWKSet.md
const SECRET = new TextEncoder().encode("pipedown-example-secret-at-least-32-chars!");

try {
  // jwtVerify() checks the signature, expiration (exp), not-before (nbf),
  // and optionally issuer and audience claims.
  // Ref: https://github.com/panva/jose/blob/main/docs/functions/jwt_verify.jwtVerify.md
  const { payload, protectedHeader } = await jwtVerify(token, SECRET, {
    // Optional: restrict accepted issuers and audiences
    // issuer: "https://my-auth.example.com",
    // audience: "my-api",
  });

  // ── Attach user info from JWT claims for downstream steps ──
  input.user = {
    sub: payload.sub,
    email: payload.email,
    roles: payload.roles,
    authMethod: "jwt",
    algorithm: protectedHeader.alg,
  };
  input.body = { message: `Hello, ${payload.sub}!`, claims: payload };
} catch (err) {
  // jose throws specific error types for different failures:
  // JWTExpired, JWTClaimValidationFailed, JWSSignatureVerificationFailed, etc.
  // Ref: https://github.com/panva/jose/blob/main/docs/modules/util_errors.md
  input.response = new Response(JSON.stringify({
    error: "Invalid token",
    detail: err.message,
  }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}
```

## JWT Signing (Token Issuance)

Issue a new JWT — useful for login endpoints that return tokens.
This step demonstrates creating signed tokens with claims and expiry.

- route: /jwt/login
- method: POST

```ts
// SignJWT is already imported in the JWT Verification step above.
// In a standalone pipe, add SignJWT to that step's import statement.

// ── In a real app, validate credentials first (see Basic Auth step) ──
// Here we assume the body contains { username, password } already validated.

// ── Build and sign a JWT ──
// SignJWT uses a fluent builder pattern for setting header and claims.
// Ref: https://github.com/panva/jose/blob/main/docs/classes/jwt_sign.SignJWT.md
const SECRET = new TextEncoder().encode("pipedown-example-secret-at-least-32-chars!");

const jwt = await new SignJWT({
    // Custom claims — accessible in the JWT payload after verification
    email: "user@example.com",
    roles: ["user", "editor"],
  })
  .setProtectedHeader({ alg: "HS256" })  // Algorithm — HS256 for symmetric
  .setSubject("user-42")                  // "sub" claim — unique user ID
  .setIssuedAt()                          // "iat" claim — current timestamp
  .setExpirationTime("1h")               // "exp" claim — token valid for 1 hour
  .setIssuer("pipedown-example")          // "iss" claim — who issued the token
  .sign(SECRET);

input.body = {
  token: jwt,
  tokenType: "Bearer",
  expiresIn: 3600,
};
input.responseOptions.headers["content-type"] = "application/json";
```

## OAuth2 / OIDC (Reference)

For full OAuth2 authorization code flows, use these framework-agnostic
libraries — no Pipedown-specific code is needed beyond pipe steps:

**Generic OAuth2/OIDC (any provider):**
`jsr:@panva/oauth4webapi` — OpenID Certified, zero deps, Fetch + Web Crypto.
Ref: https://jsr.io/@panva/oauth4webapi
Ref: https://github.com/panva/oauth4webapi

**Social login with pre-configured providers (Google, GitHub, etc.):**
`npm:arctic` — 50+ providers, runtime-agnostic (Deno, Bun, Node, CF Workers).
Ref: https://arcticjs.dev/
Ref: https://github.com/pilcrowonpaper/arctic

**Deno-native with KV sessions:**
`jsr:@deno/kv-oauth` — uses Deno KV for session storage, maintained by Deno team.
Ref: https://jsr.io/@deno/kv-oauth

```ts skip
// This step is informational only — skip during execution.
// See the library documentation above for OAuth2 implementation patterns.
```
