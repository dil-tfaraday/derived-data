# Derived Data (Risk & Audit synthetic cohort) — value & strategy for product leaders

**Page type:** Strategy & positioning  
**Audience:** Product leadership, GTM, design partners, and cross-functional leads (not a technical implementation spec).  
**Related engineering docs:** [Risk & Audit synthetic cohort — program index](confluence-split/00-index.md) (object catalog and insight themes).

---

## Executive summary

**Derived Data** is our program to build **privacy-safe, Object Library–aligned synthetic organizations** so Risk & Audit product teams can **design, demo, and validate** peer-style insights **before** we depend on large volumes of real customer telemetry. A structured cohort lets us rehearse benchmarks (category exposure, control linkage, audit-universe patterns), train agents on realistic graphs, and align narratives to how practitioners actually work—without exposing any one customer’s data.

**Bottom line for leaders:** Faster learning cycles, clearer product stories for “vs peers,” and a governed path from **synthetic proof** to **production benchmarks** (e.g. Mirrorline-style peer data) under explicit provenance and UX labelling.

---

## Why this matters (value)

| Stakeholder need | How derived data helps |
| ---------------- | --------------------- |
| **Product & design** | Ship credible **charts, tables, and copy** for Risk Maestro, Risk Manager, and Audit Manager experiences without waiting for statistically dense real cohorts. |
| **Privacy & trust** | **No customer PII** in the default prototype path; synthetic orgs are clearly fictional. All in-product use of this material must remain **labelled as synthetic**. |
| **Object Library alignment** | One **stable domain contract** (auditable entities, risks, controls, audits, evidence, etc.) so generators, APIs, analytics, and UI stay in sync. |
| **Peer & segment narratives** | Profiles (sector, stage, geography, business model) support **“organizations like yours”** segmentation once cohort depth and stratification mature. |
| **AI & automation** | Rich **relationships** (risk ↔ control ↔ process ↔ audit ↔ evidence) support graph-style reasoning, evaluation datasets, and future **knowledge-augmented** insight layers—not decorative single scores. |

**Caution (set expectations):** Early extracts use a **small** number of organizations (on the order of ten). That is enough for **UX and directional** prototyping, not for claiming statistical significance. The strategy explicitly scales toward **much larger** synthetic populations for stable percentiles—see “Strategy” below.

---

## Strategy (how we win)

### 1. Synthetic first, production-grade later

We **prove the insight catalog and UX** on synthetic data with strict schema and quality gates, then **swap or blend** the data source toward governed peer or production-scale synthetic (e.g. Derived Data / Mirrorline direction) without redrawing every screen. The **Object Library** is the constant; the **cohort** is the variable.

### 2. Cohort quality is a product feature

Benchmarks only feel legitimate when the cohort behaves like **many independent firms**: stable identifiers (e.g. canonical risk topics), time depth (assessments over time), consistent **graph integrity** (links that traverse both ways), and narratives that do not contradict the numbers. Our roadmap (time series, topics, linkage quotas, audit realism, coherence, representativeness, testing depth, provenance) is **intentionally product-facing**—it defines what “good enough to ship” means for synthetic peer stories.

### 3. Instrument everything we want to say in product

The internal **dashboard prototype** in this repository aggregates each org and the cohort so we can **see** whether a promised insight (e.g. control linkage coverage, topic prevalence, audit effort proxies) is computable and legible. That same aggregation logic becomes a checklist for **what the product is allowed to claim** at each cohort maturity stage.

### 4. Governed demo and delivery

Password-protected hosting (e.g. Fly.io with HTTP Basic Auth, health checks, noindex) supports **controlled** executive and partner demos without public indexing. Engineering details live in the repo **README**; leaders only need to know: **access is gated and synthetic attribution is mandatory in copy.**

### 5. Knowledge + data (forward-looking)

Separately, we are building a **large GRC knowledge base (“GRC brain”)** to improve **interpretation** of synthetic (and eventually real) signals—methodology context, defensible language, and “what good looks like.” **Derived data remains the structured ground truth** for scores and links; the knowledge layer improves **which** insights we surface and **how** we explain them. Integration will be explicit when that component is ready in the workspace.

---

## What exists today (reference for leaders)

- **Synthetic extracts:** One folder per organization (`profile.json` + `risk_audit_data.json`), aligned to Object Library–style objects and relationships.
- **Aggregator + dashboard:** Builds cohort roll-ups and per-org views; supports enhanced fields (e.g. canonical topics, taxonomy, mitigating controls, assessment quarters) as the cohort evolves.
- **Authoring guidance:** Prompt and QA themes for closing gaps between “demo pretty” and “practitioner credible” (see cohort roadmap content and `docs/prompts/synthetic-cohort-full-enhancement.md` in the repo).

**Engineering source of truth:** [derived-data on GitHub](https://github.com/dil-tfaraday/derived-data) (path and visibility may vary by org).

---

## Decisions we are not making on this page

- Exact **commercial** packaging of peer benchmarks vs customer-only views.  
- **Mirrorline** (or successor) contract specifics—only that Derived Data is the **bridge** for product learning until those pipes are authoritative.  
- **Model vendors** and **retention** policies for any LLM used on top of this data—governed elsewhere; here we only require **synthetic labelling** and **no PII** in the default cohort path.

---

## Calls to action for product leaders

1. **Treat cohort maturity as a roadmap input** — which insights we ship in GA should map to documented thresholds (linkage %, time depth, stratification), not only to UI readiness.  
2. **Insist on synthetic attribution** in any customer-visible or partner-visible surface fed by this program until governance signs off otherwise.  
3. **Prioritize Object Library gaps** that block the **highest-value** peer stories (usually: stable topics, traversable graph, assessment history).  
4. **Use the prototype in crits** — select an org, walk object tabs, and ask whether a CAE or CRO would **trust** the comparison story; feed gaps back to data and design.

---

## Appendix — one-liner for slide decks

> **Derived Data** gives Risk & Audit a **privacy-safe synthetic peer cohort** on the **Object Library** model so we can **prove benchmarks and AI-assisted insights** before production data volume catches up—scaling from directional prototypes to **statistically meaningful** peer sets with explicit provenance and quality gates.

---

*Document version: align with repo when sharing; update “what exists today” as cohort size and integrations change.*
