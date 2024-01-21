import { placeTemplate } from "../place-template";
import { describe, expect, test } from "bun:test";
import fs from "fs";
import path from "path";

describe("placeTemplate", () => {
  test("replaces the template with the given dictionary", () => {
    const __dirname = new URL(".", import.meta.url).pathname;
    const templatePath = path.resolve(__dirname, "sample-template.json");
    const targetPath = path.resolve(__dirname, "sample-target.json");
    const dict = {
      version: "0.0.1",
      name: "sample-file",
      date: new Date(2021, 0, 1).getTime().toString(),
    };
    placeTemplate(templatePath, targetPath, dict);

    const savedTarge = fs.readFileSync(targetPath, "utf-8");

    expect(savedTarge).toContain('"0.0.1"');
    expect(savedTarge).toContain('"sample-file"');
    expect(savedTarge).toContain("1609459200000");
    expect(savedTarge).toMatchSnapshot();
  });
});
