# Mock Conditional

Test mock combined with conditional execution (`- if:`). The mocked step only runs when `shouldFetch` is truthy, so the cassette is only recorded/replayed when the condition is met.

```json
{
  "inputs": [
    { "_name": "with-flag", "shouldFetch": true },
    { "_name": "without-flag", "shouldFetch": false }
  ]
}
```

## Maybe Fetch
- if: /shouldFetch
- mock
- ```ts
  input.fetched = "data from external API";
  ```

## Always Runs

```ts
input.result = input.fetched || "no data";
```
