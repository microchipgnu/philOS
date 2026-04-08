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
  if (!fs.existsSync(indexPath)) return null;
  return JSON.parse(fs.readFileSync(indexPath, "utf-8"));
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
