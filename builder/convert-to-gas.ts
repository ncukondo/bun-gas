import { build as buildUsingVite } from "vite";
import fs from "fs";
import path from "path";
import { ensureDirSync } from "fs-extra";

const build = async (filename: string, name: string) => {
  console.log(filename);
  const res = await buildUsingVite({
    root: process.cwd(),
    build: {
      write: false,
      minify: false,
      lib: {
        entry: filename,
        name,
        formats: ["iife"],
      },
    },
  });
  const code = Array.isArray(res) ? res[0].output[0].code : "";
  return code;
};

const extractEntryExports = (code: string, globalName: string) => {
  const exports = new Function(`${code} return ${globalName}`)();
  const isFunction = (x: unknown): x is (...args: unknown[]) => unknown => typeof x === "function";
  return Object.entries(exports)
    .map(([name, obj]) => {
      return isFunction(obj)
        ? `function ${name}(...args){ return ${globalName}.${name}(...args);}`
        : `const ${name} = ${globalName}.${name};`;
    })
    .join("\n");
};

const convertToGoogleAppsScript = async (filename: string, globalName: string) => {
  const code = await build(filename, globalName);
  const exports = extractEntryExports(code, globalName);
  return `${code}\n\n${exports}\n`;
};

const convertAndWriteGoogleAppsScript = async (
  filename: string,
  globalName: string,
  output: string,
) => {
  const code = await convertToGoogleAppsScript(filename, globalName);
  const outputDir = path.dirname(output);
  ensureDirSync(outputDir);
  fs.writeFileSync(output, code);
};

export { convertToGoogleAppsScript, convertAndWriteGoogleAppsScript };
