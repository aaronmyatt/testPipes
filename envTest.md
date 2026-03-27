# Env Test

This is a test of the environment variable heirachy pipedown searches through.

```json
{
    "inPipe": true
}
```

## readEnv
On `Deno.env`:
```json skip
{
  get: [Function: getEnv],
  toObject: [Function: toObject],
  set: [Function: setEnv],
  has: [Function: has],
  delete: [Function: deleteEnv]
}
```

```ts skip
console.log(Deno.env.toObject())
```

## fromConfig
Pipedown will automatically merge the json found in a \`\`\`json block and a global `config.json` file and make the data available inside of the pipe `opts.config` property.

```ts
input.fromOpts = opts.config;
```

## fromDotEnv
```ts
input.dotEnv = Deno.env.get('DOTENV_TEST')
```
