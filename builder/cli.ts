import { convertAndWriteGoogleAppsScript } from "./convert-to-gas";
import packageInfo from "../package.json";

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const globalName = (process.argv[4] || packageInfo.name).replaceAll("-", "_");

if (!inputFile) {
  console.error("Please specify input file");
  process.exit(1);
}

if (!outputFile) {
  console.error("Please specify output file");
  process.exit(1);
}

await convertAndWriteGoogleAppsScript(inputFile, globalName, outputFile);
