import { $ } from "bun";
import { prepareClaspJson } from "./prepare-clasp-json";

await prepareClaspJson();
await $`bun run build`;

await $`bunx clasp push`;
