// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";
import { z } from "npm:zod";
import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};


// Pipe schema — validates input at every step boundary
export const schema = z.object({
  name: z.string(),
  greeting: z.string().default(""),
  uppercased: z.string().default(""),
});
export type PipeInput = z.infer<typeof schema>;

function _pd_initSchema(input) {
  const result = schema.safeParse(input);
  if (result.success) {
    Object.assign(input, result.data);
  } else {
    input.errors = input.errors || [];
    input.errors.push({ func: "_pd_initSchema", message: result.error.message, issues: result.error.issues });
  }
}

function _pd_validateSchema(input) {
  const result = schema.safeParse(input);
  if (!result.success) {
    input.errors = input.errors || [];
    input.errors.push({ func: "_pd_validateSchema", message: result.error.message, issues: result.error.issues });
  }
}

export async function Greet (input, opts) {
    input.greeting = `Hello, ${input.name}!`;

}
export async function Uppercase (input, opts) {
    input.uppercased = input.greeting.toUpperCase();

}

const funcSequence = [
_pd_initSchema, Greet, _pd_validateSchema, Uppercase, _pd_validateSchema
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
