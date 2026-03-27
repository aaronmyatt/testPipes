// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};


export async function doit (input, opts) {
    {"code": "export function generateCodeBlock(code: string, language: string = 'ts'): string {\n    return `\\`\\`\\`${language}\\n${code}\\n\\`\\`\\``;\n}\n\n// Example usage\nconst jsCode = 'console.log(\"Hello, world!\");';\nconsole.log(generateCodeBlock(jsCode)); // Uses default 'ts' language\nconsole.log(generateCodeBlock(jsCode, 'javascript')); // Specifies 'javascript' language"}

}

const funcSequence = [
doit
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
