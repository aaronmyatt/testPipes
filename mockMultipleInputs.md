# Mock Multiple Inputs

Test that cassettes are isolated per test input. Two different inputs should produce two different cassette directories, each with their own recorded state.

```json
{
  "inputs": [
    { "_name": "small", "count": 3 },
    { "_name": "large", "count": 10 }
  ]
}
```

## Generate Data

Simulates generating data from an external source. Flagged as mock so each input gets its own cassette.

```ts mock
input.data = Array.from({ length: input.count }, (_, i) => i * 2);
```

## Summarize

```ts
input.sum = input.data.reduce((a, b) => a + b, 0);
input.average = input.sum / input.data.length;
```
