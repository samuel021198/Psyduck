import { readFileSync } from "node:fs";
function check(file, needle) {
  const cards = JSON.parse(readFileSync(new URL(file, import.meta.url), "utf8"));
  if (cards.some((c) => !c.image || !c.id || !c.page)) throw new Error(file + " incomplete");
  if (cards.some((c) => !new RegExp(needle, "i").test(`${c.name} ${c.nameJa}`))) throw new Error(file + " wrong pokemon");
  return cards.length;
}
const CODE = /^[a-z0-9]{8}$/;
if (!CODE.test("abcd1234") || CODE.test("ABCD1234") || CODE.test("short")) throw new Error("sync code");
console.log("ok", check("./cards.json", "psyduck|コダック"), "psyduck", check("./ditto.json", "ditto|メタモン"), "ditto");
