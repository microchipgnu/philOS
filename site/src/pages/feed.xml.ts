import type { APIRoute } from "astro";
import { getAllReports, getReport } from "../lib/reports";

export const GET: APIRoute = () => {
  const all = getAllReports();
  const items = all
    .map(({ date, slug }) => {
      const r = getReport(date, slug);
      if (!r) return null;
      return r;
    })
    .filter(Boolean)
    .slice(0, 50);

  const site = "https://philos.vercel.app";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PhilOS</title>
    <description>Structured judgment for things that are hard to think about</description>
    <link>${site}</link>
    <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en</language>
${items
  .map(
    (r) => `    <item>
      <title>${escapeXml(r!.title)}</title>
      <description>${escapeXml(r!.brief.bottomLine)}</description>
      <link>${site}/report/${r!.date}/${r!.id}</link>
      <guid isPermaLink="true">${site}/report/${r!.date}/${r!.id}</guid>
      <pubDate>${new Date(r!.generatedAt).toUTCString()}</pubDate>
      <category>${r!.category}</category>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
