// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};


export async function MaybeFetch (input, opts) {
    input.fetched = "data from external API";

}
export async function AlwaysRuns (input, opts) {
    input.result = input.fetched || "no data";

}

const funcSequence = [
MaybeFetch, AlwaysRuns
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
