const fs = require("fs");
const files = [
  ["希诺宁队", "tools/gcsim/configs/mavuika-xilonen-citlali-bennett.txt"],
  ["尼可砂糖队", "tools/gcsim/configs/mavuika-nicole-citlali-sucrose.txt"],
  ["爱可菲高配", "tools/gcsim/configs/mavuika-melt-c2.txt"],
];
for (const [name, f] of files) {
  const t = fs.readFileSync(f, "utf8");
  console.log("\n===" + name + "===");
  const chars = [...t.matchAll(/^([a-z]+) char[^\n]*cons=(\d+)/gim)];
  for (const m of chars) {
    const c = m[1];
    const cons = m[2];
    const w = t.match(new RegExp(c + ' add weapon="([^"]+)" refine=(\\d+)', "i"));
    const s = t.match(new RegExp(c + ' add set="([^"]+)" count=(\\d+)', "i"));
    console.log(
      c +
        ": C" +
        cons +
        " | " +
        (w ? w[1] + " R" + w[2] : "?") +
        " | " +
        (s ? s[1] + " " + s[2] + "件" : "?")
    );
  }
}
