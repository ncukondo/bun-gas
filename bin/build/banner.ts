const begin = "/**";
const end = "*/\n\n\n";

const makeBanner = (pkg: Record<string, string | object>, keys: string[]) => {
  const lines = keys
    .map((key) => {
      if (!(key in pkg)) return "";
      if (typeof pkg[key] !== "string") return "";
      const value = pkg[key];
      return ` * ${key}: ${value}`;
    })
    .filter((line) => line !== "");
  return [begin, ...lines, end].join("\n");
};

export { makeBanner };
