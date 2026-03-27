# Skip Block Test

Test that code blocks with the `skip` modifier are excluded from execution.

```json
{
  "inputs": [
    { "_name": "basic", "value": 10 }
  ]
}
```

## Should Execute

```ts
input.executed = true;
input.result = input.value * 2;
```

## Should Be Skipped

```ts skip
input.skipped = true;
input.result = -1;
```

## After Skip

```ts
input.afterSkip = true;
```
