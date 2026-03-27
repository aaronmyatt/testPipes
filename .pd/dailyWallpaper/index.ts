// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};
import { download } from "https://deno.land/x/download/mod.ts";
import _$ from "https://deno.land/x/dax/mod.ts";

export async function CalltheWikiMediaAPI (input, opts) {
    let today = new Date();
let year = today.getFullYear();
let month = String(today.getMonth() + 1).padStart(2, "0");
let day = String(today.getDate()).padStart(2, "0");
let url =
  `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`;

let response = await fetch(url, {
  headers: {
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI2NmZhNzliMDJiODdjNTkxMzZlNWJlMjZlNGEzNjI1OCIsImp0aSI6ImNkM2U0NzEwMjM3YjkyNWUyNjc1ZjE5ZTkzZDYzZmExMWE0M2RkMjdiNDk0YmUzODJmZmNhYWZlZDlmOWYzYjM1OTNiYTYwZTc2NjM2OGUzIiwiaWF0IjoxNjk3MzY2MDA3LjgyMDc5OCwibmJmIjoxNjk3MzY2MDA3LjgyMDgwMiwiZXhwIjozMzI1NDI3NDgwNy44MTc1MTYsInN1YiI6Ijc0MDA4Nzg4IiwiaXNzIjoiaHR0cHM6Ly9tZXRhLndpa2ltZWRpYS5vcmciLCJyYXRlbGltaXQiOnsicmVxdWVzdHNfcGVyX3VuaXQiOjUwMDAsInVuaXQiOiJIT1VSIn0sInNjb3BlcyI6WyJiYXNpYyJdfQ.mz7yGGz-FYMn0q3Akf16De2YZiZOFi2hZoB16Oif6AbV9jZ3cGYIujBO4H7Zx8jR487JOb-W1RmwSQm-Zk33aLFAV_l6sAgat04BqexrZPz7u46bVLpOH3z9FChpTkk_aXJKiqpHBi0_7c_IIXOMoGYqvkMTiySZUOY57ZXQb340y5ScPnQQqEfjOx3VKD3sOpNGQG9rNW9BF1YtcXGauKhwzmhwKqo3ZaWQG8dLdf3zD0xXiNttjhvZDIgyzVhz1opjdsQTSCtsAP-bja_ODxr97Jd1NmNB4M2EnndIUt2h48If6iztplHwdaWTQMCpro72bRoINYB7dgibeGeeD23u5bawJRe888MFgVannIw550LRzyGJPwrYme0FZvni2Zm0giK6CsmzVgTRDjIiuSc68t2mxQjsFFtg-NHIfvsz-v8E7ViQh3a_PtuVRVvtuqNc2ppqmpuATJ_z8qQabuYWbL9WQBG2JgKnuT3RKiuhwF6SriePnDaTwGANCT-sHU4Stk4sM91OMgDACI-SDLuAcVb3SVdEu306QZ67WLmpucvL8om-FyXi1BOSCVc3EKhF0HqmXgp8ld04glphg89WbAETP8tYM-SFKF0MvAXavnQexniIrqz5MYT4-t2PGKcKSwznXz0gi0862n6jpdIj-9MfvYYE_ckUf1bkKx8",
    "Api-User-Agent": "Pipedown (aaronmyatt@gmail.com)",
  },
});
input.wikiJson = await response.json();
input.imageUrl = input.wikiJson["image"]["image"]["source"];

}
export async function anonymous33 (input, opts) {
    

try {
  input.imageFile = await download(input.imageUrl);
} catch (err) {
  input.error = err;
}

}
export async function SetWallpaper (input, opts) {
    
input.osaout =
  await _$`osascript -e 'tell application "System Events" to tell every desktop to set picture to "${input.imageFile.fullPath}"'`
    .captureCombined();

}
export async function Exampleconditionalcheck (input, opts) {
    console.log('wat')

}
export async function WithRoute (input, opts) {
    console.log('route')

}

const funcSequence = [
CalltheWikiMediaAPI, anonymous33, SetWallpaper, Exampleconditionalcheck, WithRoute
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
