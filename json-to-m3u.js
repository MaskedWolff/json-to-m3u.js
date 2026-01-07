const fs = require("fs");
const https = require("https");

const JSON_URL = "https://raw.githubusercontent.com/kajju027/Jiohotstar-Events-Json/main/jiotv.json";
const OUTPUT_FILE = "jiotv.m3u";

https.get(JSON_URL, res => {
  let data = "";

  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    const json = JSON.parse(data);

    let m3u = "#EXTM3U\n";

    json.forEach(ch => {
      m3u += `#EXTINF:-1 tvg-name="${ch.name}" tvg-logo="${ch.logo || ""}" group-title="${ch.category || "JioTV"}",${ch.name}\n`;
      m3u += `${ch.url}\n`;
    });

    fs.writeFileSync(OUTPUT_FILE, m3u);
    console.log("M3U generated successfully");
  });

}).on("error", err => {
  console.error("Error fetching JSON:", err);
});
