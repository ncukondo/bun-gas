import fs from "fs";

const replaceText = (text: string, dict: Record<string, string>) => {
  const escapeRegExp = (str: string) => {
    return str.replace(/[.*+?^=!:${}()|[\]\/\\]/g, "\\$&");
  };
  const openParen = escapeRegExp("${");
  const closeParen = escapeRegExp("}");
  const keyRegexText = `${openParen}(${Object.keys(dict)
    .map(escapeRegExp)
    .join("|")})${closeParen}`;
  const keysRegex = new RegExp(keyRegexText, "g");
  return text.replace(keysRegex, (whole, key) => dict[key] ?? whole);
};

const placeTemplate = (templatePath: string, targetPath: string, dict: Record<string, string>) => {
  const template = fs.readFileSync(templatePath, "utf-8");
  const replaced = replaceText(template, dict);
  fs.writeFileSync(targetPath, replaced);
};

export { placeTemplate };
