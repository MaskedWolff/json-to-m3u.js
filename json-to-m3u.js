const fs = require("fs");

// input & output files
const inputFile = "jiotv.json";
const outputFile = "jiotv.m3u";

// read json
const json = JSON.parse(fs.readFileSync(inputFile, "utf8"));

// start m3u
let m3u = "#EXTM3U\n";

json.forEach(ch => {
  m3u += `#EXTINF:-1 tvg-id="${ch.id || ""}" tvg-name="${ch.name}" tvg-logo="${ch.logo || ""}" group-title="${ch.category || "JioTV"}",${ch.name}\n`;
  m3u += `${ch.url}\n`;
});

// save m3u
fs.writeFileSync(outputFile, m3u);

console.log("M3U file created successfully!");
