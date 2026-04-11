# Blindspot

![Blindspot](header.jpeg)

**See what you're missing.**

An automated daily news publication that surfaces what's hidden in plain sight: the assumptions everyone makes, the trade-offs nobody names, and the connections that link unrelated stories.

Live at [blindspot.news](https://blindspot.news).

---

## What It Does

Most news tells you what happened. Blindspot tells you what's underneath: the hidden bet, the real disagreement, the thing no one is saying, and who concretely pays.

Every brief is structured the same way:

| Section | What it shows |
|---------|--------------|
| **What happened** | Plain factual context, no analysis |
| **Bottom line** | One sharp judgment sentence — not a summary |
| **The hidden bet** | 2-3 assumptions the dominant narrative treats as settled but aren't |
| **The real disagreement** | The actual fork in the road, not the surface argument |
| **What no one is saying** | The obvious thing no major actor can afford to say out loud |
| **Who pays** | Specific groups, concrete mechanisms of harm, timeline |
| **Scenarios** | 3 plausible next states with the signal to watch for each |
| **What would change this** | The specific evidence that would make the bottom line wrong |
| **Prediction markets** | Live odds from Polymarket on questions the brief is about |

The analysis is informed by philosophical thinking (Kantian principle tests, Foucauldian power analysis, Nietzschean motive archaeology) but the output never names a philosopher or labels a framework. The frameworks are the engine, not the UI.

---

## Threads

After all stories for the day are written, the agent looks back across them and finds non-obvious connections:

- **Cause-effect chains** — "the SCOTUS tariff ruling weakened Trump's leverage, which shifted the Iran ceasefire terms, which gave Spain cover to dissent"
- **Hidden dependency webs** — actors connected through dependencies invisible in any single brief
- **Tension clusters** — multiple stories secretly about the same underlying question

Threads sit below the day's stories with directional links between briefs.

---

## Pipeline

```
Discover  →  Curate  →  Source  →  Markets  →  Analyze  →  Threads  →  Publish
```

Runs 4x daily via GitHub Actions:

1. **Discover** — Exa search across 5 topics (tech, politics, geopolitics, economy, society) + Twitter trends
2. **Curate** — Rank and select 5+ stories by genuine disagreement and stakes, ensure topic breadth
3. **Source** — Pull 3-5 diverse articles per story via Exa
4. **Markets** — Find related Polymarket odds before analysis (used as input, not just decoration)
5. **Analyze** — Apply the analysis skill, write the brief with all 8 sections, pick a cover image from the source articles
6. **Threads** — Read all briefs back and find cause-effect chains, dependency webs, and tension clusters
7. **Publish** — Write JSON files, validate, commit to repo, Vercel auto-deploys

The whole pipeline runs through OpenCode + the analysis skill + OpenRouter (Sonnet 4.6) + the Frames Registry for paid APIs.

---

## Monorepo Structure

```
blindspot/
├── skills/analysis/            # The analysis skill (SKILL.md + references)
├── site/                       # Astro static site (blindspot.news)
├── content/reports/            # Generated brief JSON, by date
├── .philos/prompt.md           # Agent prompt for the daily pipeline
├── .github/workflows/          # GitHub Actions cron (4x daily)
└── opencode.json               # OpenCode config (OpenRouter provider)
```

### The analysis skill

Located at `skills/analysis/`. Installable in any agent harness:

```bash
npx skills add https://github.com/microchipgnu/philos --skill analysis
```

The skill defines:
- **The workflow**: find the crux, pressure-test through 8 thinking angles, build the brief
- **The output format**: the 8 sections above with strict length constraints
- **Internal angles**: who controls the frame, what motive is disguised, what rule is bent, who bears invisible costs, what attachment distorts judgment, what good character would do, who is hiding behind "no choice," what incentive structure makes this predictable

The angles are the philosophical engine. They never appear in the output.

### The site

Astro static site, deployed to Vercel. Reads JSON from `content/reports/` at build time. Pages:

- `/` — today's briefs with hero story + grid
- `/day/[date]` — any day's briefs with prev/next navigation
- `/report/[date]/[slug]` — full brief page with all sections, cover image, related briefs, sources, prediction markets
- `/topic/[slug]` — all briefs sharing a tag
- `/actor/[slug]` — all briefs where a specific entity appears
- `/og/[date]/[slug].png` — dynamic OG images (satori + resvg)
- `/feed.xml` — RSS feed

Each day page has a connection graph (modal) showing how stories connect through shared actors and explicit thread links.

---

## Development

```bash
cd site && npm install && npx astro dev
```

To run the pipeline locally:

```bash
opencode run "$(cat .philos/prompt.md)"
```

Requires `OPENROUTER_API_KEY` and `AGENTWALLET_*` credentials in environment.

---

## Design Principles

> See what you're missing.

> The bottom line is a judgment, not a summary.

> Cut anything that isn't surprising.

> Every section must earn its place. If you have nothing genuinely insightful to say, delete it.

> Philosophy is the engine, not the UI. If the analysis is good, it doesn't need a brand.

> Take a position. "It depends" is not a judgment.

---

## Further Reading

- [PRODUCT.md](PRODUCT.md) — full product spec, roadmap, positioning, comparable products
- [skills/analysis/SKILL.md](skills/analysis/SKILL.md) — the analysis workflow
- [.philos/prompt.md](.philos/prompt.md) — the agent prompt that drives the daily pipeline
