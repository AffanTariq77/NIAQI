// Simple test script to fetch Kajabi products using API key/secret
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

function loadEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const contents = fs.readFileSync(filePath, "utf8");
  contents.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  });
  return env;
}

async function main() {
  const repoRoot = path.resolve(__dirname);
  const envPath = path.join(repoRoot, ".env");
  const env = loadEnv(envPath);

  const token =
    process.env.KAJABI_API_TOKEN ||
    process.env.EXPO_PUBLIC_KAJABI_API_TOKEN ||
    env.KAJABI_API_TOKEN ||
    env.EXPO_PUBLIC_KAJABI_API_TOKEN;
  const key =
    process.env.KAJABI_API_KEY ||
    process.env.EXPO_PUBLIC_KAJABI_API_KEY ||
    env.EXPO_PUBLIC_KAJABI_API_KEY;
  const secret =
    process.env.KAJABI_API_SECRET ||
    process.env.EXPO_PUBLIC_KAJABI_API_SECRET ||
    env.EXPO_PUBLIC_KAJABI_API_SECRET;
  const base =
    process.env.KAJABI_BASE_URL ||
    env.KAJABI_BASE_URL ||
    "https://api.kajabi.com";

  if (!token && (!key || !secret)) {
    console.error(
      "No Kajabi credentials found. Set KAJABI_API_TOKEN (preferred) or KAJABI_API_KEY and KAJABI_API_SECRET in .env or the environment."
    );
    process.exit(1);
  }

  const url = `${base.replace(/\/$/, "")}/v1/products`;
  console.log("Fetching Kajabi products from", url);

  try {
    const headers = { Accept: "application/json" };
    if (token) headers.Authorization = "Bearer " + token;
    else
      headers.Authorization =
        "Basic " + Buffer.from(key + ":" + secret).toString("base64");

    const res = await fetch(url, { method: "GET", headers });

    console.log("Status:", res.status, res.statusText);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log("Response JSON:", JSON.stringify(json, null, 2));
    } catch (e) {
      console.log("Response Text:", text);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

main();
