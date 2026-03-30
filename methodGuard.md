# Method Guard

Test that the `method:` DSL directive is correctly parsed by pipedown
into the step config. Each step below uses one or more `method:`
list items which should appear as `methods: [...]` in the generated
index.json step config.

The runtime guard (in pdPipe/pdUtils.ts) is tested separately in
pdPipe/pdUtils_test.ts. This pipe validates the **parsing** side.

```json
{
  "inputs": [
    { "_name": "basic" }
  ]
}
```

## Handle GET Only
- method: GET
- ```ts
  input.getStep = true;
  ```

## Handle POST Only
- method: POST
- ```ts
  input.postStep = true;
  ```

## Handle Multiple Methods
- method: GET
- method: PUT
- ```ts
  input.multiMethodStep = true;
  ```

## No Method Guard

This step has no method directive. It should have no methods config.

```ts
input.noGuardStep = true;
```
