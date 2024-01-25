import fs from "fs";

const prepareClaspJson = async () => {
  const prod = process.argv.some((arg) => arg === "---prod");
  const claspFile = prod ? ".clasp-prod.json" : ".clasp-dev.json";
  fs.copyFileSync(`./${claspFile}`, "./.clasp.json");
};

export { prepareClaspJson };
