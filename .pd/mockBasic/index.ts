// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};


export async function DoubleTheValue (input, opts) {
    input.doubled = input.value * 2;

}
export async function FetchExternalData (input, opts) {
    input.externalData = "simulated API response for " + input.doubled;
input.fetchedAt = "2026-01-01T00:00:00.000Z";

}
export async function ProcessResult (input, opts) {
    input.final = input.externalData + " — processed";

}

const funcSequence = [
DoubleTheValue, FetchExternalData, ProcessResult
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
