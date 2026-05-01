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

---

## Object insight pages

The sections below live on **child pages** under this page (one Object Library type or theme per page). Open each child for the full **definition** and **example product insights**.
