# Synthetic cohort — full enhancement generation prompt

Use this document as a **copy-paste prompt** (or split into system + user messages) for an LLM or human author generating **synthetic internal audit + ERM cohort** data aligned to the Object Library–style `risk_audit_data.json` layout used under `input_data/`. It targets **remaining** enhancements from the cohort roadmap; preserve fields the prototype already consumes.

---

## Role and goal

You are a senior data architect and prompt engineer for a **synthetic internal audit + ERM cohort** used in product prototypes. Each organization is a folder containing `profile.json` and `risk_audit_data.json` aligned to an **Object Library**–style schema (auditable entities, processes, objectives, risks, risk assessments, controls, control assessments, deficiencies, audits, audit plans, audit findings, evidence, requests, risk mitigation plans, audit risk assessments, standards, requirements, etc.).

Your task is to **author generation instructions and/or revised synthetic JSON** so that **all gaps below are closed**, while **preserving** fields the downstream prototype already consumes (for example `canonical_topic_id`, `topic_category`, `mitigating_control_ids`, entity `taxonomy`, `assessment_quarter`, `trend` / `velocity_indicator`, audit `rating`, `planned_audits`, `total_audit_hours`, evidence `linked_audit_ids` / `audit_id`, process `related_*`, objective `related_risk_ids`, etc.). Do not remove working fields; **extend** them.

---

## Output format (required)

1. **Cohort manifest** (one JSON file, e.g. `cohort_manifest.json`): `schema_version`, `generator_version`, `refresh_date_utc`, `organization_count`, `scenario_pack_id` (string), `known_limitations` (array of strings), `topic_dictionary_uri` or embedded `topic_dictionary` (id → definition, display label).
2. **Per-organization package**: same layout as today — `profile.json` + `risk_audit_data.json`.
3. **QA checklist** (markdown or JSON): boolean gates + numeric thresholds that a script can verify before merge.

---

## Baseline already in place (do not regress)

- Stable risk **topic keys** and richer **control linkage** (including mitigating).
- Entity **taxonomy** and assessment **time labels** where applicable.
- Sensible **audit effort** when budget hours missing (dates still populated).

If you regenerate data, these must remain **at least as strong** as the current `input_data/` drop.

---

## 1. Time series and velocity (HIGH — often still thin)

**Target:** Multiple **time-stamped** observations per scored object, not a single snapshot.

**Require:**

- For each **risk**: at least **4** `risk_assessment` rows over **≥12 months** (quarterly or semi-annual), same `parent_risk_id`, monotonic or explainable `as_of_date` / `assessment_quarter`, stable scale for inherent/residual if present on assessments or parent risk history.
- For each **audit_risk_assessment** (universe scoring): optional **history** array or repeated rows keyed by entity + **as-of** quarter (minimum 2 points per high-inherent entity if feasible).
- **Narrative alignment:** at least one **incident**, **remediation milestone**, or **mitigation plan** date that **supports** the latest `trend` / `velocity_indicator` label (short text reference is enough).

**QA:** % of risks with ≥4 assessments; % of assessments with valid ISO dates; no duplicate `(parent_risk_id, assessment_quarter)` unless explicitly a revision with `revision_of_id`.

---

## 2. Canonical topics and prevalence (HIGH — tighten)

**Target:** Reproducible prevalence and a **published dictionary**.

**Require:**

- Every risk has `canonical_topic_id` from a **closed catalog** (≤80 topics for the whole cohort). No two display titles that map to different ids for the same semantic theme (normalize “key person” variants).
- Ship **`topic_dictionary`** in manifest: id, label, definition, optional NACE/industry code.
- `taxonomy_codes` on risks optional but must **reference** dictionary codes when present.

**QA:** 100% risks have non-null `canonical_topic_id`; dictionary covers all ids used; Gini/HHI on topic distribution reported in manifest (no single topic >25% unless intentional).

---

## 3. Graph integrity and linkage quotas (HIGH)

**Target:** Traversable graph and **minimum coverage**.

**Set explicit minimums** (tune numbers to cohort size N):

- ≥**95%** of risks: non-empty **primary** control link array **or** `mitigating_control_ids` (combined).
- ≥**90%** of controls: ≥1 process link (`linked_process_ids` / `related_process_ids` as your schema uses).
- ≥**85%** of evidence: linked to **audit** and/or **control** (not orphaned).
- **Bidirectional consistency:** if risk R lists control C, then C must list R in its risk link array (same for process ↔ control ↔ risk where arrays exist).
- **Chains:** every **control_deficiency** links to a **control** and preferably a **control_assessment**; ≥70% link to an **audit_finding** where findings exist. **Requests** in “completed” state reference **evidence** ids.

**QA:** scriptable counts for each rule; fail the drop if any rule misses by >2%.

---

## 4. Audit universe realism — IIA-style (MEDIUM)

**Target:** Coherent lifecycle and materiality.

**Require:**

- Consistent **status** vocabulary across `audit_plan`, `audit`, `audit_risk_assessment` (document allowed enum in manifest).
- **Materiality coherence:** high-inherent ARA entities should skew toward audits with **higher** `budget_hours` or longer date span, **larger** team arrays, and **non-zero** findings more often than low-inherent entities (correlation > 0.2 Spearman acceptable for synthetic).
- **Factor reconciliation:** where `assessment_factors` / factor scores exist on ARA, include **sub-scores** that **approximately sum or weighted-sum** to displayed inherent score within documented tolerance (state formula in manifest).

**QA:** status enum violations = 0; materiality correlation reported.

---

## 5. Residuals, mitigation, and coherence (MEDIUM)

**Target:** No contradictory numbers vs narrative.

**Require:**

- **Invariant:** `residual_score` ≤ `inherent_score` everywhere they coexist; mitigation **target_residual** not more aggressive than narrative “stable/improving” unless explained.
- **risk_mitigation_plan:** budget and status **track** residual movement across the time series (at least directional agreement in 80% of plans).
- **control_assessment** outcomes: failures skew toward **higher** deficiency severity; **control_effectiveness** on risk_assessment **directionally agrees** with recent tests (document rule in manifest).

**QA:** invariant violations = 0; % directional agreement reported.

---

## 6. Representativeness of the cohort (MEDIUM)

**Target:** Stratified peers, not accidental clones.

**Require:**

- Declare **strata quotas** in manifest (sector × stage × geography band). Actual counts within **±10%** of quota unless documented deviation.
- Controlled **tail risk** rate: e.g. 5–10% of orgs include a “stressor” pack (major control failure narrative, regulatory first).
- **Linguistic diversity:** vary naming patterns, avoid repeated boilerplate phrases across orgs (checksum: max 30% of risk titles share a 4-gram with another org).

**QA:** quota table vs actual; tail rate in range.

---

## 7. Operational testing and evidence depth (MEDIUM)

**Target:** Believable testing and evidence.

**Require:**

- **control_assessment:** include mix of pass / partial / fail / exception with **short deviation** text tied to **automation_level** and **frequency**.
- **Evidence:** diversify `evidence_type` and `source_system` with **realistic pairs**; ≥40% non-PDF types if schema allows.
- **Retest:** after a failed test, **next_assessment_date** or equivalent within 90–180 days in ≥60% of failures.

**QA:** outcome distribution entropy above threshold; retest rule pass rate.

---

## 8. Provenance, versioning, and scenario packs (LOWER)

**Target:** Enterprise-safe consumption.

**Require:**

- `cohort_manifest.json` as above; `scenario_pack_id` one of: `balanced`, `healthcare_heavy`, `cross_border`, `high_ma`, `control_failure_tail` — pick one primary per generated bundle.
- **Known limitations** explicit (e.g. “no real market prices”, “synthetic incidents”).
- **Schema pin:** semantic version string matching your Object Library export.

**QA:** manifest required keys present; scenario pack matches stratification rules.

---

## Deliverables order

1. Updated **generation prompt** (system + user) that encodes all sections above as **hard constraints** and **QA thresholds**.
2. **`cohort_manifest.json`** + **`topic_dictionary`**.
3. Example **one organization** JSON diff showing new fields (time series, chains, manifest refs).
4. **QA script pseudocode** (language-agnostic) that fails CI if thresholds are missed.

Be concise in narrative fields but **strict** on structure, IDs, dates, and cross-references. Prefer **explicit IDs** over prose for all relationships.

---

## How to use

- Paste the **sections** (Role through Deliverables) into your generator chat as the main **user** task, or use **Role and goal** + **Output format** as a standing **system** prompt and the numbered sections as iterative **user** follow-ups.
- After generation, run `node dashboard/scripts/aggregate.mjs` (from repo root or `dashboard/`) and load the dashboard to validate aggregates.

This prompt complements the in-app **Cohort roadmap** copy in `dashboard/src/objectLibraryModel.js` (`COHORT_ENHANCEMENTS_TAB`).
