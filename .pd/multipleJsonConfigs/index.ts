// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};


export async function Process (input, opts) {
    input.setting1 = $p.get(opts, '/config/setting1');
input.setting2 = $p.get(opts, '/config/setting2');
input.shared = $p.get(opts, '/config/shared');

}

const funcSequence = [
Process
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
