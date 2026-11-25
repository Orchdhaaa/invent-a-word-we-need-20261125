import { writeFileSync, mkdirSync } from "node:fs";

// Invented word for make.fun's "Invent a Word We Need".
// Typestop: the quiet after the typing dots vanish and no message
// ever comes. Everyone who has watched "..." appear and then
// disappear knows this silence; English had no word for it.
const ENTRY =
  "Typestop (n.): the quiet after the typing dots vanish and no message ever comes.";

// The gate only accepts UTF-8 text of 1 to 140 characters that is not
// whitespace-only, so verify the entry meets the gate before writing it.
const chars = [...ENTRY].length;
if (chars < 1 || chars > 140 || ENTRY.trim().length === 0) {
  throw new Error(`entry is ${chars} characters, outside the 1-140 gate`);
}

// The brief demands one invented word with a one-line definition: no
// second line and no em dash, which would break the clean single-line
// read the judge weighs. The entry must also open with the coined
// headword in dictionary form ("Word (n.): ...") and the definition
// must be one sentence ending in a period, so a malformed line can
// never be written out as the entry.
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (ENTRY.includes("\u2014") || ENTRY.includes("\u2013")) {
  throw new Error("entry must not contain a dash");
}
const headword = ENTRY.match(/^([A-Z][a-z]+) \(n\.\): /);
if (headword === null) {
  throw new Error("entry must open with the coined word as a (n.) headword");
}
const definition = ENTRY.slice(headword[0].length);
if (!definition.endsWith(".") || definition.slice(0, -1).includes(".")) {
  throw new Error("definition must be a single sentence ending in a period");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, ENTRY, "utf8");
