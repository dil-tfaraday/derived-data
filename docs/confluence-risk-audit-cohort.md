# Risk & Audit synthetic cohort — program, data, Object Library, and insight catalog

## Purpose and audience

This page documents the **Risk & Audit synthetic cohort** workstream: privacy-safe **synthetic organizations** used to prototype **peer benchmarks** and in-product insights for **Risk Maestro**, **Risk Manager**, and **Audit Manager** experiences. It aligns to the shared **Object Library** domain model (audit and Diligent One Platform catalog objects).

**Audience:** Risk & Audit product, engineering, data partners (including Mirrorline), and internal stakeholders evaluating Derived Data / synthetic peer use cases.

**Important:** Synthetic data is **not** customer production data. All insights shown in prototypes must be **labelled as synthetic** in product copy.

---

## Program context

- **Derived Data / Mirrorline strategy:** Risk & Audit is expected to consume **Mirrorline-style** synthetic peer data (or similar cohorts) to power directional benchmarks—for example category exposure, control patterns, and audit-universe signals—while governance and provenance remain explicit.
- **Object Library:** Domain objects (auditable entities, risks, controls, audits, evidence, etc.) provide a **stable contract** between generators, APIs, and product surfaces. The cohort described here is shaped to that contract so the same object types can drive both agent tooling and product analytics.

---

## What is in the cohort

Each **synthetic organization** includes:

- A **company profile** (sector, stage, geography, business model, portfolio context) used for cohort segmentation.
- A **connected graph** of Object Library–style objects: auditable entities, processes, objectives, risks and assessments, mitigation plans, controls and assessments, deficiencies, audit universe objects (factors, methods, ARA, plans, audits, findings), and compliance mapping (standards, requirements, evidence, requests).

Extracts used for early prototyping contain on the order of **ten** fully modeled organizations; production-scale cohorts target **thousands** of synthetic companies for stable percentile benchmarks.

---

## Prototype delivery (reference)

An internal **dashboard prototype** aggregates cohort metrics and illustrates charts per object type. A **password-protected** deployment model exists for Fly.io (HTTP Basic Auth, health check endpoint, noindex headers) so demos are not publicly crawlable.

**Source repository (engineering):** [derived-data on GitHub](https://github.com/dil-tfaraday/derived-data)

---

## Object types and insight catalog

The sections below mirror the **Object Library** types used in the cohort and prototype. For each type: **lens** (who cares), **definition**, then **example product insights**—patterns a Risk or Audit professional would find actionable when synthetic peer depth and segmentation are sufficient.

## Auditable entity

| | |
| --- | --- |
| **Short label** | Auditable entities |
| **Object Library id** | auditable_entity |
| **Lens** | Audit universe |

Organizational areas, functions, processes, or systems in scope for internal audit. These objects anchor the audit universe: where coverage is planned, how often each area is reviewed, and how concentration compares across a synthetic peer cohort.

### Example product insights

1. **Coverage concentration vs peers**  
   Compare how many scoped areas sit in each review cadence (for example annual versus quarterly) relative to organizations of similar sector and stage, to spot over- or under-audited clusters.

1. **Risk-tiered universe balance**  
   When entities carry a tier label, show the share of the universe in critical versus medium tiers against peer percentiles to support CAE conversations on capacity and focus.

1. **Entity tree depth**  
   Use parent–child relationships between entities to illustrate structural complexity (subsidiaries, shared services, IT systems) versus peer simplicity — a lead-in to resourcing and rotation planning.

1. **Geography and business-unit spread**  
   Roll up taxonomy attributes into region or business-unit chips and benchmark diversity of footprint: useful for multi-entity groups comparing themselves to a synthetic international peer set.

1. **Emerging scope gaps**  
   Highlight entity types that appear frequently in the peer cohort but are absent or thin in the customer’s universe — a qualitative “universe gap” signal when synthetic peers are rich enough.

---

## Process

| | |
| --- | --- |
| **Short label** | Processes |
| **Object Library id** | process |
| **Lens** | Audit & risk linkage |

End-to-end business processes linked to risks and controls. Processes explain where risk materializes in operations and which controls sit on each value chain — essential for cross-object benchmarks.

### Example product insights

1. **Process-level control density**  
   For each process, count linked controls and compare to peer median for the same process family (for example revenue, privacy, product development) to show relatively over- or under-controlled flows.

1. **Risk hot processes**  
   Rank processes by number of linked high-inherent risks to surface “operational pressure points” versus peers who run similar process catalogs.

1. **Stale process review**  
   Use last-reviewed metadata to flag processes whose review date lags peers in the same industry slice — a hygiene insight before deep control testing.

1. **Cross-entity process reuse**  
   When processes link to multiple auditable entities, visualize shared process risk: one weak process may span several legal entities.

---

## Objective

| | |
| --- | --- |
| **Short label** | Objectives |
| **Object Library id** | objective |
| **Lens** | Strategy alignment |

Strategic or operational objectives with links to risks and entities. Objectives connect board-level intent to the risk register and show where execution is at risk relative to stated goals.

### Example product insights

1. **Objective health vs peer mix**  
   Compare the share of objectives marked at risk or off track against the cohort distribution to contextualize leadership reporting.

1. **Risk density per goal**  
   For each objective, show linked risk count and average inherent score versus peers with objectives in the same category (financial, operational, strategic).

1. **KPI surface for narrative**  
   Use embedded KPI names on objectives to generate natural-language summaries (“peers tracking similar EBITDA goals carry X more residual-heavy risks on average”).

1. **Entity spread of strategic bets**  
   Benchmark how many distinct auditable entities touch each strategic objective — a proxy for execution fragmentation.

---

## Risk

| | |
| --- | --- |
| **Short label** | Risks |
| **Object Library id** | risk |
| **Lens** | ERM register |

Enterprise risks with inherent and residual scoring, categories, owners, and links to entities and controls. This is the core register object for peer exposure benchmarks and mitigation coverage stories.

### Example product insights

1. **Category exposure benchmark**  
   Compare mean inherent score by risk category to synthetic peers in the same segment to answer “are we heavier on Financial or Compliance risk than comparable firms?”.

1. **Residual gap (mitigation headroom)**  
   Show inherent minus residual distribution versus peers to highlight where the register suggests strong versus weak mitigation effectiveness at a glance.

1. **Control linkage coverage**  
   Percent of risks with at least one linked control versus peer median — a simple coverage KPI before testing quality.

1. **Topic prevalence (“dogs not barking”)**  
   With normalized risk topics at scale, surface themes common in the peer cohort that are missing from the customer register; with free-text only, use category plus subcategory as a coarser signal.

1. **Top-of-register concentration**  
   Highlight the highest inherent risks and compare their titles or families to peer top-N lists for executive-ready “what keeps peers up at night” panels.

---

## Risk assessment

| | |
| --- | --- |
| **Short label** | Risk assessments |
| **Object Library id** | risk_assessment |
| **Lens** | ERM register |

Assessments attached to individual risks (distinct from audit-universe ARA). They capture likelihood, impact, rationale, control effectiveness opinion, and trend labels for periodic reviews.

### Example product insights

1. **Trend label mix vs peers**  
   Aggregate Stable, Improving, Deteriorating labels across the cohort and compare the selected organization’s mix — a snapshot until longitudinal history exists for true velocity.

1. **Assessment-type cadence**  
   Break down quarterly versus post-audit reviews and compare frequency to peers to support governance cadence recommendations.

1. **Rationale depth as signal**  
   When rationale text length or structure varies, use it lightly as a proxy for documentation maturity (with careful UX so it is not punitive).

1. **Control effectiveness opinion distribution**  
   Chart Strong versus Moderate effectiveness labels on assessments against peer baselines to complement numeric residual scores on the parent risk.

---

## Risk mitigation plan

| | |
| --- | --- |
| **Short label** | Mitigation plans |
| **Object Library id** | risk_mitigation_plan |
| **Lens** | ERM register |

Formal mitigation programs for risks: status, budgets, target residual scores, and planned actions. Ideal for peer comparisons of investment posture and execution stage.

### Example product insights

1. **Mitigation spend vs severity**  
   Relate budget allocated to parent risk inherent score and compare slope to peers — “do we invest like others at our risk level?”.

1. **Status pipeline**  
   Compare counts of Planned, In Progress, and Active plans versus cohort to show backlog versus execution culture.

1. **Target residual realism**  
   Contrast target residual score to current residual on the linked risk and show how often peers set aggressive versus conservative targets.

1. **Action-item load**  
   Average planned actions per plan versus peer median to illustrate granularity of mitigation design.

---

## Control

| | |
| --- | --- |
| **Short label** | Controls |
| **Object Library id** | control |
| **Lens** | ERM & audit testing |

Controls with type (preventive, detective, etc.), automation level, frequency, and links back to risks and processes. The backbone for control-mix and testing-outcome benchmarks.

### Example product insights

1. **Control-type mix benchmark**  
   Share of preventive versus detective versus corrective controls compared to peers in the same industry — indicates detection-heavy versus prevention-heavy cultures.

1. **Automation posture**  
   Benchmark automated versus manual controls for modernization narratives and resourcing discussions.

1. **Category-aligned control stacks**  
   For each risk category, show the dominant control categories peers deploy — useful for “what does good look like” pattern libraries.

1. **Evidence requirement intensity**  
   Average count of evidence requirements per control versus peer median as a proxy for documentation burden.

---

## Control assessment

| | |
| --- | --- |
| **Short label** | Control assessments |
| **Object Library id** | control_assessment |
| **Lens** | ERM & audit testing |

Operational test results for controls: pass or fail outcomes, tester, dates, and deviations. Primary source for peer control failure pressure and testing throughput views.

### Example product insights

1. **Peer pass / fail / partial mix**  
   Compare the organization’s distribution of test results to the full synthetic cohort to contextualize operational effectiveness (not statistical significance at small N).

1. **Failure hotspots by control type**  
   Join failures to control type to show which archetypes (for example detective analytics) fail more often in the peer set — seed for recommended design patterns.

1. **Retest cadence**  
   Use next assessment dates to visualize upcoming testing load versus peers.

1. **Deviation narrative mining**  
   Surface common themes in deviations noted when text is available — later an LLM-friendly panel with strict provenance.

---

## Control deficiency

| | |
| --- | --- |
| **Short label** | Control deficiencies |
| **Object Library id** | control_deficiency |
| **Lens** | ERM & audit testing |

Identified weaknesses linked to controls, with severity, remediation plans, and dates. Supports remediation velocity and severity benchmarking.

### Example product insights

1. **Severity mix vs peers**  
   Compare high versus medium deficiency counts to cohort distributions to frame remediation urgency.

1. **Open remediation aging**  
   When due dates exist, bucket open deficiencies by age versus peer patterns.

1. **Root-cause clustering**  
   Group deficiencies by root cause text or category to show systemic themes versus one-off failures.

1. **Linkage to findings**  
   Trace deficiencies to audit findings when linked to show audit-to-remediation chain completeness.

---

## Assessment factor

| | |
| --- | --- |
| **Short label** | Assessment factors |
| **Object Library id** | assessment_factor |
| **Lens** | Audit universe |

Dimensions used to score auditable entities in the audit risk assessment methodology (for example complexity, regulatory change velocity). Defines the rubric peers apply in the synthetic universe.

### Example product insights

1. **Factor-weight profile**  
   When weights exist, compare the organization’s methodology weights to peer aggregates to show relative emphasis on fraud versus change velocity, etc.

1. **Factor catalog breadth**  
   Count active factors versus peer median to illustrate methodology richness.

1. **Cross-factor correlation (advanced)**  
   At scale, explore which factors co-score high on the same entities — input to methodology design workshops.

1. **Scoring rubric drift**  
   Compare scoring criteria text or weight changes over versions to show methodology evolution versus peers who freeze rubrics longer.

---

## Assessment method

| | |
| --- | --- |
| **Short label** | Assessment methods |
| **Object Library id** | assessment_method |
| **Lens** | Audit universe |

Named audit techniques (substantive testing, walkthroughs, analytics) used when assessing controls. Enables methodology-mix benchmarks across synthetic internal audit functions.

### Example product insights

1. **Methodology catalog coverage**  
   Compare count of distinct methods in use versus peers as a proxy for toolkit maturity.

1. **Method pairing with control types**  
   When relationships exist, show which methods are most often applied to detective versus preventive controls in the peer set.

1. **Innovation narrative**  
   Highlight use of data analytics or continuous auditing methods versus traditional walkthrough share in the cohort.

1. **Procedure depth index**  
   Count documented procedure steps per method versus peer average to illustrate how prescriptive audit playbooks are.

---

## Audit risk assessment

| | |
| --- | --- |
| **Short label** | Audit risk assessments |
| **Object Library id** | audit_risk_assessment |
| **Lens** | Audit universe |

Formal ranking exercises for auditable entities: inherent and residual scores, factor-level scores, control effectiveness, and narrative rationale. This is the IIA-style universe scoring object.

### Example product insights

1. **Inherent versus residual scatter**  
   Plot entity-level inherent against residual with peer cloud to show mitigation lift relative to synthetic peers operating the same rubric.

1. **Control effectiveness vs inherent pressure**  
   Bubble size by effectiveness score highlights entities with high inherent but weak effectiveness — prioritization for chief audit executives.

1. **Factor score heatmaps**  
   When factor scores map to assessment factors, heatmap average scores per factor across entities versus peer cohort.

1. **Narrative quality for committees**  
   Surface rationale snippets for outlier entities (highest residual) to support audit committee storytelling with clear synthetic attribution.

---

## Audit plan

| | |
| --- | --- |
| **Short label** | Audit plans |
| **Object Library id** | audit_plan |
| **Lens** | Audit universe |

Plans for individual engagements: scope, methodology text, resource needs, milestones. Shows how internal audit intends to execute coverage before fieldwork.

### Example product insights

1. **Milestone density**  
   Average milestones per plan versus peers as a proxy for planning granularity.

1. **Resource mix**  
   Compare required role types (specialists versus generalists) aggregated across plans for staffing benchmarks.

1. **Scope breadth narrative**  
   Use scope descriptions in LLM-assisted summaries comparing thematic focus (revenue, privacy, IT) to peer plans.

1. **Approval timeliness**  
   Compare approval dates relative to planned fieldwork start to surface planning discipline versus synthetic peer norms.

---

## Audit

| | |
| --- | --- |
| **Short label** | Audits |
| **Object Library id** | audit |
| **Lens** | Audit universe |

Engagements with type, status, dates, scoped entities, and team composition. Central for workload, focus area, and lifecycle benchmarks.

### Example product insights

1. **Engagement status pipeline**  
   Compare planned, in progress, and closed mix to peers to show throughput and backlog health.

1. **Audit type portfolio**  
   Financial versus operational versus compliance share of engagements versus cohort — aligns leadership expectations to peer norms in synthetic data.

1. **Budget hours intensity**  
   When budget hours exist, benchmark total planned hours per entity in scope for resourcing conversations.

1. **Team size distribution**  
   Average audit team size per engagement versus peer median.

---

## Audit finding

| | |
| --- | --- |
| **Short label** | Audit findings |
| **Object Library id** | audit_finding |
| **Lens** | Audit universe |

Issues raised from audit work, with severity and links back to scope. Drives finding-rate and severity benchmarks and feeds remediation tracking.

### Example product insights

1. **Finding severity profile**  
   High versus medium versus low share compared to synthetic peers at similar engagement volume.

1. **Findings per engagement hour (proxy)**  
   Normalize finding counts to budget hours when both exist to compare “intensity of issues” versus peers.

1. **Thematic tagging**  
   Cluster finding titles or descriptions into themes for “what auditors flag most” in the peer cohort.

1. **Repeat finding watchlist**  
   When entities or processes repeat across findings, flag systemic recurrence compared to peer frequency of repeat themes.

---

## Standard / regulation

| | |
| --- | --- |
| **Short label** | Standards & regulations |
| **Object Library id** | standard_regulation |
| **Lens** | Compliance mapping |

External frameworks and regulations mapped into the compliance universe. Supports obligation coverage and framework-mix benchmarks.

### Example product insights

1. **Framework catalog breadth**  
   Count distinct frameworks in scope versus peers in the same sector slice.

1. **Regulatory density by region**  
   When geography attributes exist, compare regulatory object counts to footprint.

1. **Crosswalk to requirements**  
   When linked to requirements, show % of regulatory clauses with at least one downstream requirement object versus peer median.

1. **Certification vs policy-only posture**  
   Compare counts of standards marked certified versus compliant-in-policy to benchmark assurance depth.

---

## Requirement

| | |
| --- | --- |
| **Short label** | Requirements |
| **Object Library id** | requirement |
| **Lens** | Compliance mapping |

Specific obligations derived from standards, often with priority and status. Enables obligation backlog and completion benchmarks.

### Example product insights

1. **Priority backlog shape**  
   High versus medium priority counts compared to peers.

1. **Completion or status velocity**  
   When status fields exist, compare open versus satisfied obligation mix to cohort.

1. **Evidence attachment rate**  
   Share of requirements with linked evidence objects versus peer baseline for defensibility narratives.

1. **Control mapping density**  
   Average linked controls per requirement versus peers highlights how tightly obligations are operationalized.

---

## Evidence

| | |
| --- | --- |
| **Short label** | Evidence |
| **Object Library id** | evidence |
| **Lens** | Compliance mapping |

Artifacts collected for controls and audits: type, source system, collection dates, retention. Supports evidence maturity and audit readiness benchmarks.

### Example product insights

1. **Evidence-type mix**  
   Document versus certification versus data extract share compared to peers — indicates reliance on system extracts versus paper.

1. **Source-system diversity**  
   Count distinct source systems in the evidence catalog versus peer median for integration maturity stories.

1. **Retention horizon**  
   When retention dates exist, visualize how far evidence is retained versus policy norms in the synthetic set.

1. **Audit linkage rate**  
   Percent of evidence items linked to at least one audit versus peer — readiness for traceability.

---

## Request

| | |
| --- | --- |
| **Short label** | Requests |
| **Object Library id** | request |
| **Lens** | Compliance mapping |

Information requests issued during audits, with priority, status, due dates, and links to evidence received. Shows collaboration load and responsiveness.

### Example product insights

1. **Request completion rate**  
   Completed versus pending versus planned share compared to synthetic peers.

1. **Cycle time to evidence**  
   When request and completion dates exist, compare duration to peer median for responsiveness KPIs.

1. **High-priority backlog**  
   Count overdue high-priority requests versus cohort for escalation panels.

1. **Evidence closure linkage**  
   Share of completed requests that already cite received evidence objects versus open requests — audit readiness signal.

---

## Synthetic cohort and prompt enhancements (roadmap)

Risk and audit professionals trust benchmarks when cohorts behave like many independent organizations: stable identifiers, time depth, consistent relationships, and defensible narratives. The suggestions below target both the structure of generated data and the instructions given to models that produce it—so downstream insights feel credible rather than decorative.

The following themes improve **credibility** of peer benchmarks for risk and audit professionals. Each includes practitioner value, prompt/generation focus, and concrete improvements.

### Time series and velocity *(priority: High)*

- **Why practitioners care:** Chief risk officers and audit leaders routinely ask whether exposure is worsening or improving—not just where it sits today.
- **Prompt / generation focus:** Require multiple dated observations per risk (and per auditable entity in audit risk assessments), not only a single assessment row.
- **Concrete improvements:**
  - Emit quarterly or semi-annual snapshots with consistent scoring scales so peer velocity and deceleration signals are computable.
  - Align assessment dates with narrative events (e.g. remediation milestones, incidents) so trend labels can be validated against history.
  - Include explicit “as-of” timestamps on every score-bearing object to support sliding-window cohort comparisons.

### Canonical topics and prevalence *(priority: High)*

- **Why practitioners care:** “What peers worry about that you do not” requires stable topic keys; free-text titles alone do not aggregate across thousands of organizations.
- **Prompt / generation focus:** Assign every generated risk a canonical topic identifier (and optional industry taxonomy codes) independent of display title wording.
- **Concrete improvements:**
  - Constrain title generation to a controlled vocabulary or post-normalize to a topic catalog so prevalence percentages are reproducible.
  - Duplicate similar titles (“Key person” vs “Key personnel”) should collapse to one topic in analytics, even if marketing copy varies.
  - Publish cohort-level topic dictionaries with definitions so product teams can label UI copy consistently with generation rules.

### Graph integrity and linkage quotas *(priority: High)*

- **Why practitioners care:** Mitigation effectiveness, control archetypes, and audit traceability all depend on traversing relationships reliably.
- **Prompt / generation focus:** Treat relationship completeness as a first-class acceptance criterion in generation prompts (minimum coverage rules per object type).
- **Concrete improvements:**
  - Enforce minimum percentages of risks with linked controls, controls with linked processes, and evidence linked to audits or controls.
  - Validate bidirectional consistency (risk→control and control→risk) before export so graph queries never dead-end.
  - Model deficiency-to-finding and request-to-evidence closure chains explicitly so remediation and fieldwork stories are end-to-end.

### Audit universe realism (IIA-style) *(priority: Medium)*

- **Why practitioners care:** Internal audit stakeholders expect universe scoring, plan depth, and engagement status to read as a coherent annual cycle.
- **Prompt / generation focus:** Describe lifecycle states (draft, in progress, completed) and transitions for audit risk assessments and engagements in the prompt.
- **Concrete improvements:**
  - Populate status and lifecycle fields consistently across audit plans, audits, and audit risk assessments.
  - Correlate budget hours, team size, and finding counts so high-materiality engagements do not look like lightweight admin reviews.
  - Generate factor-score matrices that mathematically reconcile to stated inherent and residual scores where rubrics allow.

### Residuals, mitigation, and coherence *(priority: Medium)*

- **Why practitioners care:** Users notice when residual scores, mitigation targets, and narratives contradict each other—credibility erodes quickly.
- **Prompt / generation focus:** Add a self-consistency pass: residual must not exceed inherent; target residual on plans should align with trajectory language.
- **Concrete improvements:**
  - Bind mitigation plan status and budgets to observable residual movement in the time series (even if subtly).
  - Ensure control test outcomes correlate modestly with deficiency severity—random independence reads synthetic.
  - Surface control effectiveness opinions on risk assessments that agree directionally with nearby control test results.

### Representativeness of the cohort *(priority: Medium)*

- **Why practitioners care:** Segment filters (sector, revenue band, geography) only work if the synthetic population is stratified, not an accidental cluster.
- **Prompt / generation focus:** Stratify generation quotas by segment in the prompt, then verify distributions in QA scripts before release.
- **Concrete improvements:**
  - Balance industries and company stages so no single sector dominates unless that is an intentional scenario pack.
  - Inject tail scenarios (rare but plausible control failures, regulatory firsts) at controlled rates for stress-testing UX.
  - Vary writing style and name patterns modestly to avoid “same author” artifacts that undermine trust at scale.

### Operational testing and evidence depth *(priority: Medium)*

- **Why practitioners care:** Operational testers care about frequency, automation, evidence types, and whether failures have plausible remediation paths.
- **Prompt / generation focus:** Ask models to justify test results with short deviation narratives tied to control design attributes (frequency, automation).
- **Concrete improvements:**
  - Diversify evidence types and source systems with realistic pairings (e.g. certifications vs operational extracts).
  - Include partial passes and exceptions with documented follow-up actions rather than binary pass/fail only.
  - Model retest dates after failures to demonstrate closure loops within the synthetic timeline.

### Provenance, versioning, and governance *(priority: Lower)*

- **Why practitioners care:** Enterprise buyers ask how synthetic data was produced, which schema version it obeys, and when it was refreshed.
- **Prompt / generation focus:** Embed non-PII provenance metadata in the cohort manifest: schema version, generator version, cohort slice, refresh date.
- **Concrete improvements:**
  - Pin each drop to an Object Library schema version so product and compliance can reason about field compatibility.
  - Document known limitations (e.g. no real market events) in a cohort manifest consumers can display beside insights.
  - Separate “scenario packs” (healthcare-heavy, cross-border, high M&A) so teams can opt into relevant peer sets.

---

## Document control

| | |
| --- | --- |
| **Space** | Platform |
| **Related** | Derived Data Strategy — documentation hub; project repository |
| **Maintainer** | Risk & Audit product (update when cohort schema or insight catalog changes) |

