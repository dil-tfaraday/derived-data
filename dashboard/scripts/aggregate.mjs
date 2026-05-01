import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const outDir = path.join(__dirname, "../public");

/** Directories under root that contain org folders with risk_audit_data.json (first match wins after env). */
const DATA_DIR_CANDIDATES = ["input_test", "input_data", "risk_and_audit_test"];

function orgFolderCount(dataRoot) {
  if (!fs.existsSync(dataRoot)) return 0;
  let n = 0;
  for (const d of fs.readdirSync(dataRoot, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    if (fs.existsSync(path.join(dataRoot, d.name, "risk_audit_data.json"))) n += 1;
  }
  return n;
}

function resolveSyntheticDataRoot(repoRoot) {
  const env = process.env.SYNTHETIC_DATA_DIR?.trim();
  if (env) {
    const p = path.isAbsolute(env) ? env : path.join(repoRoot, env);
    if (!fs.existsSync(p)) {
      throw new Error(`SYNTHETIC_DATA_DIR not found: ${p}`);
    }
    if (orgFolderCount(p) === 0) {
      throw new Error(`SYNTHETIC_DATA_DIR has no org folders with risk_audit_data.json: ${p}`);
    }
    return p;
  }
  for (const name of DATA_DIR_CANDIDATES) {
    const dir = path.join(repoRoot, name);
    if (orgFolderCount(dir) > 0) return dir;
  }
  return path.join(repoRoot, "risk_and_audit_test");
}

const testDir = resolveSyntheticDataRoot(root);
const outFile = path.join(outDir, "aggregate.json");

function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function round(n, d = 1) {
  if (n == null || Number.isNaN(n)) return 0;
  const p = 10 ** d;
  return Math.round(Number(n) * p) / p;
}

function tally(arr, field) {
  const o = {};
  for (const x of arr) {
    const v = x[field];
    const key = v == null || v === "" ? "Not specified" : String(v);
    o[key] = (o[key] || 0) + 1;
  }
  return o;
}

/** First non-empty array field length (supports legacy + enhanced synthetic shapes). */
function firstArrayLen(obj, ...fields) {
  for (const f of fields) {
    const a = obj[f];
    if (Array.isArray(a)) return a.length;
  }
  return 0;
}

function tallyEntityRating(ae) {
  const o = {};
  for (const e of ae) {
    const v = e.risk_tier ?? e.risk_rating;
    const key = v == null || v === "" ? "Not specified" : String(v);
    o[key] = (o[key] || 0) + 1;
  }
  return o;
}

function tallyTaxonomy(arr, pathFn) {
  const o = {};
  for (const x of arr) {
    const v = pathFn(x);
    const key = v == null || v === "" ? "Not specified" : String(v);
    o[key] = (o[key] || 0) + 1;
  }
  return o;
}

/** Approximate engagement hours from date span when budget_hours is absent (8h per calendar day). */
function auditSpanHours(a) {
  const bh = Number(a.budget_hours);
  if (!Number.isNaN(bh) && bh > 0) return bh;
  const start = a.actual_start_date || a.planned_start_date;
  const end = a.actual_end_date || a.planned_end_date;
  if (!start || !end) return NaN;
  const d0 = new Date(start).getTime();
  const d1 = new Date(end).getTime();
  if (Number.isNaN(d0) || Number.isNaN(d1) || d1 < d0) return NaN;
  return ((d1 - d0) / (1000 * 60 * 60 * 24)) * 8;
}

function mergeBreakdowns(target, source) {
  for (const [bk, buckets] of Object.entries(source || {})) {
    if (!target[bk]) target[bk] = {};
    for (const [k, v] of Object.entries(buckets)) {
      target[bk][k] = (target[bk][k] || 0) + v;
    }
  }
}

/** Per Object Library type: counts, categorical breakdowns, numeric averages for one organization */
function extractTypes(raw) {
  const types = {};
  const put = (id, count, breakdowns = {}, averages = {}) => {
    types[id] = {
      count,
      breakdowns,
      averages: Object.fromEntries(
        Object.entries(averages).map(([k, v]) => [k, typeof v === "number" ? round(v, 2) : v])
      ),
    };
  };

  const ae = raw.auditable_entities || [];
  put("auditable_entity", ae.length, {
    risk_tier: tallyEntityRating(ae),
    audit_frequency: tally(ae, "audit_frequency"),
    region: tallyTaxonomy(ae, (e) => e.taxonomy?.region),
    business_unit: tallyTaxonomy(ae, (e) => e.taxonomy?.business_unit),
  });

  const af = raw.assessment_factors || [];
  put("assessment_factor", af.length, {
    category: tally(af, "category"),
  });

  const ara = raw.audit_risk_assessments || [];
  const araInh = ara.map((a) => Number(a.inherent_risk_score)).filter((n) => !Number.isNaN(n));
  const araRes = ara.map((a) => Number(a.residual_risk_score)).filter((n) => !Number.isNaN(n));
  const araEff = ara.map((a) => Number(a.control_effectiveness_score)).filter((n) => !Number.isNaN(n));
  put("audit_risk_assessment", ara.length, {}, {
    avg_inherent: mean(araInh),
    avg_residual: mean(araRes),
    avg_effectiveness: mean(araEff),
  });

  const aps = raw.audit_plans || [];
  put("audit_plan", aps.length, {
    status: tally(aps, "status"),
  }, {
    avg_milestones: mean(
      aps.map((p) =>
        Array.isArray(p.key_milestones)
          ? p.key_milestones.length
          : Array.isArray(p.planned_audits)
            ? p.planned_audits.length
            : 0
      )
    ),
    avg_planned_audit_slots: mean(aps.map((p) => (Array.isArray(p.planned_audits) ? p.planned_audits.length : 0))),
    avg_total_plan_hours: (() => {
      const h = aps.map((p) => Number(p.total_audit_hours)).filter((n) => !Number.isNaN(n) && n > 0);
      return h.length ? mean(h) : 0;
    })(),
  });

  const aud = raw.audits || [];
  const hours = aud.map(auditSpanHours).filter((n) => !Number.isNaN(n) && n > 0);
  put("audit", aud.length, {
    status: tally(aud, "status"),
    audit_type: tally(aud, "audit_type"),
    rating: tally(aud, "rating"),
  }, {
    avg_budget_hours: hours.length ? mean(hours) : 0,
    avg_team_size: mean(aud.map((a) => (Array.isArray(a.audit_team) ? a.audit_team.length : 0))),
  });

  const fnd = raw.audit_findings || [];
  put("audit_finding", fnd.length, {
    severity: tally(fnd, "severity"),
  });

  const risks = raw.risks || [];
  const inh = risks.map((r) => Number(r.inherent_score)).filter((n) => !Number.isNaN(n));
  const res = risks.map((r) => Number(r.residual_score)).filter((n) => !Number.isNaN(n));
  const withCtrl = risks.filter(
    (r) =>
      firstArrayLen(r, "linked_control_ids", "mitigating_control_ids") > 0 ||
      firstArrayLen(r, "linked_controls") > 0
  ).length;
  put("risk", risks.length, {
    canonical_topic_id: tally(risks, "canonical_topic_id"),
    topic_category: tally(risks, "topic_category"),
    category: tally(risks, "category"),
    status: tally(risks, "status"),
  }, {
    avg_inherent: mean(inh),
    avg_residual: mean(res),
    pct_with_linked_controls: risks.length ? round((100 * withCtrl) / risks.length, 0) : 0,
  });

  const ra = raw.risk_assessments || [];
  put("risk_assessment", ra.length, {
    trend: tallyTaxonomy(ra, (x) => x.trend ?? x.velocity_indicator),
    assessment_type: tally(ra, "assessment_type"),
    control_effectiveness: tally(ra, "control_effectiveness"),
    assessment_quarter: tally(ra, "assessment_quarter"),
  });

  const rmp = raw.risk_mitigation_plans || [];
  const budgets = rmp.map((m) => Number(m.budget_allocated)).filter((n) => !Number.isNaN(n));
  put("risk_mitigation_plan", rmp.length, {
    status: tally(rmp, "status"),
  }, {
    avg_budget: mean(budgets),
    avg_planned_actions: mean(rmp.map((m) => (Array.isArray(m.planned_actions) ? m.planned_actions.length : 0))),
  });

  const ctrl = raw.controls || [];
  put("control", ctrl.length, {
    control_type: tally(ctrl, "control_type"),
    category: tally(ctrl, "category"),
    status: tally(ctrl, "status"),
    automation_level: tally(ctrl, "automation_level"),
  }, {
    avg_evidence_requirements: mean(
      ctrl.map((c) => (Array.isArray(c.evidence_requirements) ? c.evidence_requirements.length : 0))
    ),
  });

  const ca = raw.control_assessments || [];
  put("control_assessment", ca.length, {
    test_result: tally(ca, "test_result"),
  });

  const cd = raw.control_deficiencies || [];
  put("control_deficiency", cd.length, {
    severity: tally(cd, "severity"),
    status: tally(cd, "status"),
  });

  const proc = raw.processes || [];
  put("process", proc.length, {
    status: tally(proc, "status"),
    maturity_level: tally(proc, "maturity_level"),
  }, {
    avg_linked_controls: mean(proc.map((p) => firstArrayLen(p, "linked_control_ids", "related_control_ids"))),
    avg_linked_risks: mean(proc.map((p) => firstArrayLen(p, "linked_risk_ids", "related_risk_ids"))),
  });

  const obj = raw.objectives || [];
  put("objective", obj.length, {
    category: tallyTaxonomy(obj, (o) => o.category || o.objective_type),
    status: tally(obj, "status"),
  }, {
    avg_linked_risks: mean(obj.map((o) => firstArrayLen(o, "linked_risk_ids", "related_risk_ids"))),
  });

  const std = raw.standards_regulations || [];
  put("standard_regulation", std.length, {
    category: tally(std, "category"),
    jurisdiction: tally(std, "jurisdiction"),
    compliance_status: tally(std, "compliance_status"),
  });

  const req = raw.requirements || [];
  put("requirement", req.length, {
    compliance_status: tally(req, "compliance_status"),
  }, {
    avg_evidence_slots: mean(req.map((r) => (Array.isArray(r.evidence_required) ? r.evidence_required.length : 0))),
  });

  const ev = raw.evidence || [];
  const withAudit = ev.filter(
    (e) => firstArrayLen(e, "linked_audit_ids") > 0 || (e.audit_id != null && e.audit_id !== "")
  ).length;
  put("evidence", ev.length, {
    evidence_type: tally(ev, "evidence_type"),
    source_system: tally(ev, "source_system"),
  }, {
    pct_linked_audit: ev.length ? round((100 * withAudit) / ev.length, 0) : 0,
  });

  const rq = raw.requests || [];
  put("request", rq.length, {
    status: tally(rq, "status"),
    priority: tally(rq, "priority"),
  });

  const am = raw.assessment_methods || [];
  put("assessment_method", am.length, {
    category: tally(am, "category"),
  });

  return types;
}

function mergeCohortTypes(companiesTypes, orgCount) {
  const typeIds = new Set();
  for (const t of companiesTypes) {
    for (const id of Object.keys(t)) typeIds.add(id);
  }
  const roll = {};
  for (const id of typeIds) {
    roll[id] = {
      total_records: 0,
      breakdowns: {},
      /** Mean of per-organization averages (meaningful for scores) */
      averages_of_org_averages: {},
      _sum_avg: {},
      _n_avg: {},
    };
  }

  for (const orgTypes of companiesTypes) {
    for (const [id, pack] of Object.entries(orgTypes)) {
      const r = roll[id];
      r.total_records += pack.count;
      mergeBreakdowns(r.breakdowns, pack.breakdowns);
      for (const [ak, av] of Object.entries(pack.averages || {})) {
        if (typeof av === "number" && !Number.isNaN(av)) {
          r._sum_avg[ak] = (r._sum_avg[ak] || 0) + av;
          r._n_avg[ak] = (r._n_avg[ak] || 0) + 1;
        }
      }
    }
  }

  for (const id of typeIds) {
    const r = roll[id];
    for (const ak of Object.keys(r._sum_avg)) {
      const n = r._n_avg[ak] || 1;
      r.averages_of_org_averages[ak] = round(r._sum_avg[ak] / n, 2);
    }
    delete r._sum_avg;
    delete r._n_avg;
    r.avg_records_per_org = orgCount ? round(r.total_records / orgCount, 1) : 0;
  }
  return roll;
}

const companies = [];

if (!fs.existsSync(testDir)) {
  console.warn("Synthetic extract folder not found at", testDir);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    outFile,
    JSON.stringify({ error: "no data", companies: [], cohort: { organization_count: 0 }, type_rollups: {} })
  );
  process.exit(0);
}

console.log("Synthetic data root:", path.relative(root, testDir) || ".");

const dirs = fs
  .readdirSync(testDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const allAraPoints = [];

for (const folderName of dirs.sort()) {
  const dataPath = path.join(testDir, folderName, "risk_audit_data.json");
  const profilePath = path.join(testDir, folderName, "profile.json");
  if (!fs.existsSync(dataPath)) continue;

  const raw = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const profile = fs.existsSync(profilePath)
    ? JSON.parse(fs.readFileSync(profilePath, "utf8"))
    : { name: folderName, id: folderName.toLowerCase().replace(/\s+/g, "-") };

  const displayName = profile.name || folderName;
  const types = extractTypes(raw);

  for (const a of raw.audit_risk_assessments || []) {
    allAraPoints.push({
      organization: displayName,
      inherent: Number(a.inherent_risk_score) || 0,
      residual: Number(a.residual_risk_score) || 0,
      effectiveness: Number(a.control_effectiveness_score) || 0,
    });
  }

  const risks = raw.risks || [];
  const riskAssessments = raw.risk_assessments || [];
  const inherentScores = risks.map((r) => Number(r.inherent_score)).filter((n) => !Number.isNaN(n));
  const residualScores = risks.map((r) => Number(r.residual_score)).filter((n) => !Number.isNaN(n));

  const byCategory = {};
  for (const r of risks) {
    const cat = r.category || "Unknown";
    if (!byCategory[cat]) byCategory[cat] = { scores: [], count: 0 };
    byCategory[cat].count += 1;
    const s = Number(r.inherent_score);
    if (!Number.isNaN(s)) byCategory[cat].scores.push(s);
  }

  companies.push({
    key: profile.id || folderName,
    name: displayName,
    sector: profile.sector || "—",
    stage: profile.stage || "—",
    geography: profile.geography || "—",
    business_model: profile.business_model || "—",
    types,
    /** Legacy chart helpers */
    byCategory: Object.fromEntries(
      Object.entries(byCategory).map(([k, v]) => [k, { count: v.count, avg_inherent: round(mean(v.scores), 2) }])
    ),
    top_risks: risks
      .slice()
      .sort((a, b) => Number(b.inherent_score) - Number(a.inherent_score))
      .slice(0, 5)
      .map((r) => {
        const raRow = riskAssessments.find((x) => x.parent_risk_id === r.risk_id) || {};
        return {
          name: r.name,
          category: r.category,
          canonical_topic_id: r.canonical_topic_id ?? null,
          inherent_score: r.inherent_score,
          residual_score: r.residual_score,
          trend: raRow.trend ?? raRow.velocity_indicator ?? null,
        };
      }),
    metrics: {
      avg_inherent: round(mean(inherentScores), 2),
      avg_residual: round(mean(residualScores), 2),
    },
  });
}

const typeRollups = mergeCohortTypes(
  companies.map((c) => c.types),
  companies.length
);

const cohortRiskCat = {};
for (const c of companies) {
  for (const [cat, { count, avg_inherent }] of Object.entries(c.byCategory || {})) {
    if (!cohortRiskCat[cat]) cohortRiskCat[cat] = { sum: 0, w: 0 };
    cohortRiskCat[cat].sum += Number(avg_inherent) * count;
    cohortRiskCat[cat].w += count;
  }
}
const avg_inherent_by_risk_category = Object.fromEntries(
  Object.entries(cohortRiskCat).map(([k, v]) => [k, v.w ? round(v.sum / v.w, 2) : 0])
);

const payload = {
  generated_at: new Date().toISOString(),
  prototype_title: "Risk & Audit — synthetic peer intelligence prototype",
  prototype_summary:
    "This interface explores how structured audit and risk objects—aligned to the shared Object Library—can power benchmarks and narrative insights when populated by synthetic peer organizations. The cohort includes enhanced linkage metadata (canonical risk topics, taxonomy on auditable entities, mitigating controls, time-bounded assessments). Select an organization to compare its profile to the full synthetic cohort. Numbers are illustrative only and do not represent real customers.",
  cohort: {
    organization_count: companies.length,
    type_rollups: typeRollups,
    avg_inherent_by_risk_category,
  },
  companies,
  ara_scatter: allAraPoints,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(payload, null, 0));
console.log("Wrote aggregate for", companies.length, "organizations");
