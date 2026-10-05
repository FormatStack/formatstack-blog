import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const DEFAULT_SITE_URL = "https://blog.formatstack.com";
const DEFAULT_KEY_FILE = "AFDFAC705D0EB18C08ADF80F69371588.txt";
const MAX_URLS_PER_REQUEST = 10_000;

export function sitemapUrls(xml, expectedHost) {
  const urls = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) =>
      match[1]
        .trim()
        .replaceAll("&amp;", "&")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&quot;", '"')
        .replaceAll("&apos;", "'"),
    )
    .map((value) => new URL(value))
    .filter((url) => url.protocol === "https:" && url.host === expectedHost)
    .map((url) => url.toString());

  return [...new Set(urls)];
}

export function indexNowPayload(siteUrl, key, urls) {
  const site = new URL(siteUrl);
  return {
    host: site.host,
    key,
    keyLocation: new URL(`/${key}.txt`, site).toString(),
    urlList: urls,
  };
}

async function main() {
  const deployEnvironment = process.env.VERCEL_ENV ?? process.env.DEPLOY_ENV;
  if (deployEnvironment !== "production") {
    console.log("IndexNow: skipped outside a production deployment.");
    return;
  }

  const site = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL);
  const keyFile = process.env.INDEXNOW_KEY_FILE ?? DEFAULT_KEY_FILE;
  const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
  const keyPath = path.resolve(scriptDirectory, "..", "public", keyFile);
  const key = (await readFile(keyPath, "utf8")).trim();

  if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
    throw new Error(`IndexNow key in public/${keyFile} is invalid.`);
  }
  if (keyFile !== `${key}.txt`) {
    throw new Error(`IndexNow key file must be named ${key}.txt.`);
  }

  const sitemapUrl = new URL("/sitemap.xml", site);
  const sitemapResponse = await fetch(sitemapUrl, {
    headers: { "user-agent": "FormatStack-IndexNow/1.0" },
  });
  if (!sitemapResponse.ok) {
    throw new Error(`IndexNow could not read ${sitemapUrl}: HTTP ${sitemapResponse.status}.`);
  }

  const urls = sitemapUrls(await sitemapResponse.text(), site.host);
  if (urls.length === 0) {
    throw new Error(`IndexNow found no same-host HTTPS URLs in ${sitemapUrl}.`);
  }

  for (let offset = 0; offset < urls.length; offset += MAX_URLS_PER_REQUEST) {
    const batch = urls.slice(offset, offset + MAX_URLS_PER_REQUEST);
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(indexNowPayload(site, key, batch)),
    });

    if (response.status !== 200 && response.status !== 202) {
      const detail = (await response.text()).trim();
      throw new Error(
        `IndexNow rejected ${batch.length} URL(s): HTTP ${response.status}${detail ? ` — ${detail}` : ""}.`,
      );
    }

    console.log(`IndexNow: submitted ${batch.length} URL(s), HTTP ${response.status}.`);
  }
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    if (process.env.INDEXNOW_STRICT === "true") {
      console.error(`IndexNow: ${message}`);
      process.exitCode = 1;
      return;
    }
    console.warn(`IndexNow: ${message} The production deployment will continue.`);
  });
}
