# Very Impressive Codeblock

## do it

```ts
{"code": "export function generateCodeBlock(code: string, language: string = 'ts'): string {\n    return `\\`\\`\\`${language}\\n${code}\\n\\`\\`\\``;\n}\n\n// Example usage\nconst jsCode = 'console.log(\"Hello, world!\");';\nconsole.log(generateCodeBlock(jsCode)); // Uses default 'ts' language\nconsole.log(generateCodeBlock(jsCode, 'javascript')); // Specifies 'javascript' language"}
```
