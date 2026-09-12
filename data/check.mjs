import { readFileSync } from "node:fs";
function check(file, needle) {
  const cards = JSON.parse(readFileSync(new URL(file, import.meta.url), "utf8"));
  if (cards.some((c) => !c.image || !c.id || !c.page)) throw new Error(file + " incomplete");
  if (cards.some((c) => !new RegExp(needle, "i").test(`${c.name} ${c.nameJa}`))) throw new Error(file + " wrong pokemon");
  return cards.length;
}
console.log("ok", check("./cards.json", "psyduck|コダック"), "psyduck", check("./ditto.json", "ditto|メタモン"), "ditto");
