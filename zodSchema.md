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

```ts
input.greeting = `Hello, ${input.name}!`;
```

## Uppercase

```ts
input.uppercased = input.greeting.toUpperCase();
```
