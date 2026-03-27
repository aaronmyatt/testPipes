// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};


export async function ShouldExecute (input, opts) {
    input.executed = true;
input.result = input.value * 2;

}
export async function AfterSkip (input, opts) {
    input.afterSkip = true;

}

const funcSequence = [
ShouldExecute, AfterSkip
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
