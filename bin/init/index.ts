import { question, select } from "@topcli/prompts";
import fs from "fs-extra";
import path from "path";
import { parseArgs } from "util";
import { $ } from "bun";
import { ensureDirSync } from "fs-extra";

const VALID_TYPES = [
  "standalone",
  "sheets",
  "docs",
  "forms",
  "slides",
  "webapp",
  "api",
  "no",
] as const;
type ProjectType = (typeof VALID_TYPES)[number];

const isInteractive = Boolean(process.stdin.isTTY && process.stdout.isTTY);

const { values: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    name: { type: "string" },
    type: { type: "string" },
    "script-id": { type: "string" },
    "no-create": { type: "boolean" },
    help: { type: "boolean", short: "h" },
  },
  allowPositionals: true,
  strict: false,
});

if (args.help) {
  console.log(`Usage: bun run init [-- options]

Options:
  --name <name>        Project name (defaults to current directory name)
  --type <type>        One of: ${VALID_TYPES.join(", ")}
  --script-id <id>     Use existing Apps Script project ID (skips project creation)
  --no-create          Skip project creation (equivalent to --type=no)
  -h, --help           Show this help

Environment variables (useful with 'bun create' since flags cannot be forwarded):
  BUN_GAS_PROJECT_NAME   same as --name
  BUN_GAS_PROJECT_TYPE   same as --type
  BUN_GAS_SCRIPT_ID      same as --script-id
`);
  process.exit(0);
}

const optName = (args.name as string | undefined) ?? process.env.BUN_GAS_PROJECT_NAME;
const optTypeRaw =
  (args.type as string | undefined) ??
  process.env.BUN_GAS_PROJECT_TYPE ??
  (args["no-create"] ? "no" : undefined);
const optScriptId = (args["script-id"] as string | undefined) ?? process.env.BUN_GAS_SCRIPT_ID;

if (optTypeRaw !== undefined && !VALID_TYPES.includes(optTypeRaw as ProjectType)) {
  console.error(
    `Invalid project type: ${optTypeRaw}\nValid types: ${VALID_TYPES.join(", ")}`,
  );
  process.exit(1);
}
const optType = optTypeRaw as ProjectType | undefined;

const checkLogin = async () => {
  const result = await $`bunx clasp show-authorized-user`.nothrow().quiet();
  return result.exitCode === 0;
};

const getProjectName = async () => {
  const defaultProjectName = path.basename(process.cwd());
  if (optName) return optName;
  if (!isInteractive) return defaultProjectName;
  const projectName = await question("Project name", { defaultValue: defaultProjectName });
  return projectName;
};

const createClaspProject = async (type: ProjectType, projectName: string) => {
  ensureDirSync("./dist");
  await $`bunx clasp create --type ${type} --title ${projectName} --rootDir ./dist`;
  if (fs.existsSync("./dist/appsscript.json")) {
    fs.moveSync("./dist/appsscript.json", "./public/appsscript.json");
  }
  if (fs.existsSync("./dist/.clasp.json")) {
    const claspJson = JSON.parse(fs.readFileSync("./dist/.clasp.json", "utf-8"));
    claspJson.rootDir = "./dist";
    fs.moveSync("./dist/.clasp.json", "./.clasp.json");
    return claspJson;
  }
};

const getProjectJson = async (defaultProjectName: string) => {
  if (optScriptId) return { scriptId: optScriptId, rootDir: "./dist" };
  if (optType) {
    if (optType === "no") return null;
    return await createClaspProject(optType, defaultProjectName);
  }
  if (!isInteractive) {
    return null;
  }
  const existingProjectId = await question("Project ID(optional)");
  if (existingProjectId) return { scriptId: existingProjectId, rootDir: "./dist" };
  const choice = (await select("What kind of project would you create?", {
    choices: [
      { label: "standalone", value: "standalone" },
      { label: "bound to a Google Sheet", value: "sheets" },
      { label: "bound to a Google Doc", value: "docs" },
      { label: "bound to a Google Form", value: "forms" },
      { label: "bound to a Google Slides", value: "slides" },
      { label: "webapp", value: "webapp" },
      { label: "API executable", value: "api" },
      { label: "Do not create project(specify later).", value: "no" },
    ],
  })) as ProjectType;
  if (choice === "no") return null;
  const projectName = await question("Project name", { defaultValue: defaultProjectName });
  return await createClaspProject(choice, projectName);
};

if (!(await checkLogin())) {
  if (!isInteractive) {
    console.error("\nClasp is not logged in.\n");
    console.error("Please run `bunx clasp login` in an interactive terminal,");
    console.error("then run `bun run init` again (optionally with --name / --type flags).\n");
    process.exit(1);
  }
  await $`bunx clasp login`;
  if (!(await checkLogin())) {
    console.log("\nClasp login failed\n\n");
    console.log(
      "1. Please turn on Google Apps Script API(go https://script.google.com/home/usersettings ).",
    );
    console.log("2. `bun run init` again.\n\n");
    process.exit(1);
  }
}

const projectName = await getProjectName();
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
if (projectName !== packageJson.name) {
  packageJson.name = projectName;
  fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
}

const claspJson = await getProjectJson(projectName);
if (!claspJson) {
  console.log("Please specify project ID or create new project later using below.");
  console.log("\n\nbun run init\n\n");
} else {
  fs.writeFileSync("./.clasp.json", JSON.stringify(claspJson, null, 2));
  fs.writeFileSync("./.clasp-dev.json", JSON.stringify(claspJson, null, 2));
  fs.writeFileSync("./.clasp-prod.json", JSON.stringify(claspJson, null, 2));
  console.log("Project prepared.");
  console.log(`Usage:
  bun run build            # build project
  bun run push             # push project to Google Apps Script using .clasp-dev.json
  bun run push:prod        # push project to Google Apps Script using .clasp-prod.json
  bun run deploy           # deploy project using .clasp-dev.json
  bun run deploy:prod      # deploy project using .clasp-prod.json
  bun run open             # open project in browser
  bun run open:prod        # open project in browser(in .clasp-prod.json)
`);
}
