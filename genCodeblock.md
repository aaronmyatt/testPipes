# Very Impressive Codeblock

## do it

```ts skip
export function generateCodeBlock(code: string, language: string = 'ts'): string {
    return `\`\`\`${language}\n${code}\n\`\`\``;
}

// Example usage
const jsCode = 'console.log("Hello, world!");';
console.log(generateCodeBlock(jsCode)); // Uses default 'ts' language
console.log(generateCodeBlock(jsCode, 'javascript')); // Specifies 'javascript' language
```
