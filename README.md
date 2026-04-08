# PhilOS

![PhilOS — Philosophers gathered around a round table](header.jpeg)

**Structured judgment for things that are hard to think about.**

Drop in a thing — get a lens report. Philosophy is the engine, not the UI.

---

## What It Does

Different philosophical traditions expose different failure modes. PhilOS applies them as **mental operators** — not personas, not quotes, not cosplay.

The system selects 3-4 relevant lenses per report, analyzes what each sees, surfaces tensions between them, and delivers a concrete judgment.

---

## The Lens Engine

Users see human-readable labels. Philosophy runs under the hood.

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

---

## Skill Structure

The analysis engine is built as a skill with a core workflow and reference files loaded on demand:

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

### How the skill works

1. **Classify** the problem: decision, ethics, conflict, identity/meaning, or power/institution
2. **Select** 2-4 lenses based on the category (defaults exist, overrides welcome)
3. **Analyze** what each lens sees, recommends, and where it overreaches
4. **Surface tensions** — where lenses agree, disagree, and what each sees that others miss
5. **Recommend** a concrete action with the strongest objection stated
6. **Acknowledge limits** — what the entire analysis may have missed

### Three core workflows

- **Decision Stress Test** — pressure-test a choice before committing
- **Ethics Review** — operational ethical analysis of a product, policy, or practice
- **Conflict Mediation** — identify the value-frame mismatch and translate between sides

Each workflow has detailed steps, lens selection overrides, and output format specs in `references/`.

---

## Design Principles

> The product is the report, not the conversation.

> Philosophy is the engine, not the UI.

> The useful version is not "an agent that talks like Nietzsche." It is "an agent that can apply Nietzsche's style of critique to a startup, a policy, a life decision, or a product."

---

## Further Reading

- [PRODUCT.md](PRODUCT.md) — product features, roadmap, entry points, report schema, positioning, and growth strategy
