// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};


export async function GenerateData (input, opts) {
    input.data = Array.from({ length: input.count }, (_, i) => i * 2);

}
export async function Summarize (input, opts) {
    input.sum = input.data.reduce((a, b) => a + b, 0);
input.average = input.sum / input.data.length;

}

const funcSequence = [
GenerateData, Summarize
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
