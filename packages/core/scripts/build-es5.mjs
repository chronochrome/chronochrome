/**
 * Turns tsup's ES2020 IIFE (`dist/es5.global.js`) into `dist/chronochrome.es5.js`:
 * ES5 syntax for TV browsers (Chromium 38+), wrapped as UMD with the global
 * `chronochrome`. esbuild cannot emit ES5, and its own down-levelling helpers call
 * `Object.getOwnPropertyDescriptors` (Chrome 54), so TypeScript lowers it all.
 */

import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const dist = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
const input = resolve(dist, "es5.global.js");

const { outputText } = ts.transpileModule(readFileSync(input, "utf8"), {
  compilerOptions: {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.None,
    removeComments: true,
  },
});

const umd = `(function (root, factory) {
  if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof module === "object" && module.exports) module.exports = factory();
  else root.chronochrome = factory();
})(this, function () {
${outputText}
return chronochrome;
});
`;

writeFileSync(resolve(dist, "chronochrome.es5.js"), umd);
rmSync(input);
