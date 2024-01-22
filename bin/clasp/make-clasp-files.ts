import fs from "fs";
import path from "path";

const userHome =
  process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"] || process.cwd();

const clasprc = {
  token: {
    access_token: process.env.CLASPRC_ACCESS_TOKEN,
    scope:
      "https://www.googleapis.com/auth/script.deployments https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file openid https://www.googleapis.com/auth/service.management https://www.googleapis.com/auth/script.projects https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/logging.read https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/script.webapp.deploy",
    token_type: "Bearer",
    id_token: process.env.CLASPRC_ID_TOKEN,
    expiry_date: process.env.CLASPRC_EXPIRY_DATE,
    refresh_token: process.env.CLASPRC_REFRESH_TOKEN,
  },
  oauth2ClientSettings: {
    clientId: process.env.CLASPRC_CLIENT_ID,
    clientSecret: process.env.CLASPRC_CLIENT_SECRET,
    redirectUri: "http://localhost",
  },
  isLocalCreds: false,
};
const clasprcOutput = JSON.stringify(clasprc, null, 2);
fs.writeFileSync(path.join(userHome, ".clasprc.json"), clasprcOutput);

const clasp = {
  scriptId: process.env.CLASP_SCRIPT_ID,
  rootDir: "dist",
};

const claspOutput = JSON.stringify(clasp, null, 2);
fs.writeFileSync(".clasp.json", claspOutput);
