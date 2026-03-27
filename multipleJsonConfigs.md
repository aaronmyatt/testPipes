# Multiple JSON Configs

Test that multiple JSON config blocks are deep-merged correctly.

```json
{
  "setting1": "from-first",
  "shared": "first-value",
  "inputs": [
    { "_name": "test1", "x": 1 }
  ]
}
```

```json
{
  "setting2": "from-second",
  "shared": "second-value"
}
```

## Process

```ts
input.setting1 = $p.get(opts, '/config/setting1');
input.setting2 = $p.get(opts, '/config/setting2');
input.shared = $p.get(opts, '/config/shared');
```
