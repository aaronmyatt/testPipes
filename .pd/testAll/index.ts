// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};
import test1 from "123shouldwork"
import $ from 'jsr:@david/dax';
import { assert } from "jsr:@std/assert";
import test2 from 'envTest'
import test3 from 'deeperConfig'
import useCaps from 'UseCaps';
import test4 from 'shouldThrow'
import edgeCases from 'edgeCases'
import mockBasic from 'mockBasic'
import mockConditional from 'mockConditional'
import mockDirective from 'mockDirective'
import mockMixed from 'mockMixed'
import mockMultipleInputs from 'mockMultipleInputs'
import multipleJsonConfigs from 'multipleJsonConfigs'
import skipBlock from 'skipBlock'
import testTests from 'testTests'
import zodSchema from 'zodSchema'

export async function Headerlesspipesareok (input, opts) {
    
await test1.process()
console.log('✅ pipes with numbers in their names')

}
export async function Denoflaretemplate (input, opts) {
    


const dirFiles = await $`ls .pd/123shouldwork/`.text()
assert(dirFiles.includes('denoflare'), 'Denoflare template not found')
console.log('✅ custom templates')

}
export async function envTest (input, opts) {
    
//Object.assign(input,await test2.process())
const out = await test2.process()
assert(out.fromOpts.inGlobal, 'value written from global config.json not present')
assert(out.fromOpts.inPipe, 'value written from local json block not present')
assert(out.dotEnv === 'yaaaaas', 'value written from .env not present')
console.log('✅ env and config.json variables')

}
export async function nestedconfig (input, opts) {
    
//Object.assign(input,await test2.process())
const out = await test3.process()
assert($p.get(out, '/gotDeeper/nextLevel/someValue') === 42, 'value written from nested config.json not present')
console.log('✅ NESTED config.json variables')

}
export async function shouldimportwithcaps (input, opts) {
    
const out = await useCaps.process();
assert(out.allCaps === 'YUP', 'all caps import failed to process')
console.log('✅ capitalisation is respected')

}
export async function errorswillbepassedbacktothecallerforhandling (input, opts) {
    
const out = await test4.process()
assert(out.errors.length > 0, 'error expected from shouldThrow.md')
console.log('✅ errors will be passed back to the caller for handling')

}
export async function configurableexportformats (input, opts) {
    const dirFiles = await $`ls .pd/exportIt/`.text()
assert(dirFiles.includes('iife'), 'iife export not found')
assert(dirFiles.includes('cjs'), 'cjs export not found')
assert(dirFiles.includes('esm'), 'esm export not found')
console.log('✅ configurable export formats')

}
export async function edgecasestepnames (input, opts) {
    
const out = await edgeCases.process({ value: 42 })
assert(out.allPassed, 'edge case step names failed to execute')
console.log('✅ edge case step names')

}
export async function generatedcodeblockfixture (input, opts) {
    const genCodeblockSource = await Deno.readTextFile('genCodeblock.md')
assert(genCodeblockSource.includes('export function generateCodeBlock'), 'genCodeblock fixture is missing the embedded source')
assert(genCodeblockSource.includes('```ts'), 'genCodeblock fixture is missing its code fence')
console.log('✅ generated codeblock fixture')

}
export async function mockcodeblockflag (input, opts) {
    
const out = await mockBasic.process({ value: 10 })
assert(out.doubled === 20, 'mockBasic did not process the input value')
assert(out.final === 'simulated API response for 20 — processed', 'mockBasic did not preserve mocked output')
console.log('✅ mock codeblock flag')

}
export async function mockconditionals (input, opts) {
    
const fetched = await mockConditional.process({ shouldFetch: true })
const skipped = await mockConditional.process({ shouldFetch: false })
assert(fetched.result === 'data from external API', 'mockConditional should fetch when the flag is set')
assert(skipped.result === 'no data', 'mockConditional should skip when the flag is unset')
console.log('✅ mock conditionals')

}
export async function mocklistdirectives (input, opts) {
    
const out = await mockDirective.process({ query: 'hello world' })
assert(out.apiCallMade, 'mockDirective did not execute the mocked list step')
assert(out.resultCount === 3, 'mockDirective did not format the expected number of results')
console.log('✅ mock list directives')

}
export async function mixedmockstyles (input, opts) {
    
const out = await mockMixed.process({ prompt: 'test prompt' })
assert(out.output.response === 'Generated text for: test prompt', 'mockMixed lost the mocked LLM response')
assert(out.output.id === 'mock-id-12345', 'mockMixed lost the mocked database id')
assert(out.output.saved === true, 'mockMixed did not mark the mocked write as saved')
console.log('✅ mixed mock styles')

}
export async function multiplemockinputs (input, opts) {
    
const small = await mockMultipleInputs.process({ count: 3 })
const large = await mockMultipleInputs.process({ count: 10 })
assert(small.sum === 6 && small.average === 2, 'mockMultipleInputs failed the small input case')
assert(large.sum === 90 && large.average === 9, 'mockMultipleInputs failed the large input case')
console.log('✅ multiple mock inputs')

}
export async function multiplejsonconfigblocks (input, opts) {
    
const out = await multipleJsonConfigs.process({ x: 1 })
assert(out.setting1 === 'from-first', 'first json config block was not applied')
assert(out.setting2 === 'from-second', 'second json config block was not applied')
assert(out.shared === 'second-value', 'later json config block did not override shared config')
console.log('✅ multiple json config blocks')

}
export async function skippedblocksstayskipped (input, opts) {
    
const out = await skipBlock.process({ value: 10 })
assert(out.executed, 'skipBlock did not execute the active block')
assert(out.afterSkip, 'skipBlock did not continue after the skipped block')
assert(out.result === 20, 'skipBlock result was overwritten by a skipped block')
assert(typeof out.skipped === 'undefined', 'skipBlock executed code marked skip')
console.log('✅ skipped blocks stay skipped')

}
export async function conditionallisttests (input, opts) {
    
const out = await testTests.process({ points: { add: true, amount: 1 } })
assert(out.points === 2, 'testTests conditional step did not update nested input')
console.log('✅ conditional list tests')

}
export async function zodschemapipes (input, opts) {
    
const out = await zodSchema.process({ name: 'World' })
assert(out.greeting === 'Hello, World!', 'zodSchema did not populate the greeting')
assert(out.uppercased === 'HELLO, WORLD!', 'zodSchema did not transform the greeting')
assert(!out.errors?.length, 'zodSchema produced unexpected validation errors')
console.log('✅ zod schema pipes')

}

const funcSequence = [
Headerlesspipesareok, Denoflaretemplate, envTest, nestedconfig, shouldimportwithcaps, errorswillbepassedbacktothecallerforhandling, configurableexportformats, edgecasestepnames, generatedcodeblockfixture, mockcodeblockflag, mockconditionals, mocklistdirectives, mixedmockstyles, multiplemockinputs, multiplejsonconfigblocks, skippedblocksstayskipped, conditionallisttests, zodschemapipes
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
