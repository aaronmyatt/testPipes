# Content Type Directive

Test that the `type:` DSL directive is correctly parsed by pipedown
into the step config. Each step below uses a `type:` list item which
should appear as `contentType: "..."` in the generated index.json
step config.

The runtime content-type header setting (in pdPipe/pdUtils.ts) is
tested separately in pdPipe/pdUtils_test.ts. This pipe validates
the **parsing** side — both shorthand names and raw MIME types.

```json
{
  "inputs": [
    { "_name": "basic" }
  ]
}
```

## JSON Response
- type: json
- ```ts
  input.jsonStep = true;
  ```

## HTML Response
- type: html
- ```ts
  input.htmlStep = true;
  ```

## Raw MIME Type
- type: image/png
- ```ts
  input.rawStep = true;
  ```

## No Type Directive

This step has no type directive. It should have no contentType config.

```ts
input.noTypeStep = true;
```
