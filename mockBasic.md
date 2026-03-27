# Mock Basic

Test the `mock` codeblock flag. The middle step simulates a side effect (e.g., an API call) and is flagged with `mock` so it can be recorded/replayed by the VCR test runner.

```json
{
  "inputs": [
    { "_name": "basic", "value": 10 }
  ]
}
```

## Double The Value

A pure step — always executes.

```ts
input.doubled = input.value * 2;
```

## Fetch External Data

This step simulates calling an external API. Flagged with `mock` so the test runner can record its output and replay it on subsequent runs.

```ts mock
input.externalData = "simulated API response for " + input.doubled;
input.fetchedAt = "2026-01-01T00:00:00.000Z";
```

## Process Result

A pure step that runs after the mocked step.

```ts
input.final = input.externalData + " — processed";
```
