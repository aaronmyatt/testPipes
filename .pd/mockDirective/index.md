# Mock Directive

Test the `- mock` list directive syntax. This uses the list DSL to flag a step as mockable, combined with conditional execution.

```json
{
  "inputs": [
    { "_name": "directive-test", "query": "hello world" }
  ]
}
```

## Search API
- mock
- ```ts
  input.searchResults = ["result1", "result2", "result3"];
  input.apiCallMade = true;
  ```

## Format Results

```ts
input.formatted = (input.searchResults || []).join(", ");
input.resultCount = (input.searchResults || []).length;
```
