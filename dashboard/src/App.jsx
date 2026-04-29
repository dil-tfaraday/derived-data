import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { OBJECT_LIBRARY_TABS, COHORT_ENHANCEMENTS_TAB } from "./objectLibraryModel.js";

function breakdownToChart(breakdowns, key, limit = 12) {
  const b = breakdowns?.[key];
  if (!b) return [];
  return Object.entries(b)
    .map(([name, value]) => ({ name: name.length > 22 ? `${name.slice(0, 20)}…` : name, fullName: name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function TypeTabPanel({ tab, selected, cohortRollup, cohort, scatter }) {
  const t = selected?.types?.[tab.id];
  const r = cohortRollup?.[tab.id];
  if (!t && !r) {
    return <p className="muted">No aggregated metrics for this object in the current extract.</p>;
  }

  const bd = t?.breakdowns || {};
  const firstBreakKey = Object.keys(bd)[0];
  const chartData = firstBreakKey ? breakdownToChart(bd, firstBreakKey) : [];
  const cohortFirst = r?.breakdowns?.[firstBreakKey];

  const mergedBar =
    firstBreakKey &&
    (() => {
      const keys = new Set([...Object.keys(bd[firstBreakKey] || {}), ...Object.keys(cohortFirst || {})]);
      return [...keys].map((k) => ({
        name: k.length > 16 ? `${k.slice(0, 14)}…` : k,
        selected: bd[firstBreakKey]?.[k] || 0,
        cohort: cohortFirst?.[k] || 0,
      }));
    })();

  const isRisk = tab.id === "risk";
  const riskCompare =
    isRisk && selected?.byCategory && cohort?.avg_inherent_by_risk_category
      ? Object.keys({ ...selected.byCategory, ...cohort.avg_inherent_by_risk_category }).map((cat) => ({
          name: cat.length > 14 ? `${cat.slice(0, 12)}…` : cat,
          fullName: cat,
          you: selected.byCategory[cat]?.avg_inherent ?? null,
          cohort: cohort.avg_inherent_by_risk_category[cat] ?? null,
        }))
      : null;

  const isAra = tab.id === "audit_risk_assessment";
  const scatterRest = [];
  const scatterHi = [];
  if (isAra && scatter?.length) {
    for (const p of scatter) {
      const row = { x: p.inherent, y: p.residual, z: p.effectiveness, org: p.organization };
      if (selected && p.organization === selected.name) scatterHi.push(row);
      else scatterRest.push(row);
    }
  }

  return (
    <div className="tab-panel">
      <div className="tab-intro">
        <span className="lens-pill">{tab.lens}</span>
        <p className="tab-desc">{tab.description}</p>
      </div>

      <div className="two-col">
        <section className="panel section-card">
          <h3>Selected organization snapshot</h3>
          <p className="section-lead">Counts and averages computed only from objects belonging to this organization.</p>
          <div className="big-stat">
            <span className="big-stat-value">{t?.count ?? 0}</span>
            <span className="big-stat-label">objects in scope</span>
          </div>
          {t?.averages && Object.keys(t.averages).length > 0 && (
            <dl className="avg-list">
              {Object.entries(t.averages).map(([k, v]) => (
                <div key={k} className="avg-item">
                  <dt>{k.replace(/_/g, " ")}</dt>
                  <dd>{typeof v === "number" ? v : String(v)}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        <section className="panel section-card">
          <h3>Synthetic cohort roll-up</h3>
          <p className="section-lead">
            All organizations in this prototype combined ({r?.total_records ?? 0} records). Cohort averages are means
            of each organization’s averages where applicable.
          </p>
          <div className="big-stat">
            <span className="big-stat-value">{r?.avg_records_per_org ?? 0}</span>
            <span className="big-stat-label">mean records per organization</span>
          </div>
          {r?.averages_of_org_averages && Object.keys(r.averages_of_org_averages).length > 0 && (
            <dl className="avg-list">
              {Object.entries(r.averages_of_org_averages).map(([k, v]) => (
                <div key={k} className="avg-item">
                  <dt>{k.replace(/_/g, " ")} (mean of org means)</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      </div>

      {isRisk && riskCompare?.length > 0 && (
        <section className="panel section-card chart-block">
          <h3>Example chart — inherent exposure by risk category</h3>
          <p className="section-lead">Mean inherent score for the selected organization versus the pooled synthetic cohort.</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={riskCompare} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-22} textAnchor="end" height={68} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={(_, p) => p?.payload?.fullName} />
              <Legend />
              <Bar dataKey="cohort" name="Cohort pooled mean" fill="#6b7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="you" name="Selected organization" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      {isAra && scatterRest.length + scatterHi.length > 0 && (
        <section className="panel section-card chart-block">
          <h3>Example chart — audit universe scores</h3>
          <p className="section-lead">
            Each point is one audit risk assessment for an auditable entity. Gray points are other synthetic organizations;
            green is the selected organization. Bubble size reflects control effectiveness score.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 8, right: 12, bottom: 28, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name="inherent" tick={{ fontSize: 11 }} label={{ value: "Inherent risk score", position: "bottom", offset: 12, fill: "#8b939c", fontSize: 11 }} />
              <YAxis type="number" dataKey="y" name="residual" tick={{ fontSize: 11 }} label={{ value: "Residual", angle: -90, position: "insideLeft", fill: "#8b939c", fontSize: 11 }} />
              <ZAxis type="number" dataKey="z" range={[24, 320]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v) => [v, ""]} labelFormatter={(_, p) => p?.payload?.org} />
              <Scatter name="Other synthetic orgs" data={scatterRest} fill="#4b5563" fillOpacity={0.45} />
              <Scatter name="Selected organization" data={scatterHi} fill="#22c55e" />
            </ScatterChart>
          </ResponsiveContainer>
        </section>
      )}

      {mergedBar && mergedBar.length > 0 && firstBreakKey && (
        <section className="panel section-card chart-block">
          <h3>Example chart — {firstBreakKey.replace(/_/g, " ")} distribution</h3>
          <p className="section-lead">Selected organization counts versus summed cohort counts for the same dimension.</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mergedBar} layout="vertical" margin={{ left: 4, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="cohort" name="Cohort (sum)" fill="#4b5563" radius={[0, 4, 4, 0]} />
              <Bar dataKey="selected" name="Selected org" fill="#3d9cf5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      {!isRisk && !isAra && chartData.length > 0 && (
        <section className="panel section-card chart-block">
          <h3>Example chart — top values ({firstBreakKey.replace(/_/g, " ")})</h3>
          <p className="section-lead">Distribution within the selected organization for the first categorical dimension on this object.</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 4, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={118} tick={{ fontSize: 10 }} />
              <Tooltip labelFormatter={(_, p) => p?.payload?.fullName} />
              <Bar dataKey="value" name="Count" fill="#3d9cf5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      <section className="insights-block">
        <h3>Example product insights from this object</h3>
        <p className="section-lead">
          Illustrative patterns you could ship once peer data and customer tenancy are wired — not exhaustive.
        </p>
        <div className="insight-grid">
          {tab.insights.map((ins, i) => (
            <article key={i} className="insight-card">
              <h4>{ins.title}</h4>
              <p>{ins.body}</p>
            </article>
          ))}
        </div>
      </section>

      {isRisk && selected?.top_risks?.length > 0 && (
        <section className="panel section-card">
          <h3>Highest inherent risks (selected organization)</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Risk</th>
                  <th>Category</th>
                  <th>Inherent</th>
                  <th>Residual</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {selected.top_risks.map((row, i) => (
                  <tr key={i}>
                    <td>{row.name}</td>
                    <td>{row.category}</td>
                    <td>{row.inherent_score}</td>
                    <td>{row.residual_score}</td>
                    <td>{row.trend || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function CohortRoadmapPanel({ tab }) {
  const sections = tab.enhancementSections || [];
  return (
    <div className="tab-panel roadmap-panel">
      <div className="tab-intro">
        <span className="lens-pill">{tab.lens}</span>
        <p className="tab-desc">{tab.description}</p>
      </div>
      <p className="roadmap-note">
        Use <strong>Object library insights</strong> above to compare a selected synthetic organization to the cohort. This
        page is cohort-wide guidance for authors of prompts and synthetic data pipelines—not tied to the organization
        picker.
      </p>
      <div className="roadmap-sections">
        {sections.map((sec, i) => (
          <article key={i} className={`roadmap-section priority-${sec.priority.toLowerCase()}`}>
            <header className="roadmap-section-head">
              <span className={`priority-tag tag-${sec.priority.toLowerCase()}`}>{sec.priority} impact</span>
              <h3>{sec.theme}</h3>
            </header>
            <div className="roadmap-body">
              <p className="roadmap-lead">
                <strong>Why practitioners care:</strong> {sec.practitionerValue}
              </p>
              <p className="roadmap-lead">
                <strong>Prompt / generation focus:</strong> {sec.promptFocus}
              </p>
              <h4 className="roadmap-sub">Concrete improvements</h4>
              <ul className="roadmap-list">
                {sec.improvements.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [selectedKey, setSelectedKey] = useState("");
  const [activeTab, setActiveTab] = useState(OBJECT_LIBRARY_TABS[0].id);
  /** "objects" = Object Library tab strip; "roadmap" = cohort enhancements (from hero toggle). */
  const [prototypeView, setPrototypeView] = useState("objects");

  useEffect(() => {
    fetch("/aggregate.json")
      .then((r) => {
        if (!r.ok) throw new Error("Aggregate data missing — run the build step that compiles organization metrics.");
        return r.json();
      })
      .then((d) => {
        setData(d);
        if (d.companies?.length) setSelectedKey(d.companies[0].key);
      })
      .catch((e) => setErr(String(e.message || e)));
  }, []);

  const selected = useMemo(
    () => data?.companies?.find((c) => c.key === selectedKey) || null,
    [data, selectedKey]
  );

  const cohortRollup = data?.cohort?.type_rollups;

  if (err) {
    return (
      <div className="app">
        <div className="error">{err}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="app">
        <div className="loading">Loading…</div>
      </div>
    );
  }

  const activeDef =
    prototypeView === "roadmap"
      ? COHORT_ENHANCEMENTS_TAB
      : OBJECT_LIBRARY_TABS.find((t) => t.id === activeTab) || OBJECT_LIBRARY_TABS[0];
  const isRoadmapView = prototypeView === "roadmap";

  return (
    <div className="app">
      <header className="hero">
        <h1>{data.prototype_title}</h1>
        <p className="hero-lead">{data.prototype_summary}</p>
        <div className="hero-meta">
          <span className="pill">Object Library–aligned</span>
          <span className="pill muted-pill">{data.cohort?.organization_count ?? 0} synthetic organizations</span>
        </div>
        <div className="hero-view-toggle" role="tablist" aria-label="Choose prototype view">
          <button
            type="button"
            role="tab"
            aria-selected={prototypeView === "objects"}
            className={`hero-toggle-btn ${prototypeView === "objects" ? "active" : ""}`}
            onClick={() => setPrototypeView("objects")}
          >
            Object library insights
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={prototypeView === "roadmap"}
            className={`hero-toggle-btn ${prototypeView === "roadmap" ? "active" : ""}`}
            onClick={() => setPrototypeView("roadmap")}
          >
            {COHORT_ENHANCEMENTS_TAB.shortLabel}
          </button>
        </div>
      </header>

      <div className={`toolbar-proto ${isRoadmapView ? "toolbar-muted" : ""}`}>
        <div className="field">
          <label>Organization</label>
          <select value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)} disabled={isRoadmapView}>
            {data.companies.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name} — {c.sector}
              </option>
            ))}
          </select>
        </div>
        {selected && !isRoadmapView && (
          <p className="org-line">
            <strong>{selected.name}</strong>
            <span className="dot-sep">·</span>
            {selected.stage}
            <span className="dot-sep">·</span>
            {selected.geography}
            <span className="dot-sep">·</span>
            {selected.business_model}
          </p>
        )}
        {isRoadmapView && (
          <p className="org-line roadmap-toolbar-hint">Organization filter applies to Object library insights only.</p>
        )}
      </div>

      {!isRoadmapView && (
        <nav className="tab-nav" aria-label="Object Library domains">
          {OBJECT_LIBRARY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-short">{tab.shortLabel}</span>
            </button>
          ))}
        </nav>
      )}

      <main className={`tab-main ${isRoadmapView ? "tab-main-roadmap" : ""}`}>
        <div className="tab-heading">
          <h2>{activeDef.title}</h2>
        </div>
        {isRoadmapView ? (
          <CohortRoadmapPanel tab={activeDef} />
        ) : (
          <TypeTabPanel
            tab={activeDef}
            selected={selected}
            cohortRollup={cohortRollup}
            cohort={data.cohort}
            scatter={data.ara_scatter}
          />
        )}
      </main>
    </div>
  );
}
