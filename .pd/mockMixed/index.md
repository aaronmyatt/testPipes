# Mock Mixed

Test both codeblock flag and list directive mock in the same pipe. Two different steps use two different mock syntax styles.

```json
{
  "inputs": [
    { "_name": "mixed", "prompt": "test prompt" }
  ]
}
```

## Call LLM

Uses the codeblock info-string `mock` flag.

```ts mock
input.llmResponse = "Generated text for: " + input.prompt;
```

## Save to DB

Uses the list directive `- mock` syntax.

- mock
- ```ts
  input.dbId = "mock-id-12345";
  input.saved = true;
  ```

## Return Result

Pure step — assembles the final output.

```ts
input.output = { response: input.llmResponse, id: input.dbId, saved: input.saved };
```
