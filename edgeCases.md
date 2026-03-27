# Edge Cases

Test various edge case scenarios.

```json
{
  "inputs": [
    { "_name": "basic", "value": 42 }
  ]
}
```

## Step With Numbers 123

```ts
input.numbersInName = true;
```

## UPPERCASE STEP

```ts
input.uppercaseStep = true;
```

## step-with-dashes

```ts
input.dashesInName = true;
```

## Final Check

```ts
input.allPassed = input.numbersInName && input.uppercaseStep && input.dashesInName;
```
