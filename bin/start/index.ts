import { input, confirm, select, checkbox } from "@inquirer/prompts";
import fs from "fs";
import path from "path";
import { $ } from "bun";
import { ensureDirSync } from "fs-extra";

const clasprcPath = path.join(process.env.HOME || process.env.USERPROFILE || "", ".clasprc.json");

const checkLogin = () => fs.existsSync(clasprcPath);

const getProjectName = async () => {
  const defaultProjectName = path.basename(process.cwd());
  const projectName = await input({
    message: "Project name",
    default: defaultProjectName,
  });
  return projectName;
};

const getProjectJson = async (defaultProjectName = "") => {
  const existingProjectId = await input({
    message: "Project ID(optional)",
  });
  if (existingProjectId) return { scriptId: existingProjectId, rootDir: "./dist" };
  const choice = await select({
    message: "Create new project?",
    choices: [
      { name: "No", value: "no" },
      { name: "Yes(standalone)", value: "standalone" },
      { name: "Yes(bound to a Google Sheet)", value: "sheets" },
      { name: "Yes(bound to a Google Doc)", value: "docs" },
      { name: "Yes(bound to a Google Form)", value: "forms" },
      { name: "Yes(bound to a Google Slides)", value: "slides" },
      { name: "Yes(webapp)", value: "webapp" },
      { name: "Yes(API executable)", value: "api" },
    ],
  });
  if (choice === "no") return null;
  const projectName = await input({
    message: "Project name",
    default: defaultProjectName,
  });
  ensureDirSync("./dist");
  await $`bunx clasp create --type ${choice} --title ${projectName} --rootDir ./dist`;
  if (fs.existsSync("./dist/appsscript.json")) {
    fs.copyFileSync("./dist/appsscript.json", "./public/appsscript.json");
    fs.unlinkSync("./dist/appsscript.json");
  }
  if (fs.existsSync("./dist/.clasp.json")) {
    const claspJson = JSON.parse(fs.readFileSync("./dist/.clasp.json", "utf-8"));
    claspJson.rootDir = "./dist";
    fs.writeFileSync("./.clasp.json", JSON.stringify(claspJson, null, 2));
    fs.unlinkSync("./dist/.clasp.json");
    return claspJson;
  }
};

// login to clasp in case of not logged in
if (!checkLogin()) {
  await $`bunx clasp login`;
  if (!checkLogin()) {
    console.log("Clasp login failed");
    process.exit(1);
  }
}

const projectName = await getProjectName();
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
packageJson.name = projectName;
fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));

const claspJson = await getProjectJson(projectName);
if (!claspJson) {
  console.log("Please specify project ID or create new project later.");
} else {
  fs.writeFileSync("./.clasp.json", JSON.stringify(claspJson, null, 2));
  fs.writeFileSync("./.clasp-dev.json", JSON.stringify(claspJson, null, 2));
  fs.writeFileSync("./.clasp-prod.json", JSON.stringify(claspJson, null, 2));
  console.log("Project prepared.");
}
