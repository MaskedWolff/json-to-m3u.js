const fs = require("fs");
const https = require("https");

const JSON_URL =
  "https://raw.githubusercontent.com/kajju027/Jiohotstar-Events-Json/main/jiotv.json";
const OUTPUT_FILE = "jiotv.m3u";

https.get(JSON_URL, (res) => {
  let raw = "";

  res.on("data", (chunk) => (raw += chunk));

  res.on("end", () => {
    const parsed = JSON.parse(raw);

    // 🔥 UNIVERSAL extractor
    let channels = [];

    if (Array.isArray(parsed)) {
      channels = parsed;
    } else if (Array.isArray(parsed.data)) {
      channels = parsed.data;
    } else if (parsed.result && Array.isArray(parsed.result.channels)) {
      channels = parsed.result.channels;
    } else if (Array.isArray(parsed.channels)) {
      channels = parsed.channels;
    }

    console.log("Channels fetched:", channels.length);

    let m3u = "#EXTM3U\n";

    channels.forEach((ch) => {
      const name =
        ch.channel_name || ch.name || ch.title || ch.channel || "";
      const url =
        ch.stream_url || ch.url || ch.play_url || ch.m3u8 || "";
      const logo =
        ch.logo_url || ch.logo || ch.logoUrl || "";
      const group =
        ch.category_name || ch.category || ch.group || "JioTV";

      if (!name || !url) return;

      m3u += `#EXTINF:-1 tvg-name="${name}" tvg-logo="${logo}" group-title="${group}",${name}\n`;
      m3u += `${url}\n`;
    });

    fs.writeFileSync(OUTPUT_FILE, m3u);

    console.log("✅ M3U written successfully");
  });
}).on("error", (err) => {
  console.error("❌ Fetch error:", err);
  process.exit(1);
});
