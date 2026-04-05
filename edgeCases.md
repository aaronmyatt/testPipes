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

Sets the `numbersInName` property on `input` to `true`, verifying that step titles containing numeric characters are handled correctly by the pipeline.

```ts
input.numbersInName = true;
```

## UPPERCASE STEP

Sets the `uppercaseStep` property on `input` to `true`, verifying that step titles written in all uppercase characters are handled correctly by the pipeline.

```ts
input.uppercaseStep = true;
```

## step-with-dashes

Sets the `dashesInName` property on `input` to `true`, verifying that step titles containing dash characters are handled correctly by the pipeline.

```ts
input.dashesInName = true;
```

## Final Check

Combines the results of all preceding edge case checks by ANDing `input.numbersInName`, `input.uppercaseStep`, and `input.dashesInName` together, storing the final boolean outcome in `input.allPassed` to confirm that all naming edge cases were handled successfully.

```ts
input.allPassed = input.numbersInName && input.uppercaseStep && input.dashesInName;
```
