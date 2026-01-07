const fs = require("fs");
const https = require("https");

const JSON_URL = "https://raw.githubusercontent.com/kajju027/Jiohotstar-Events-Json/main/jiotv.json";
const OUTPUT_FILE = "jiotv.m3u";

https.get(JSON_URL, res => {
  let raw = "";

  res.on("data", chunk => raw += chunk);

  res.on("end", () => {
    const parsed = JSON.parse(raw);

    // ✅ ACTUAL ARRAY
    const channels = parsed.data || [];

    let m3u = "#EXTM3U\n";

    channels.forEach(ch => {
      if (!ch.stream_url) return;

      m3u += `#EXTINF:-1 tvg-name="${ch.channel_name}" tvg-logo="${ch.logo_url || ""}" group-title="${ch.category_name || "JioTV"}",${ch.channel_name}\n`;
      m3u += `${ch.stream_url}\n`;
    });

    fs.writeFileSync(OUTPUT_FILE, m3u);
    console.log(`✅ Generated ${channels.length} channels`);
  });

}).on("error", err => {
  console.error("❌ Fetch error:", err);
  process.exit(1);
});
