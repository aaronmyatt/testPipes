// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};


export async function SearchAPI (input, opts) {
    input.searchResults = ["result1", "result2", "result3"];
input.apiCallMade = true;

}
export async function FormatResults (input, opts) {
    input.formatted = (input.searchResults || []).join(", ");
input.resultCount = (input.searchResults || []).length;

}

const funcSequence = [
SearchAPI, FormatResults
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
