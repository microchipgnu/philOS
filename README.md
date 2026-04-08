# PhilOS

![PhilOS — Philosophers gathered around a round table](header.jpeg)

**Structured judgment for things that are hard to think about.**

Not a chatbot. A report generator for difficult thinking. Drop in a thing — get a lens report.

---

## Core Concept

The product is the report, not the conversation.

Different philosophical traditions are good at exposing different failure modes. A Stoic lens separates what you control from what you don't. A Kantian lens tests whether a rule is coherent. A Nietzschean lens uncovers hidden motives. These aren't personas — they're **mental operators** that run under the hood. Users never need to know which philosopher is speaking. They see the insight.

**Input:** URL, text, file, screenshot, transcript, or a decision.
**Output:** A one-page structured brief with 3-4 lenses and a final synthesis.
**No chat.**

---

## The Lens Engine

Users choose human-readable labels. Philosophy stays in the engine, not in the buttons.

| User sees | Engine applies |
|-----------|---------------|
| **Consequences** | Utilitarian |
| **Principles** | Kantian |
| **Character** | Aristotelian |
| **Power** | Foucauldian |
| **Hidden motives** | Nietzschean |
| **Attachment** | Buddhist |
| **Ownership** | Existentialist |
| **Noise vs signal** | Stoic |
| **Assumptions** | Socratic |
| **Responsibility** | Arendtian |
| **What works** | Pragmatist |

The system selects 3-4 relevant lenses per report. Users can override, but the default should be good enough that most don't.

---

## Three Entry Points

### 1. Analyze a public topic
Paste a news URL or choose a live topic. The system gathers multiple source summaries and produces a "judgment map" — what different lenses see in the same story.

### 2. Analyze a private artifact
Upload a doc, screenshot, deck, transcript, or pasted text. The system produces a structured critique. This is the stickiest use case — people bringing **their own object**: a company memo, a founder decision, a tweet thread, a policy proposal, a product spec, a relationship message, an investor email.

### 3. Analyze a decision
A short structured form instead of chat:
- What decision are you facing?
- What are the options?
- What matters most?
- Who is affected?
- Deadline?

Then generate the report.

---

## Report Schema

Every report follows the same structure. One page. Scannable in under 2 minutes.

### 1. What this is about
A crisp summary of the object.

### 2. Main lenses applied
Usually 3 or 4. Not 12.

### 3. What each lens sees
Very short, high signal. 3-5 sentences per lens.

### 4. Tensions between lenses
Where they disagree. This is the highest-value section.

### 5. Hidden assumptions
What the object smuggles in without stating it.

### 6. Judgment
A synthesized conclusion. Not "it depends" — a position.

### 7. What would change the judgment
The conditions under which the conclusion breaks. This makes it feel rigorous instead of theatrical.

---

## Report Templates

The home screen shows templates, not a prompt box:

- **Decision report** — stress-test a choice from multiple angles
- **Argument report** — map the logic, find the gaps
- **Conflict report** — identify the value-frame mismatch
- **Ethics review** — operational ethical analysis, not slogans
- **Narrative map** — how different perspectives frame the same event
- **Power analysis** — who benefits, what's normalized, what's hidden

---

## Product Modes

### Reader mode (v1)
User pastes a link. System generates a clean report page. Easiest to understand, easiest to build.

### Watchlist mode (v2)
User follows topics — "AI regulation," "founder burnout," "US-China." Gets periodic lens reports. This is where the news angle lives.

### Inbox mode (v3)
User forwards things into the system over time. The product becomes a personal "thinking inbox."

---

## v1 Scope

**Input:** URL, pasted text, file upload. That's it.

**Templates:** Decision, argument, conflict, ethics, power.

**Output:** One-page brief with 3-4 lenses and a final synthesis.

**Share:** Public link + export to PDF/image.

**No chat at all.**

---

## Input Methods (roadmap)

v1:
- Paste URL
- Paste text
- File upload (PDF, doc, image)

Later:
- Browser extension: "analyze this page"
- Mobile share sheet: "send to PhilOS"
- Email forward: send to a unique address
- Drag-and-drop file

---

## Growth

**Top-of-funnel:** "Today's lens reports" feed around live news and conflicts. Instantly legible and shareable. Good for screenshots on social media.

**Retention:** People bringing their own artifacts — memos, decisions, messages, specs. This is where habit forms.

**Distribution:** News angle is good for virality but shouldn't be the whole product. It's crowded and politically messy. The broader wedge is "lens reports for things people already share":

- "review this startup idea through 4 lenses"
- "analyze this investor memo"
- "analyze this policy proposal"
- "analyze this CEO message"
- "analyze this tweet thread"
- "analyze this breakup text"
- "analyze this product launch"

---

## Positioning

**Do not sell:**
- "philosophy for agents"
- "multi-agent debate"
- "chat with philosophers"

**Sell:**
- structured judgment for messy situations
- a report generator for difficult thinking
- upload any argument, decision, or event — get a multi-lens brief
- a judgment engine for things that are hard to think about

---

## Comparable Products

| Product | What it does | What PhilOS learns from it |
|---------|-------------|---------------------------|
| **Ground News** | Groups coverage of same story, shows framing and blindspots | Structured multi-perspective view of the same object |
| **NotebookLM** | Sources in, artifacts out (reports, briefings, podcasts) | Artifact-first, not chat-first |
| **Consensus** | Papers in, cited synthesis out | Source-grounded structured output |

The shared pattern: **bring a source, get a structured output.** Not "come chat with an AI."

---

## Skill Structure

The philosophical analysis engine is built as a Claude Code skill:

```
analysis/
├── SKILL.md                              # Core workflow + lens selection logic
└── references/
    ├── decision-stress-test.md           # Workflow: pressure-test decisions
    ├── ethics-review.md                  # Workflow: ethical analysis
    ├── conflict-mediation.md             # Workflow: value-frame mismatch resolution
    ├── lens-stoic.md                     # Separate control from noise
    ├── lens-aristotelian.md              # Find the balanced practical path
    ├── lens-kantian.md                   # Test principle consistency
    ├── lens-utilitarian.md               # Model outcome distribution
    ├── lens-nietzschean.md               # Uncover hidden motives
    ├── lens-buddhist.md                  # Reduce attachment and craving
    ├── lens-existentialist.md            # Force ownership and choice
    ├── lens-foucauldian.md               # Inspect power and incentives
    └── examples.md                       # 5 worked examples across domains
```

---

## Design Principles

> The product is the report, not the conversation.

> Philosophy is the engine, not the UI.

> The useful version is not "an agent that talks like Nietzsche." It is "an agent that can apply Nietzsche's style of critique to a startup, a policy, a life decision, or a product."
