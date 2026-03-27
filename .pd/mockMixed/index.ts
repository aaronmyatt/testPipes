// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};


export async function CallLLM (input, opts) {
    input.llmResponse = "Generated text for: " + input.prompt;

}
export async function SavetoDB (input, opts) {
    input.dbId = "mock-id-12345";
input.saved = true;

}
export async function ReturnResult (input, opts) {
    input.output = { response: input.llmResponse, id: input.dbId, saved: input.saved };

}

const funcSequence = [
CallLLM, SavetoDB, ReturnResult
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
