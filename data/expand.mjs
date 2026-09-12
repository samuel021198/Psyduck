import { readFileSync, writeFileSync } from "node:fs";

const NAMES = {
  1: "Normal",
  2: "Reverse Holo",
  4: "1st Edition",
  7: "Jumbo Size",
  46: "Non-holo",
  154: "Holo",
  363: "Normal Holo",
  368: "Promo",
  383: "Reverse Holo, 1st Edition",
  384: "Unpeeled Card (Numel)",
  385: "Unpeeled Card (Bidoof)",
  386: "Unpeeled Card (Spinarak)",
  433: "Poké Ball Reverse Holo",
  434: "Master Ball Reverse Holo",
  1018: "Normal (Mewtwo 16)",
  1119: "1st Edition Holo",
  1287: "Love Ball Reverse Holo",
  1292: "Energy Reverse Holo",
};

const PSY = {"18995":[1],"19069":[363],"19153":[363],"19154":[363],"19165":[363],"19213":[363],"19214":[363],"19379":[1018],"19632":[1],"19756":[1],"22364":[1],"23248":[1],"25118":[4,1],"25234":[1],"25958":[4,1,383,2],"26717":[4,1],"27179":[4,1],"27904":[4,1],"28705":[4,1],"29001":[4,1],"29317":[1],"29667":[1],"29748":[1],"29842":[1],"29898":[1],"30842":[368],"32043":[368],"32640":[368],"34241":[1],"36405":[1,363],"37461":[1],"41547":[1,433,434],"41668":[363],"47494":[1],"47801":[1],"47850":[363],"48295":[368],"49936":[46],"51656":[4,1],"51906":[1,1292,1287],"52175":[363],"59207":[154]};
const DIT = {"18659":[363],"19227":[363],"20595":[363],"25145":[1119,363],"26007":[4,1,383,2],"26990":[4,1],"27945":[1,4],"27950":[1,4],"27962":[1,4],"27971":[1,4],"27984":[1,4],"27991":[1,4],"27999":[1,4],"28464":[1119,363],"28954":[1,4],"29703":[363],"29930":[363],"31600":[368],"32537":[368],"32900":[363],"32901":[363],"33083":[363],"33084":[363],"35402":[4,1],"38296":[363,385,384,386],"39687":[363],"39767":[363],"40540":[7],"41625":[363,433,434],"43527":[363],"43795":[363],"45607":[46],"47682":[1],"49671":[4,1],"51817":[1,4],"89829":[363]};

function expand(file, map) {
  const cards = JSON.parse(readFileSync(new URL(file, import.meta.url), "utf8"));
  if (cards.some((c) => String(c.id).includes("-"))) throw new Error(file + " already expanded");
  const out = [];
  for (const c of cards) {
    const vids = map[c.id] || [1];
    const primary = vids.includes(1) ? 1 : vids[0];
    const extras = vids.filter((v) => v !== primary);
    if (!extras.length) {
      out.push(c);
      continue;
    }
    const name = (id) => NAMES[id] || String(id);
    out.push({ ...c, set: `${c.set} · ${name(primary)}` });
    for (const v of extras) {
      out.push({ ...c, id: `${c.id}-${v}`, set: `${c.set} · ${name(v)}` });
    }
  }
  const missing = Object.keys(map).filter((id) => !cards.some((c) => c.id === id));
  if (missing.length) throw new Error(file + " missing " + missing);
  writeFileSync(new URL(file, import.meta.url), JSON.stringify(out, null, 2) + "\n");
  return out.length;
}

console.log("ok", expand("./cards.json", PSY), "psyduck", expand("./ditto.json", DIT), "ditto");
