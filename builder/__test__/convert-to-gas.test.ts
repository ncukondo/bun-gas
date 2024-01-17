import { describe, expect, test } from "bun:test";
import { convertToGoogleAppsScript } from "../convert-to-gas";
import path from "path";

describe("convert-to-gas", () => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const sampleEntry = path.resolve(__dirname, "./sample/main.ts");
  test("convertToGoogleAppsScript", async () => {
    const code = await convertToGoogleAppsScript(sampleEntry, "main");
    expect(code).toContain("function sayHello");
    expect(code).toContain("const hello");
    expect(code).toMatchSnapshot();
  });
});
