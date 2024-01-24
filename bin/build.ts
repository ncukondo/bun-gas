import fs from "fs";
import { $ } from "bun";
import { convertAndWriteGoogleAppsScript } from "./build/convert-to-gas";
import packageInfo from "../package.json";
import path from "path";

const packageInfoToGlobalName = (packageInfo: { name: string }) => {
  return packageInfo.name.split("/").at(-1) || "";
};

const baseDirName = () => path.basename(process.cwd());

const inputFile = path.resolve(process.argv[2]);

const outputFile = path.resolve(process.argv[3]);
const globalName =
  (process.argv[4] || packageInfoToGlobalName(packageInfo)).replaceAll("-", "_") || baseDirName();

if (!inputFile) {
  console.error("Please specify input file");
  process.exit(1);
}

if (!outputFile) {
  console.error("Please specify output file");
  process.exit(1);
}

await $`rm -rf dist`;
await $`mkdir dist`;
await $`cp -r ./public/* ./dist/`;
await convertAndWriteGoogleAppsScript(inputFile, globalName, outputFile);
