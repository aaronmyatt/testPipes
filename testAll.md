# Run All The Tests

A simple wrapper to run all test pipes at once.

## Headerless pipes are ok
[[123shouldwork.md]]
More accurately, a pipe that is prefixed with numbers, should work.
```ts
import test1 from "123shouldwork"
await test1.process()
console.log('✅ pipes with numbers in their names')
```

## dailyWallpaper
[[dailyWallpaper]]
This has been my primary test vehicle since the beginning.
It downloads the "photo of the day" from wikipedia. 
Not appropriate as a "unit" test tho, too many side effects.
Just keeping this here as reference.
```ts skip
import dw from "dailyWallpaper"
await dw.process()
```

## Denoflare template
When a `"templates": ["./denoflare.ts"]` property is present in config.json
the files will be written to each pipe directory generate by pipedown.
```ts
import $ from 'jsr:@david/dax';
import { assert } from "jsr:@std/assert";

const dirFiles = await $`ls .pd/123shouldwork/`.text()
assert(dirFiles.includes('denoflare'), 'Denoflare template not found')
console.log('✅ custom templates')
```

## nested config
```ts
import test3 from 'deeperConfig'
//Object.assign(input,await test2.process())
const out = await test3.process()
assert($p.get(out, '/gotDeeper/nextLevel/someValue') === 42, 'value written from nested config.json not present')
console.log('✅ NESTED config.json variables')
```

## should import with caps
Markdown file names should be respected.
```ts
import useCaps from 'UseCaps';
const out = await useCaps.process();
assert(out.allCaps === 'YUP', 'all caps import failed to process')
console.log('✅ capitalisation is respected')
```

## errors will be passed back to the caller for handling
```ts
import test4 from 'shouldThrow'
const out = await test4.process()
assert(out.errors.length > 0, 'error expected from shouldThrow.md')
console.log('✅ errors will be passed back to the caller for handling')
```

## configurable export formats
```ts
const dirFiles = await $`ls .pd/exportIt/`.text()
assert(dirFiles.includes('iife'), 'iife export not found')
assert(dirFiles.includes('cjs'), 'cjs export not found')
assert(dirFiles.includes('esm'), 'esm export not found')
console.log('✅ configurable export formats')
```

## edge case step names
```ts
import edgeCases from 'edgeCases'
const out = await edgeCases.process({ value: 42 })
assert(out.allPassed, 'edge case step names failed to execute')
console.log('✅ edge case step names')
```

## generated codeblock fixture
```ts
const genCodeblockSource = await Deno.readTextFile('genCodeblock.md')
assert(genCodeblockSource.includes('export function generateCodeBlock'), 'genCodeblock fixture is missing the embedded source')
assert(genCodeblockSource.includes('```ts'), 'genCodeblock fixture is missing its code fence')
console.log('✅ generated codeblock fixture')
```

## mock codeblock flag
```ts
import mockBasic from 'mockBasic'
const out = await mockBasic.process({ value: 10 })
assert(out.doubled === 20, 'mockBasic did not process the input value')
assert(out.final === 'simulated API response for 20 — processed', 'mockBasic did not preserve mocked output')
console.log('✅ mock codeblock flag')
```

## mock conditionals
```ts
import mockConditional from 'mockConditional'
const fetched = await mockConditional.process({ shouldFetch: true })
const skipped = await mockConditional.process({ shouldFetch: false })
assert(fetched.result === 'data from external API', 'mockConditional should fetch when the flag is set')
assert(skipped.result === 'no data', 'mockConditional should skip when the flag is unset')
console.log('✅ mock conditionals')
```

## mock list directives
```ts
import mockDirective from 'mockDirective'
const out = await mockDirective.process({ query: 'hello world' })
assert(out.apiCallMade, 'mockDirective did not execute the mocked list step')
assert(out.resultCount === 3, 'mockDirective did not format the expected number of results')
console.log('✅ mock list directives')
```

## mixed mock styles
```ts
import mockMixed from 'mockMixed'
const out = await mockMixed.process({ prompt: 'test prompt' })
assert(out.output.response === 'Generated text for: test prompt', 'mockMixed lost the mocked LLM response')
assert(out.output.id === 'mock-id-12345', 'mockMixed lost the mocked database id')
assert(out.output.saved === true, 'mockMixed did not mark the mocked write as saved')
console.log('✅ mixed mock styles')
```

## multiple mock inputs
```ts
import mockMultipleInputs from 'mockMultipleInputs'
const small = await mockMultipleInputs.process({ count: 3 })
const large = await mockMultipleInputs.process({ count: 10 })
assert(small.sum === 6 && small.average === 2, 'mockMultipleInputs failed the small input case')
assert(large.sum === 90 && large.average === 9, 'mockMultipleInputs failed the large input case')
console.log('✅ multiple mock inputs')
```

## multiple json config blocks
```ts
import multipleJsonConfigs from 'multipleJsonConfigs'
const out = await multipleJsonConfigs.process({ x: 1 })
assert(out.setting1 === 'from-first', 'first json config block was not applied')
assert(out.setting2 === 'from-second', 'second json config block was not applied')
assert(out.shared === 'second-value', 'later json config block did not override shared config')
console.log('✅ multiple json config blocks')
```

## skipped blocks stay skipped
```ts
import skipBlock from 'skipBlock'
const out = await skipBlock.process({ value: 10 })
assert(out.executed, 'skipBlock did not execute the active block')
assert(out.afterSkip, 'skipBlock did not continue after the skipped block')
assert(out.result === 20, 'skipBlock result was overwritten by a skipped block')
assert(typeof out.skipped === 'undefined', 'skipBlock executed code marked skip')
console.log('✅ skipped blocks stay skipped')
```

## conditional list tests
```ts
import testTests from 'testTests'
const out = await testTests.process({ points: { add: true, amount: 1 } })
assert(out.points === 2, 'testTests conditional step did not update nested input')
console.log('✅ conditional list tests')
```

## zod schema pipes
```ts
import zodSchema from 'zodSchema'
const out = await zodSchema.process({ name: 'World' })
assert(out.greeting === 'Hello, World!', 'zodSchema did not populate the greeting')
assert(out.uppercased === 'HELLO, WORLD!', 'zodSchema did not transform the greeting')
assert(!out.errors?.length, 'zodSchema produced unexpected validation errors')
console.log('✅ zod schema pipes')
```