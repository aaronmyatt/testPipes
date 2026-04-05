# Zod Schema Test

A pipe with a top-level Zod schema that validates the input contract.

```zod
import { z } from "npm:zod";

export const schema = z.object({
  name: z.string(),
  greeting: z.string().default(""),
  uppercased: z.string().default(""),
});
```

```json
{
  "inputs": [
    { "_name": "basic", "name": "World" }
  ]
}
```

## Greet

Constructs a greeting message by combining a static salutation with the provided `input.name`, and stores the result in `input.greeting`.

```ts
input.greeting = `Hello, ${input.name}!`;
```

## Uppercase

Converts the greeting stored in `input.greeting` to all uppercase letters and saves the result in `input.uppercased`.

```ts
input.uppercased = input.greeting.toUpperCase();
```
