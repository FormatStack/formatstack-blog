import assert from "node:assert/strict";
import test from "node:test";

import { indexNowPayload, sitemapUrls } from "./submit-indexnow.mjs";

test("reads, decodes, deduplicates, and host-scopes sitemap URLs", () => {
  const xml = `
    <urlset>
      <url><loc>https://blog.formatstack.com/</loc></url>
      <url><loc>https://blog.formatstack.com/a-post?x=1&amp;y=2</loc></url>
      <url><loc>https://blog.formatstack.com/a-post?x=1&amp;y=2</loc></url>
      <url><loc>https://example.com/not-ours</loc></url>
      <url><loc>http://blog.formatstack.com/not-https</loc></url>
    </urlset>`;

  assert.deepEqual(sitemapUrls(xml, "blog.formatstack.com"), [
    "https://blog.formatstack.com/",
    "https://blog.formatstack.com/a-post?x=1&y=2",
  ]);
});

test("builds a bulk IndexNow request tied to the production host", () => {
  assert.deepEqual(
    indexNowPayload("https://blog.formatstack.com", "ABC12345", [
      "https://blog.formatstack.com/a-post",
    ]),
    {
      host: "blog.formatstack.com",
      key: "ABC12345",
      keyLocation: "https://blog.formatstack.com/ABC12345.txt",
      urlList: ["https://blog.formatstack.com/a-post"],
    },
  );
});
