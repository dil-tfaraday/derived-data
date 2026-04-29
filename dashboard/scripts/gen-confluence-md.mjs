/**
 * One-off: emit Markdown for Confluence from objectLibraryModel.js
 * Run: node scripts/gen-confluence-md.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { OBJECT_LIBRARY_TABS, COHORT_ENHANCEMENTS_TAB } from "../src/objectLibraryModel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(__dirname, "../../docs/confluence-risk-audit-cohort.md");

let md = `# Risk & Audit synthetic cohort — program, data, Object Library, and insight catalog

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

`;

for (const t of OBJECT_LIBRARY_TABS) {
  md += `## ${t.title}\n\n`;
  md += `| | |\n| --- | --- |\n`;
  md += `| **Short label** | ${t.shortLabel} |\n`;
  md += `| **Object Library id** | ${t.id} |\n`;
  md += `| **Lens** | ${t.lens} |\n\n`;
  md += `${t.description}\n\n`;
  md += `### Example product insights\n\n`;
  for (const ins of t.insights) {
    md += `1. **${ins.title}**  \n   ${ins.body}\n\n`;
  }
  md += `---\n\n`;
}

md += `## Synthetic cohort and prompt enhancements (roadmap)\n\n`;
md += `${COHORT_ENHANCEMENTS_TAB.description}\n\n`;
md += `The following themes improve **credibility** of peer benchmarks for risk and audit professionals. Each includes practitioner value, prompt/generation focus, and concrete improvements.\n\n`;

for (const sec of COHORT_ENHANCEMENTS_TAB.enhancementSections) {
  md += `### ${sec.theme} *(priority: ${sec.priority})*\n\n`;
  md += `- **Why practitioners care:** ${sec.practitionerValue}\n`;
  md += `- **Prompt / generation focus:** ${sec.promptFocus}\n`;
  md += `- **Concrete improvements:**\n`;
  for (const line of sec.improvements) {
    md += `  - ${line}\n`;
  }
  md += `\n`;
}

md += `---

## Document control

| | |
| --- | --- |
| **Space** | Platform |
| **Related** | Derived Data Strategy — documentation hub; project repository |
| **Maintainer** | Risk & Audit product (update when cohort schema or insight catalog changes) |

`;

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, md, "utf8");
console.log("Wrote", out, md.length, "chars");
