import { question, select } from "@topcli/prompts";
import fs from "fs-extra";
import path from "path";
import { $ } from "bun";
import { ensureDirSync } from "fs-extra";

const clasprcPath = path.join(process.env.HOME || process.env.USERPROFILE || "", ".clasprc.json");

const checkLogin = () => fs.existsSync(clasprcPath);

const getProjectName = async () => {
  const defaultProjectName = path.basename(process.cwd());
  const projectName = await question("Project name", { defaultValue: defaultProjectName });
  return projectName;
};

const getProjectJson = async (defaultProjectName = "") => {
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
    ] as const,
  })) as unknown as string;
  if (choice === "no") return null;
  const projectName = await question("Project name", { defaultValue: defaultProjectName });
  ensureDirSync("./dist");
  await $`bunx clasp create --type ${choice} --title ${projectName} --rootDir ./dist`;
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

// login to clasp in case of not logged in
if (!checkLogin()) {
  await $`bunx clasp login`;
  if (!checkLogin()) {
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
