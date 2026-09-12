import { readFileSync } from "node:fs";
function check(file, needle) {
  const cards = JSON.parse(readFileSync(new URL(file, import.meta.url), "utf8"));
  if (cards.some((c) => !c.image || !c.id || !c.page)) throw new Error(file + " incomplete");
  if (cards.some((c) => !new RegExp(needle, "i").test(`${c.name} ${c.nameJa}`))) throw new Error(file + " wrong pokemon");
  return cards.length;
}
const CODE = /^[a-z0-9]{8}$/;
if (!CODE.test("abcd1234") || CODE.test("ABCD1234") || CODE.test("short")) throw new Error("sync code");
const psy = JSON.parse(readFileSync(new URL("./cards.json", import.meta.url), "utf8"));
const dit = JSON.parse(readFileSync(new URL("./ditto.json", import.meta.url), "utf8"));
if (!psy.some((c) => c.id === "41547-433") || !psy.some((c) => c.id === "25958-2")) throw new Error("psyduck variants");
if (!dit.some((c) => c.id === "41625-434") || !dit.some((c) => c.id === "26007-2")) throw new Error("ditto variants");
if (psy.some((c) => c.id === "47801-2") || dit.some((c) => c.id === "89829-2")) throw new Error("fake reverse");
console.log("ok", check("./cards.json", "psyduck|コダック"), "psyduck", check("./ditto.json", "ditto|メタモン"), "ditto");
