import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const testDir = path.join(root, "risk_and_audit_test");
const outDir = path.join(__dirname, "../public");
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
    audit_frequency: tally(ae, "audit_frequency"),
    risk_tier: tally(ae, "risk_tier"),
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
  put("audit_plan", aps.length, {}, {
    avg_milestones: mean(aps.map((p) => (Array.isArray(p.key_milestones) ? p.key_milestones.length : 0))),
  });

  const aud = raw.audits || [];
  const hours = aud.map((a) => Number(a.budget_hours)).filter((n) => !Number.isNaN(n));
  put("audit", aud.length, {
    status: tally(aud, "status"),
    audit_type: tally(aud, "audit_type"),
  }, {
    avg_budget_hours: mean(hours),
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
    (r) => (r.linked_control_ids && r.linked_control_ids.length) || (r.linked_controls && r.linked_controls.length)
  ).length;
  put("risk", risks.length, {
    category: tally(risks, "category"),
    status: tally(risks, "status"),
  }, {
    avg_inherent: mean(inh),
    avg_residual: mean(res),
    pct_with_linked_controls: risks.length ? round((100 * withCtrl) / risks.length, 0) : 0,
  });

  const ra = raw.risk_assessments || [];
  put("risk_assessment", ra.length, {
    trend: tally(ra, "trend"),
    assessment_type: tally(ra, "assessment_type"),
    control_effectiveness: tally(ra, "control_effectiveness"),
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
  }, {
    avg_linked_controls: mean(proc.map((p) => (Array.isArray(p.linked_control_ids) ? p.linked_control_ids.length : 0))),
    avg_linked_risks: mean(proc.map((p) => (Array.isArray(p.linked_risk_ids) ? p.linked_risk_ids.length : 0))),
  });

  const obj = raw.objectives || [];
  put("objective", obj.length, {
    category: tally(obj, "category"),
    status: tally(obj, "status"),
  }, {
    avg_linked_risks: mean(obj.map((o) => (Array.isArray(o.linked_risk_ids) ? o.linked_risk_ids.length : 0))),
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
  const withAudit = ev.filter((e) => e.linked_audit_ids && e.linked_audit_ids.length).length;
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
      .map((r) => ({
        name: r.name,
        category: r.category,
        inherent_score: r.inherent_score,
        residual_score: r.residual_score,
        trend: (riskAssessments.find((x) => x.parent_risk_id === r.risk_id) || {}).trend || null,
      })),
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
    "This interface explores how structured audit and risk objects—aligned to the shared Object Library—can power benchmarks and narrative insights when populated by synthetic peer organizations. Select an organization to compare its profile to the full synthetic cohort. Numbers are illustrative only and do not represent real customers.",
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
