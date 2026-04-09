import { getDayIndex, getReport, type Report } from "./reports";

export interface GraphNode {
  id: string;
  label: string;
  type: "report" | "actor" | "tag";
  category?: string;
  topic?: string;
  url?: string;
  weight: number; // number of connections
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "appears-in" | "shared-tag" | "shared-actor";
  weight: number;
}

export interface DayGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function buildDayGraph(date: string): DayGraph | null {
  const index = getDayIndex(date);
  if (!index || index.reports.length < 2) return null;

  const reports: Report[] = [];
  for (const r of index.reports) {
    const full = getReport(date, r.id);
    if (full) reports.push(full);
  }

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();

  // Add report nodes
  for (const r of reports) {
    const rid = `report:${r.id}`;
    nodes.push({
      id: rid,
      label: r.title.length > 50 ? r.title.slice(0, 47) + "..." : r.title,
      type: "report",
      category: r.category,
      topic: r.topic,
      url: `/report/${date}/${r.id}`,
      weight: 0,
    });
    nodeIds.add(rid);
  }

  // Extract actors from whoPays and find shared ones
  const actorToReports = new Map<string, string[]>();
  for (const r of reports) {
    for (const wp of r.brief.whoPays || []) {
      const actorKey = wp.who.toLowerCase().trim();
      if (!actorToReports.has(actorKey)) actorToReports.set(actorKey, []);
      actorToReports.get(actorKey)!.push(r.id);
    }
  }

  // Only include actors that appear in 2+ reports (connections)
  for (const [actorKey, reportIds] of actorToReports) {
    if (reportIds.length < 2) continue;
    const aid = `actor:${actorKey}`;
    const originalName = reports
      .flatMap((r) => r.brief.whoPays || [])
      .find((wp) => wp.who.toLowerCase().trim() === actorKey)?.who || actorKey;

    nodes.push({
      id: aid,
      label: originalName.length > 40 ? originalName.slice(0, 37) + "..." : originalName,
      type: "actor",
      weight: reportIds.length,
    });
    nodeIds.add(aid);

    for (const rid of reportIds) {
      edges.push({
        source: `report:${rid}`,
        target: aid,
        type: "appears-in",
        weight: 1,
      });
    }
  }

  // Find shared tags between reports
  const tagToReports = new Map<string, string[]>();
  for (const r of reports) {
    for (const tag of r.tags || []) {
      const tagKey = tag.toLowerCase().trim();
      if (!tagToReports.has(tagKey)) tagToReports.set(tagKey, []);
      tagToReports.get(tagKey)!.push(r.id);
    }
  }

  // Add tag nodes for tags shared across 2+ reports
  for (const [tagKey, reportIds] of tagToReports) {
    if (reportIds.length < 2) continue;
    const tid = `tag:${tagKey}`;
    const originalTag = reports
      .flatMap((r) => r.tags || [])
      .find((t) => t.toLowerCase().trim() === tagKey) || tagKey;

    nodes.push({
      id: tid,
      label: originalTag,
      type: "tag",
      weight: reportIds.length,
    });
    nodeIds.add(tid);

    for (const rid of reportIds) {
      edges.push({
        source: `report:${rid}`,
        target: tid,
        type: "shared-tag",
        weight: 1,
      });
    }
  }

  // Update report node weights
  for (const node of nodes) {
    if (node.type === "report") {
      node.weight = edges.filter(
        (e) => e.source === node.id || e.target === node.id
      ).length;
    }
  }

  // Only return if there are actual connections
  if (edges.length === 0) return null;

  return { nodes, edges };
}
