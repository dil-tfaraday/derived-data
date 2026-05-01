/**
 * Object Library domain types (audit + D1P catalog alignment).
 * Each entry: one prototype tab — description and example insights only (no storage paths).
 */
export const OBJECT_LIBRARY_TABS = [
  {
    id: "auditable_entity",
    shortLabel: "Auditable entities",
    title: "Auditable entity",
    lens: "Audit universe",
    description:
      "Organizational areas, functions, processes, or systems in scope for internal audit. These objects anchor the audit universe: where coverage is planned, how often each area is reviewed, and how concentration compares across a synthetic peer cohort.",
    insights: [
      {
        title: "Coverage concentration vs peers",
        body: "Compare how many scoped areas sit in each review cadence (for example annual versus quarterly) relative to organizations of similar sector and stage, to spot over- or under-audited clusters.",
      },
      {
        title: "Risk-tiered universe balance",
        body: "When entities carry a tier label, show the share of the universe in critical versus medium tiers against peer percentiles to support CAE conversations on capacity and focus.",
      },
      {
        title: "Entity tree depth",
        body: "Use parent–child relationships between entities to illustrate structural complexity (subsidiaries, shared services, IT systems) versus peer simplicity — a lead-in to resourcing and rotation planning.",
      },
      {
        title: "Geography and business-unit spread",
        body: "Roll up taxonomy attributes into region or business-unit chips and benchmark diversity of footprint: useful for multi-entity groups comparing themselves to a synthetic international peer set.",
      },
      {
        title: "Emerging scope gaps",
        body: "Highlight entity types that appear frequently in the peer cohort but are absent or thin in the customer’s universe — a qualitative “universe gap” signal when synthetic peers are rich enough.",
      },
    ],
  },
  {
    id: "process",
    shortLabel: "Processes",
    title: "Process",
    lens: "Audit & risk linkage",
    description:
      "End-to-end business processes linked to risks and controls. Processes explain where risk materializes in operations and which controls sit on each value chain — essential for cross-object benchmarks.",
    insights: [
      {
        title: "Process-level control density",
        body: "For each process, count linked controls and compare to peer median for the same process family (for example revenue, privacy, product development) to show relatively over- or under-controlled flows.",
      },
      {
        title: "Risk hot processes",
        body: "Rank processes by number of linked high-inherent risks to surface “operational pressure points” versus peers who run similar process catalogs.",
      },
      {
        title: "Stale process review",
        body: "Use last-reviewed metadata to flag processes whose review date lags peers in the same industry slice — a hygiene insight before deep control testing.",
      },
      {
        title: "Cross-entity process reuse",
        body: "When processes link to multiple auditable entities, visualize shared process risk: one weak process may span several legal entities.",
      },
    ],
  },
  {
    id: "objective",
    shortLabel: "Objectives",
    title: "Objective",
    lens: "Strategy alignment",
    description:
      "Strategic or operational objectives with links to risks and entities. Objectives connect board-level intent to the risk register and show where execution is at risk relative to stated goals.",
    insights: [
      {
        title: "Objective health vs peer mix",
        body: "Compare the share of objectives marked at risk or off track against the cohort distribution to contextualize leadership reporting.",
      },
      {
        title: "Risk density per goal",
        body: "For each objective, show linked risk count and average inherent score versus peers with objectives in the same category (financial, operational, strategic).",
      },
      {
        title: "KPI surface for narrative",
        body: "Use embedded KPI names on objectives to generate natural-language summaries (“peers tracking similar EBITDA goals carry X more residual-heavy risks on average”).",
      },
      {
        title: "Entity spread of strategic bets",
        body: "Benchmark how many distinct auditable entities touch each strategic objective — a proxy for execution fragmentation.",
      },
    ],
  },
  {
    id: "risk",
    shortLabel: "Risks",
    title: "Risk",
    lens: "ERM register",
    description:
      "Enterprise risks with inherent and residual scoring, categories, owners, and links to entities and controls. This is the core register object for peer exposure benchmarks and mitigation coverage stories.",
    insights: [
      {
        title: "Category exposure benchmark",
        body: "Compare mean inherent score by risk category to synthetic peers in the same segment to answer “are we heavier on Financial or Compliance risk than comparable firms?”.",
      },
      {
        title: "Residual gap (mitigation headroom)",
        body: "Show inherent minus residual distribution versus peers to highlight where the register suggests strong versus weak mitigation effectiveness at a glance.",
      },
      {
        title: "Control linkage coverage",
        body: "Percent of risks with at least one linked control versus peer median — a simple coverage KPI before testing quality.",
      },
      {
        title: "Topic prevalence (“dogs not barking”)",
        body: "With normalized risk topics at scale, surface themes common in the peer cohort that are missing from the customer register; with free-text only, use category plus subcategory as a coarser signal.",
      },
      {
        title: "Top-of-register concentration",
        body: "Highlight the highest inherent risks and compare their titles or families to peer top-N lists for executive-ready “what keeps peers up at night” panels.",
      },
    ],
  },
  {
    id: "risk_assessment",
    shortLabel: "Risk assessments",
    title: "Risk assessment",
    lens: "ERM register",
    description:
      "Assessments attached to individual risks (distinct from audit-universe ARA). They capture likelihood, impact, rationale, control effectiveness opinion, and trend labels for periodic reviews.",
    insights: [
      {
        title: "Trend label mix vs peers",
        body: "Aggregate Stable, Improving, Deteriorating labels across the cohort and compare the selected organization’s mix — a snapshot until longitudinal history exists for true velocity.",
      },
      {
        title: "Assessment-type cadence",
        body: "Break down quarterly versus post-audit reviews and compare frequency to peers to support governance cadence recommendations.",
      },
      {
        title: "Rationale depth as signal",
        body: "When rationale text length or structure varies, use it lightly as a proxy for documentation maturity (with careful UX so it is not punitive).",
      },
      {
        title: "Control effectiveness opinion distribution",
        body: "Chart Strong versus Moderate effectiveness labels on assessments against peer baselines to complement numeric residual scores on the parent risk.",
      },
    ],
  },
  {
    id: "risk_mitigation_plan",
    shortLabel: "Mitigation plans",
    title: "Risk mitigation plan",
    lens: "ERM register",
    description:
      "Formal mitigation programs for risks: status, budgets, target residual scores, and planned actions. Ideal for peer comparisons of investment posture and execution stage.",
    insights: [
      {
        title: "Mitigation spend vs severity",
        body: "Relate budget allocated to parent risk inherent score and compare slope to peers — “do we invest like others at our risk level?”.",
      },
      {
        title: "Status pipeline",
        body: "Compare counts of Planned, In Progress, and Active plans versus cohort to show backlog versus execution culture.",
      },
      {
        title: "Target residual realism",
        body: "Contrast target residual score to current residual on the linked risk and show how often peers set aggressive versus conservative targets.",
      },
      {
        title: "Action-item load",
        body: "Average planned actions per plan versus peer median to illustrate granularity of mitigation design.",
      },
    ],
  },
  {
    id: "control",
    shortLabel: "Controls",
    title: "Control",
    lens: "ERM & audit testing",
    description:
      "Controls with type (preventive, detective, etc.), automation level, frequency, and links back to risks and processes. The backbone for control-mix and testing-outcome benchmarks.",
    insights: [
      {
        title: "Control-type mix benchmark",
        body: "Share of preventive versus detective versus corrective controls compared to peers in the same industry — indicates detection-heavy versus prevention-heavy cultures.",
      },
      {
        title: "Automation posture",
        body: "Benchmark automated versus manual controls for modernization narratives and resourcing discussions.",
      },
      {
        title: "Category-aligned control stacks",
        body: "For each risk category, show the dominant control categories peers deploy — useful for “what does good look like” pattern libraries.",
      },
      {
        title: "Evidence requirement intensity",
        body: "Average count of evidence requirements per control versus peer median as a proxy for documentation burden.",
      },
    ],
  },
  {
    id: "control_assessment",
    shortLabel: "Control assessments",
    title: "Control assessment",
    lens: "ERM & audit testing",
    description:
      "Operational test results for controls: pass or fail outcomes, tester, dates, and deviations. Primary source for peer control failure pressure and testing throughput views.",
    insights: [
      {
        title: "Peer pass / fail / partial mix",
        body: "Compare the organization’s distribution of test results to the full synthetic cohort to contextualize operational effectiveness (not statistical significance at small N).",
      },
      {
        title: "Failure hotspots by control type",
        body: "Join failures to control type to show which archetypes (for example detective analytics) fail more often in the peer set — seed for recommended design patterns.",
      },
      {
        title: "Retest cadence",
        body: "Use next assessment dates to visualize upcoming testing load versus peers.",
      },
      {
        title: "Deviation narrative mining",
        body: "Surface common themes in deviations noted when text is available — later an LLM-friendly panel with strict provenance.",
      },
    ],
  },
  {
    id: "control_deficiency",
    shortLabel: "Control deficiencies",
    title: "Control deficiency",
    lens: "ERM & audit testing",
    description:
      "Identified weaknesses linked to controls, with severity, remediation plans, and dates. Supports remediation velocity and severity benchmarking.",
    insights: [
      {
        title: "Severity mix vs peers",
        body: "Compare high versus medium deficiency counts to cohort distributions to frame remediation urgency.",
      },
      {
        title: "Open remediation aging",
        body: "When due dates exist, bucket open deficiencies by age versus peer patterns.",
      },
      {
        title: "Root-cause clustering",
        body: "Group deficiencies by root cause text or category to show systemic themes versus one-off failures.",
      },
      {
        title: "Linkage to findings",
        body: "Trace deficiencies to audit findings when linked to show audit-to-remediation chain completeness.",
      },
    ],
  },
  {
    id: "assessment_factor",
    shortLabel: "Assessment factors",
    title: "Assessment factor",
    lens: "Audit universe",
    description:
      "Dimensions used to score auditable entities in the audit risk assessment methodology (for example complexity, regulatory change velocity). Defines the rubric peers apply in the synthetic universe.",
    insights: [
      {
        title: "Factor-weight profile",
        body: "When weights exist, compare the organization’s methodology weights to peer aggregates to show relative emphasis on fraud versus change velocity, etc.",
      },
      {
        title: "Factor catalog breadth",
        body: "Count active factors versus peer median to illustrate methodology richness.",
      },
      {
        title: "Cross-factor correlation (advanced)",
        body: "At scale, explore which factors co-score high on the same entities — input to methodology design workshops.",
      },
      {
        title: "Scoring rubric drift",
        body: "Compare scoring criteria text or weight changes over versions to show methodology evolution versus peers who freeze rubrics longer.",
      },
    ],
  },
  {
    id: "assessment_method",
    shortLabel: "Assessment methods",
    title: "Assessment method",
    lens: "Audit universe",
    description:
      "Named audit techniques (substantive testing, walkthroughs, analytics) used when assessing controls. Enables methodology-mix benchmarks across synthetic internal audit functions.",
    insights: [
      {
        title: "Methodology catalog coverage",
        body: "Compare count of distinct methods in use versus peers as a proxy for toolkit maturity.",
      },
      {
        title: "Method pairing with control types",
        body: "When relationships exist, show which methods are most often applied to detective versus preventive controls in the peer set.",
      },
      {
        title: "Innovation narrative",
        body: "Highlight use of data analytics or continuous auditing methods versus traditional walkthrough share in the cohort.",
      },
      {
        title: "Procedure depth index",
        body: "Count documented procedure steps per method versus peer average to illustrate how prescriptive audit playbooks are.",
      },
    ],
  },
  {
    id: "audit_risk_assessment",
    shortLabel: "Audit risk assessments",
    title: "Audit risk assessment",
    lens: "Audit universe",
    description:
      "Formal ranking exercises for auditable entities: inherent and residual scores, factor-level scores, control effectiveness, and narrative rationale. This is the IIA-style universe scoring object.",
    insights: [
      {
        title: "Inherent versus residual scatter",
        body: "Plot entity-level inherent against residual with peer cloud to show mitigation lift relative to synthetic peers operating the same rubric.",
      },
      {
        title: "Control effectiveness vs inherent pressure",
        body: "Bubble size by effectiveness score highlights entities with high inherent but weak effectiveness — prioritization for chief audit executives.",
      },
      {
        title: "Factor score heatmaps",
        body: "When factor scores map to assessment factors, heatmap average scores per factor across entities versus peer cohort.",
      },
      {
        title: "Narrative quality for committees",
        body: "Surface rationale snippets for outlier entities (highest residual) to support audit committee storytelling with clear synthetic attribution.",
      },
    ],
  },
  {
    id: "audit_plan",
    shortLabel: "Audit plans",
    title: "Audit plan",
    lens: "Audit universe",
    description:
      "Plans for individual engagements: scope, methodology text, resource needs, milestones. Shows how internal audit intends to execute coverage before fieldwork.",
    insights: [
      {
        title: "Milestone density",
        body: "Average milestones per plan versus peers as a proxy for planning granularity.",
      },
      {
        title: "Resource mix",
        body: "Compare required role types (specialists versus generalists) aggregated across plans for staffing benchmarks.",
      },
      {
        title: "Scope breadth narrative",
        body: "Use scope descriptions in LLM-assisted summaries comparing thematic focus (revenue, privacy, IT) to peer plans.",
      },
      {
        title: "Approval timeliness",
        body: "Compare approval dates relative to planned fieldwork start to surface planning discipline versus synthetic peer norms.",
      },
    ],
  },
  {
    id: "audit",
    shortLabel: "Audits",
    title: "Audit",
    lens: "Audit universe",
    description:
      "Engagements with type, status, dates, scoped entities, and team composition. Central for workload, focus area, and lifecycle benchmarks.",
    insights: [
      {
        title: "Engagement status pipeline",
        body: "Compare planned, in progress, and closed mix to peers to show throughput and backlog health.",
      },
      {
        title: "Audit type portfolio",
        body: "Financial versus operational versus compliance share of engagements versus cohort — aligns leadership expectations to peer norms in synthetic data.",
      },
      {
        title: "Budget hours intensity",
        body: "When budget hours exist, benchmark total planned hours per entity in scope for resourcing conversations.",
      },
      {
        title: "Team size distribution",
        body: "Average audit team size per engagement versus peer median.",
      },
    ],
  },
  {
    id: "audit_finding",
    shortLabel: "Audit findings",
    title: "Audit finding",
    lens: "Audit universe",
    description:
      "Issues raised from audit work, with severity and links back to scope. Drives finding-rate and severity benchmarks and feeds remediation tracking.",
    insights: [
      {
        title: "Finding severity profile",
        body: "High versus medium versus low share compared to synthetic peers at similar engagement volume.",
      },
      {
        title: "Findings per engagement hour (proxy)",
        body: "Normalize finding counts to budget hours when both exist to compare “intensity of issues” versus peers.",
      },
      {
        title: "Thematic tagging",
        body: "Cluster finding titles or descriptions into themes for “what auditors flag most” in the peer cohort.",
      },
      {
        title: "Repeat finding watchlist",
        body: "When entities or processes repeat across findings, flag systemic recurrence compared to peer frequency of repeat themes.",
      },
    ],
  },
  {
    id: "standard_regulation",
    shortLabel: "Standards & regulations",
    title: "Standard / regulation",
    lens: "Compliance mapping",
    description:
      "External frameworks and regulations mapped into the compliance universe. Supports obligation coverage and framework-mix benchmarks.",
    insights: [
      {
        title: "Framework catalog breadth",
        body: "Count distinct frameworks in scope versus peers in the same sector slice.",
      },
      {
        title: "Regulatory density by region",
        body: "When geography attributes exist, compare regulatory object counts to footprint.",
      },
      {
        title: "Crosswalk to requirements",
        body: "When linked to requirements, show % of regulatory clauses with at least one downstream requirement object versus peer median.",
      },
      {
        title: "Certification vs policy-only posture",
        body: "Compare counts of standards marked certified versus compliant-in-policy to benchmark assurance depth.",
      },
    ],
  },
  {
    id: "requirement",
    shortLabel: "Requirements",
    title: "Requirement",
    lens: "Compliance mapping",
    description:
      "Specific obligations derived from standards, often with priority and status. Enables obligation backlog and completion benchmarks.",
    insights: [
      {
        title: "Priority backlog shape",
        body: "High versus medium priority counts compared to peers.",
      },
      {
        title: "Completion or status velocity",
        body: "When status fields exist, compare open versus satisfied obligation mix to cohort.",
      },
      {
        title: "Evidence attachment rate",
        body: "Share of requirements with linked evidence objects versus peer baseline for defensibility narratives.",
      },
      {
        title: "Control mapping density",
        body: "Average linked controls per requirement versus peers highlights how tightly obligations are operationalized.",
      },
    ],
  },
  {
    id: "evidence",
    shortLabel: "Evidence",
    title: "Evidence",
    lens: "Compliance mapping",
    description:
      "Artifacts collected for controls and audits: type, source system, collection dates, retention. Supports evidence maturity and audit readiness benchmarks.",
    insights: [
      {
        title: "Evidence-type mix",
        body: "Document versus certification versus data extract share compared to peers — indicates reliance on system extracts versus paper.",
      },
      {
        title: "Source-system diversity",
        body: "Count distinct source systems in the evidence catalog versus peer median for integration maturity stories.",
      },
      {
        title: "Retention horizon",
        body: "When retention dates exist, visualize how far evidence is retained versus policy norms in the synthetic set.",
      },
      {
        title: "Audit linkage rate",
        body: "Percent of evidence items linked to at least one audit versus peer — readiness for traceability.",
      },
    ],
  },
  {
    id: "request",
    shortLabel: "Requests",
    title: "Request",
    lens: "Compliance mapping",
    description:
      "Information requests issued during audits, with priority, status, due dates, and links to evidence received. Shows collaboration load and responsiveness.",
    insights: [
      {
        title: "Request completion rate",
        body: "Completed versus pending versus planned share compared to synthetic peers.",
      },
      {
        title: "Cycle time to evidence",
        body: "When request and completion dates exist, compare duration to peer median for responsiveness KPIs.",
      },
      {
        title: "High-priority backlog",
        body: "Count overdue high-priority requests versus cohort for escalation panels.",
      },
      {
        title: "Evidence closure linkage",
        body: "Share of completed requests that already cite received evidence objects versus open requests — audit readiness signal.",
      },
    ],
  },
];

/**
 * First tab in the dashboard: summarizes enhancements in the `input_data/` cohort and how the prototype uses them.
 * Not an Object Library domain type — no `insights`; App renders a dedicated highlights panel.
 */
export const WHATS_NEW_TAB = {
  id: "whats_new",
  shortLabel: "What's new",
  title: "Enhanced synthetic cohort",
  lens: "Data & prototype",
  description:
    "The current synthetic extract (`input_data/`) adds structured fields for peer benchmarks: canonical risk topics, richer graph links, entity taxonomy, time-banded assessments, and audit metadata that supports derived metrics when budget hours are missing. Aggregates refresh when you run the aggregate script; charts on other tabs read these fields automatically.",
  highlightSections: [
    {
      title: "Risk register",
      items: [
        {
          label: "Canonical topics",
          body: "`canonical_topic_id` and `topic_category` drive the first risk breakdown chart and the top-risks table so topic prevalence is stable across organizations.",
        },
        {
          label: "Control linkage",
          body: "Coverage counts include `mitigating_control_ids` as well as primary linked controls.",
        },
        {
          label: "Assessments",
          body: "`assessment_quarter`, dates, and `trend` / `velocity_indicator` feed assessment roll-ups and the risk snapshot column.",
        },
      ],
    },
    {
      title: "Audit universe",
      items: [
        {
          label: "Auditable entities",
          body: "`risk_tier` or `risk_rating`, plus `taxonomy` (e.g. region, business unit) and `audit_frequency` in breakdowns.",
        },
        {
          label: "Audits",
          body: "`rating` tallies; average effort uses `budget_hours` when present, otherwise an estimate from planned or actual start/end dates.",
        },
        {
          label: "Audit plans",
          body: "Milestones from `key_milestones` or `planned_audits`; averages include planned slots and `total_audit_hours` when populated.",
        },
      ],
    },
    {
      title: "Processes, objectives, evidence",
      items: [
        {
          label: "Processes",
          body: "Link density uses `related_control_ids` / `related_risk_ids` alongside legacy `linked_*` arrays; `maturity_level` is tallied.",
        },
        {
          label: "Objectives",
          body: "Category from `category` or `objective_type`; risk links include `related_risk_ids`.",
        },
        {
          label: "Evidence",
          body: "Audit linkage rate counts `linked_audit_ids` or a non-empty `audit_id`.",
        },
      ],
    },
  ],
};

/** Object library domain tabs plus the leading “What's new” overview tab. */
export const PROTOTYPE_OBJECT_TABS = [WHATS_NEW_TAB, ...OBJECT_LIBRARY_TABS];

/**
 * Final tab: not an Object Library type — guidance for improving synthetic cohorts and generation prompts.
 * Shape differs from domain tabs: uses enhancementSections instead of insights.
 */
export const COHORT_ENHANCEMENTS_TAB = {
  id: "synthetic_cohort_enhancements",
  shortLabel: "Cohort roadmap",
  title: "Synthetic cohort & prompt enhancements",
  lens: "Data quality for product",
  description:
    "Risk and audit professionals trust benchmarks when cohorts behave like many independent organizations: stable identifiers, time depth, consistent relationships, and defensible narratives. The suggestions below target both the structure of generated data and the instructions given to models that produce it—so downstream insights feel credible rather than decorative.",
  enhancementSections: [
    {
      priority: "High",
      theme: "Time series and velocity",
      practitionerValue:
        "Chief risk officers and audit leaders routinely ask whether exposure is worsening or improving—not just where it sits today.",
      promptFocus:
        "Require multiple dated observations per risk (and per auditable entity in audit risk assessments), not only a single assessment row.",
      improvements: [
        "Emit quarterly or semi-annual snapshots with consistent scoring scales so peer velocity and deceleration signals are computable.",
        "Align assessment dates with narrative events (e.g. remediation milestones, incidents) so trend labels can be validated against history.",
        "Include explicit “as-of” timestamps on every score-bearing object to support sliding-window cohort comparisons.",
      ],
    },
    {
      priority: "High",
      theme: "Canonical topics and prevalence",
      practitionerValue:
        "“What peers worry about that you do not” requires stable topic keys; free-text titles alone do not aggregate across thousands of organizations.",
      promptFocus:
        "Assign every generated risk a canonical topic identifier (and optional industry taxonomy codes) independent of display title wording.",
      improvements: [
        "Constrain title generation to a controlled vocabulary or post-normalize to a topic catalog so prevalence percentages are reproducible.",
        "Duplicate similar titles (“Key person” vs “Key personnel”) should collapse to one topic in analytics, even if marketing copy varies.",
        "Publish cohort-level topic dictionaries with definitions so product teams can label UI copy consistently with generation rules.",
      ],
    },
    {
      priority: "High",
      theme: "Graph integrity and linkage quotas",
      practitionerValue:
        "Mitigation effectiveness, control archetypes, and audit traceability all depend on traversing relationships reliably.",
      promptFocus:
        "Treat relationship completeness as a first-class acceptance criterion in generation prompts (minimum coverage rules per object type).",
      improvements: [
        "Enforce minimum percentages of risks with linked controls, controls with linked processes, and evidence linked to audits or controls.",
        "Validate bidirectional consistency (risk→control and control→risk) before export so graph queries never dead-end.",
        "Model deficiency-to-finding and request-to-evidence closure chains explicitly so remediation and fieldwork stories are end-to-end.",
      ],
    },
    {
      priority: "Medium",
      theme: "Audit universe realism (IIA-style)",
      practitionerValue:
        "Internal audit stakeholders expect universe scoring, plan depth, and engagement status to read as a coherent annual cycle.",
      promptFocus:
        "Describe lifecycle states (draft, in progress, completed) and transitions for audit risk assessments and engagements in the prompt.",
      improvements: [
        "Populate status and lifecycle fields consistently across audit plans, audits, and audit risk assessments.",
        "Correlate budget hours, team size, and finding counts so high-materiality engagements do not look like lightweight admin reviews.",
        "Generate factor-score matrices that mathematically reconcile to stated inherent and residual scores where rubrics allow.",
      ],
    },
    {
      priority: "Medium",
      theme: "Residuals, mitigation, and coherence",
      practitionerValue:
        "Users notice when residual scores, mitigation targets, and narratives contradict each other—credibility erodes quickly.",
      promptFocus:
        "Add a self-consistency pass: residual must not exceed inherent; target residual on plans should align with trajectory language.",
      improvements: [
        "Bind mitigation plan status and budgets to observable residual movement in the time series (even if subtly).",
        "Ensure control test outcomes correlate modestly with deficiency severity—random independence reads synthetic.",
        "Surface control effectiveness opinions on risk assessments that agree directionally with nearby control test results.",
      ],
    },
    {
      priority: "Medium",
      theme: "Representativeness of the cohort",
      practitionerValue:
        "Segment filters (sector, revenue band, geography) only work if the synthetic population is stratified, not an accidental cluster.",
      promptFocus:
        "Stratify generation quotas by segment in the prompt, then verify distributions in QA scripts before release.",
      improvements: [
        "Balance industries and company stages so no single sector dominates unless that is an intentional scenario pack.",
        "Inject tail scenarios (rare but plausible control failures, regulatory firsts) at controlled rates for stress-testing UX.",
        "Vary writing style and name patterns modestly to avoid “same author” artifacts that undermine trust at scale.",
      ],
    },
    {
      priority: "Medium",
      theme: "Operational testing and evidence depth",
      practitionerValue:
        "Operational testers care about frequency, automation, evidence types, and whether failures have plausible remediation paths.",
      promptFocus:
        "Ask models to justify test results with short deviation narratives tied to control design attributes (frequency, automation).",
      improvements: [
        "Diversify evidence types and source systems with realistic pairings (e.g. certifications vs operational extracts).",
        "Include partial passes and exceptions with documented follow-up actions rather than binary pass/fail only.",
        "Model retest dates after failures to demonstrate closure loops within the synthetic timeline.",
      ],
    },
    {
      priority: "Lower",
      theme: "Provenance, versioning, and governance",
      practitionerValue:
        "Enterprise buyers ask how synthetic data was produced, which schema version it obeys, and when it was refreshed.",
      promptFocus:
        "Embed non-PII provenance metadata in the cohort manifest: schema version, generator version, cohort slice, refresh date.",
      improvements: [
        "Pin each drop to an Object Library schema version so product and compliance can reason about field compatibility.",
        "Document known limitations (e.g. no real market events) in a cohort manifest consumers can display beside insights.",
        "Separate “scenario packs” (healthcare-heavy, cross-border, high M&A) so teams can opt into relevant peer sets.",
      ],
    },
  ],
};

/** Domain tabs plus “What's new”; cohort roadmap remains a separate hero toggle (see App). */
export const ALL_PROTOTYPE_TABS = PROTOTYPE_OBJECT_TABS;
