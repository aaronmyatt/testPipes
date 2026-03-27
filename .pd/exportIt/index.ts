// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";


import rawPipe from "./index.json" with {type: "json"};


export async function Exportsyo (input, opts) {
    console.log('Hello World')

}

const funcSequence = [
Exportsyo
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
