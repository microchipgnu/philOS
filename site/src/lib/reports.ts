import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.resolve(process.cwd(), "../content/reports");

export interface Source {
  url: string;
  publisher: string;
  angle: string;
}

export interface HiddenBet {
  assumption: string;
  whyItMightBeWrong: string;
}

export interface WhoPays {
  who: string;
  how: string;
  when: string;
}

export interface Scenario {
  name: string;
  whatHappens: string;
  signal: string;
}

export interface Brief {
  bottomLine: string;
  hiddenBets: HiddenBet[];
  realDisagreement: string;
  whatNoOneIsSaying?: string;
  whoPays: WhoPays[];
  scenarios: Scenario[];
  whatWouldChange: string;
}

export interface Report {
  id: string;
  date: string;
  generatedAt: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  sources: Source[];
  brief: Brief;
}

export interface DayIndex {
  date: string;
  generatedAt: string;
  reports: { id: string; title: string; subtitle: string; category: string }[];
}

export interface ReportRef {
  date: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
}

// --- Core data access ---

export function getDays(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse();
}

export function getDayIndex(date: string): DayIndex | null {
  const indexPath = path.join(CONTENT_DIR, date, "index.json");
  if (fs.existsSync(indexPath)) {
    return JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  }

  // Fallback: build index from individual JSON files
  const dayDir = path.join(CONTENT_DIR, date);
  if (!fs.existsSync(dayDir)) return null;

  const files = fs.readdirSync(dayDir).filter((f) => f.endsWith(".json") && f !== "index.json");
  if (files.length === 0) return null;

  const reports = files.map((f) => {
    const data = JSON.parse(fs.readFileSync(path.join(dayDir, f), "utf-8"));
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      category: data.category,
    };
  });

  return { date, generatedAt: new Date().toISOString(), reports };
}

export function getReport(date: string, slug: string): Report | null {
  const reportPath = path.join(CONTENT_DIR, date, `${slug}.json`);
  if (!fs.existsSync(reportPath)) return null;
  return JSON.parse(fs.readFileSync(reportPath, "utf-8"));
}

export function getLatestDay(): DayIndex | null {
  const days = getDays();
  if (days.length === 0) return null;
  return getDayIndex(days[0]);
}

export function getAllReports(): { date: string; slug: string }[] {
  const days = getDays();
  const all: { date: string; slug: string }[] = [];
  for (const date of days) {
    const index = getDayIndex(date);
    if (!index) continue;
    for (const r of index.reports) {
      all.push({ date, slug: r.id });
    }
  }
  return all;
}

// --- Graph layer ---

let _allReportsCache: Report[] | null = null;

function loadAllReports(): Report[] {
  if (_allReportsCache) return _allReportsCache;
  const reports: Report[] = [];
  for (const { date, slug } of getAllReports()) {
    const r = getReport(date, slug);
    if (r) reports.push(r);
  }
  _allReportsCache = reports;
  return reports;
}

function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-");
}

export function getRelatedBriefs(report: Report, limit = 4): ReportRef[] {
  const all = loadAllReports();
  const myTags = new Set(report.tags.map(normalizeTag));
  const myActors = new Set(report.brief.whoPays.map((w) => w.who.toLowerCase()));

  const scored: { report: Report; score: number }[] = [];

  for (const other of all) {
    if (other.id === report.id && other.date === report.date) continue;

    let score = 0;
    // Shared tags
    for (const tag of other.tags) {
      if (myTags.has(normalizeTag(tag))) score += 2;
    }
    // Shared actors
    for (const wp of other.brief.whoPays) {
      if (myActors.has(wp.who.toLowerCase())) score += 3;
    }
    // Same category
    if (other.category === report.category) score += 1;

    if (score > 0) {
      scored.push({ report: other, score });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => ({
      date: s.report.date,
      slug: s.report.id,
      title: s.report.title,
      subtitle: s.report.subtitle,
      category: s.report.category,
    }));
}

export interface TagInfo {
  tag: string;
  slug: string;
  count: number;
  briefs: ReportRef[];
}

export function getAllTags(): TagInfo[] {
  const all = loadAllReports();
  const tagMap = new Map<string, Report[]>();

  for (const r of all) {
    for (const tag of r.tags) {
      const norm = normalizeTag(tag);
      if (!tagMap.has(norm)) tagMap.set(norm, []);
      tagMap.get(norm)!.push(r);
    }
  }

  return Array.from(tagMap.entries())
    .map(([slug, reports]) => ({
      tag: reports[0].tags.find((t) => normalizeTag(t) === slug) || slug,
      slug,
      count: reports.length,
      briefs: reports.map((r) => ({
        date: r.date,
        slug: r.id,
        title: r.title,
        subtitle: r.subtitle,
        category: r.category,
      })),
    }))
    .sort((a, b) => b.count - a.count);
}

export function getTag(slug: string): TagInfo | null {
  return getAllTags().find((t) => t.slug === slug) || null;
}

export interface ActorInfo {
  name: string;
  slug: string;
  appearances: {
    date: string;
    reportSlug: string;
    title: string;
    how: string;
    when: string;
  }[];
}

export function getAllActors(): ActorInfo[] {
  const all = loadAllReports();
  const actorMap = new Map<string, ActorInfo["appearances"]>();
  const actorNames = new Map<string, string>();

  for (const r of all) {
    for (const wp of r.brief.whoPays) {
      const slug = wp.who.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (!actorMap.has(slug)) actorMap.set(slug, []);
      actorNames.set(slug, wp.who);
      actorMap.get(slug)!.push({
        date: r.date,
        reportSlug: r.id,
        title: r.title,
        how: wp.how,
        when: wp.when,
      });
    }
  }

  return Array.from(actorMap.entries())
    .map(([slug, appearances]) => ({
      name: actorNames.get(slug)!,
      slug,
      appearances,
    }))
    .sort((a, b) => b.appearances.length - a.appearances.length);
}

export function getActor(slug: string): ActorInfo | null {
  return getAllActors().find((a) => a.slug === slug) || null;
}
