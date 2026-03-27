// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};


export async function StepWithNumbers123 (input, opts) {
    input.numbersInName = true;

}
export async function UPPERCASESTEP (input, opts) {
    input.uppercaseStep = true;

}
export async function stepwithdashes (input, opts) {
    input.dashesInName = true;

}
export async function FinalCheck (input, opts) {
    input.allPassed = input.numbersInName && input.uppercaseStep && input.dashesInName;

}

const funcSequence = [
StepWithNumbers123, UPPERCASESTEP, stepwithdashes, FinalCheck
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
