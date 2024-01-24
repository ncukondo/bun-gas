import { $ } from "bun";
import { prepareClaspJson } from "./prepare-clasp-json";

await prepareClaspJson();
await $`bunx clasp deploy`;
