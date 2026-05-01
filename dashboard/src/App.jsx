import { useEffect, useMemo, useState, useRef } from "react";
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
import { PROTOTYPE_OBJECT_TABS, WHATS_NEW_TAB, COHORT_ENHANCEMENTS_TAB } from "./objectLibraryModel.js";
import { useGrcChat, useGrcInsight, useBrainStatus } from "./useGrcBrain.js";

// ─── GRC Brain badge ────────────────────────────────────────────────────────

function BrainBadge({ connected, onClick }) {
  const dot = connected === null ? "brain-dot-unknown" : connected ? "brain-dot-live" : "brain-dot-off";
  const label = connected === null ? "Connecting…" : connected ? "GRC Brain live" : "GRC Brain offline";
  return (
    <button type="button" className={`brain-badge ${connected ? "brain-badge-live" : ""}`} onClick={onClick} title="Open GRC Brain chat">
      <span className={`brain-dot ${dot}`} />
      {label}
    </button>
  );
}

// ─── Chat drawer ─────────────────────────────────────────────────────────────

function cleanBrainText(text) {
  // Strip "Follow-up questions:" sections the Brain appends
  return text
    .replace(/\*?\*?Follow-up questions:\*?\*?[\s\S]*/i, "")
    .replace(/\*?\*?Follow[\s-]up:?\*?\*?[\s\S]*/i, "")
    .trim();
}

function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  const content = isUser ? msg.content : cleanBrainText(msg.content);
  return (
    <div className={`chat-msg ${isUser ? "chat-msg-user" : "chat-msg-brain"}`}>
      <span className="chat-msg-role">{isUser ? "You" : "GRC Brain"}</span>
      <p className="chat-msg-body">{content}</p>
      {!isUser && msg.sources?.length > 0 && (
        <div className="chat-sources">
          {msg.sources.map((s, i) => (
            <span key={i} className="chat-source-chip" title={s.snippet}>{s.title}</span>
          ))}
        </div>
      )}
      {!isUser && msg.confidence > 0 && (
        <div className="chat-confidence">
          <span className="chat-conf-bar" style={{ width: `${Math.round(msg.confidence * 100)}%` }} />
          <span className="chat-conf-label">{Math.round(msg.confidence * 100)}% confidence</span>
        </div>
      )}
    </div>
  );
}

function ChatDrawer({ open, onClose, initialQuestion }) {
  const { messages, loading, ask, reset } = useGrcChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const lastFiredT = useRef(null);

  useEffect(() => {
    if (open && initialQuestion?.q && initialQuestion.t !== lastFiredT.current) {
      lastFiredT.current = initialQuestion.t;
      ask(initialQuestion.q);
    }
    if (!open) lastFiredT.current = null;
  }, [open, initialQuestion, ask]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  function handleSubmit(e) {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    ask(q);
  }

  const STARTERS = [
    "What MAS TRM requirements apply to a Singapore fintech?",
    "How do CIS Controls map to ISO 27001 and NIST CSF?",
    "What ESG supply chain risks exist for electronics manufacturers in Southeast Asia?",
    "What does DORA require for ICT third-party risk management?",
    "Which EU regulations apply to financial services firms operating in Germany?",
    "What child labour and forced labour risks apply to global supply chains?",
  ];

  return (
    <div className={`chat-drawer ${open ? "chat-drawer-open" : ""}`} role="dialog" aria-label="GRC Brain chat">
      <div className="chat-drawer-header">
        <div className="chat-drawer-title">
          <span className="brain-icon">⬡</span>
          GRC Brain
          <span className="brain-subtitle">82 frameworks · 1,934 regulations · 3,241 risk sources</span>
        </div>
        <div className="chat-header-actions">
          {messages.length > 0 && (
            <button type="button" className="chat-action-btn" onClick={reset} title="Clear conversation">↺</button>
          )}
          <button type="button" className="chat-action-btn" onClick={onClose} title="Close">✕</button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <p className="chat-empty-lead">Ask the GRC knowledge graph anything.</p>
            <div className="chat-starters">
              {STARTERS.map((s, i) => (
                <button key={i} type="button" className="chat-starter-btn" onClick={() => ask(s)}>{s}</button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => <ChatMessage key={i} msg={m} />)
        )}
        {loading && (
          <div className="chat-msg chat-msg-brain">
            <span className="chat-msg-role">GRC Brain</span>
            <p className="chat-msg-body chat-thinking">Querying knowledge graph…</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about controls, frameworks, regulations…"
          disabled={loading}
        />
        <button type="submit" className="chat-send-btn" disabled={loading || !input.trim()}>Send</button>
      </form>
    </div>
  );
}

// ─── GRC Brain insight panel (per-tab enrichment) ────────────────────────────

function BrainInsightPanel({ tabId, selected, onAskMore }) {
  const sector = selected?.sector ?? "";
  const geography = selected?.geography ?? "";
  const topRiskTopics = selected?.top_risks?.slice(0, 3).map((r) => r.canonical_topic_id || r.name).join(", ") ?? "";

  // Derive a jurisdiction hint from the org's geography field
  const geoHint = geography ? ` operating in ${geography}` : "";
  const geoRegHint = geography ? ` in ${geography}` : "";

  const suffix = "Answer in exactly 2-3 sentences. No follow-up questions. No bullet points. Plain prose only.";
  const prompts = {
    risk: `What are the most critical risk management frameworks and ESG supply chain risk factors for ${sector || "financial services"} firms${geoHint}? Include cross-framework control linkage practices. ${suffix}`,
    control: `What control patterns—preventive vs detective mix, automation level—do CIS Controls, NIST CSF, and ISO 27001 recommend for ${sector || "mid-market"} organizations${geoHint}? ${suffix}`,
    audit_risk_assessment: `What does IIA guidance and MAS TRM say about audit universe scoring for ${sector || "regulated"} organizations${geoHint}? What makes a strong inherent vs residual assessment? ${suffix}`,
    auditable_entity: `How should internal audit teams structure their audit universe for ${sector || "a regulated"} organization${geoHint}? Reference relevant regulatory requirements${geoRegHint}. ${suffix}`,
    standard_regulation: `Which compliance frameworks and regulations most commonly apply to ${sector || "financial services"} organizations${geoHint}? Include cross-mapping obligations under GDPR, DORA, NIS2, or local equivalents. ${suffix}`,
    evidence: `What evidence types and collection practices do mature GRC programs use for audit readiness under ISO 27001 and SOC 2${geoHint}? ${suffix}`,
    audit_finding: `What finding severity patterns and root causes are most common in ${sector || "regulated"} peer audit populations? Reference relevant regulatory enforcement patterns${geoRegHint}. ${suffix}`,
    control_assessment: `What drives control test failure rates in peer organizations in ${sector || "financial services"}${geoHint}? What control design attributes correlate with higher pass rates under CIS Controls or NIST? ${suffix}`,
    default: `What GRC best practices and regulatory requirements are most relevant for ${tabId?.replace(/_/g, " ")} management in ${sector || "mid-market"} organizations${geoHint}? ${suffix}`,
  };

  const prompt = prompts[tabId] ?? prompts.default;
  const cacheKey = `${tabId}-${sector}-${geography}`;
  const { text, sources, confidence, loading } = useGrcInsight(cacheKey, prompt);

  if (!text && !loading) return null;

  const topQuestion = {
    risk: `What controls and ESG risk factors affect "${topRiskTopics || "top risk categories"}" for ${sector} organizations${geoHint}?`,
    control: `What is the ideal preventive vs detective control mix for ${sector || "my sector"}${geoHint}?`,
    audit_risk_assessment: `How do I improve my ARA factor scoring methodology for${geoRegHint || " my sector"}?`,
    auditable_entity: `What audit universe gaps should I watch for in ${sector || "my sector"}${geoHint}?`,
    standard_regulation: `Which frameworks and regulations should I prioritize for${geoRegHint || " my compliance program"}?`,
    evidence: `What evidence gaps most often cause audit findings in ${sector || "my sector"}?`,
    audit_finding: `How do I reduce repeat findings in ${sector || "my sector"} audit cycles${geoHint}?`,
    control_assessment: `What control design patterns have the highest pass rates for ${sector || "my sector"}${geoHint}?`,
  }[tabId] ?? `Tell me more about ${tabId?.replace(/_/g, " ")} best practices${geoHint}.`;

  return (
    <section className="brain-insight-panel">
      <div className="brain-panel-header">
        <span className="brain-panel-icon">⬡</span>
        <span className="brain-panel-label">GRC Brain enhancement</span>
        {confidence > 0 && (
          <span className="brain-panel-conf">{Math.round(confidence * 100)}% knowledge match</span>
        )}
      </div>
      {loading ? (
        <p className="brain-panel-loading">Querying knowledge graph…</p>
      ) : (
        <>
          <p className="brain-panel-text">{cleanBrainText(text)}</p>
          {sources?.length > 0 && (
            <div className="brain-panel-sources">
              <span className="brain-sources-label">Sources:</span>
              {sources.map((s, i) => (
                <span key={i} className="brain-source-chip">{s.title}</span>
              ))}
            </div>
          )}
          <button
            type="button"
            className="brain-ask-more-btn"
            onClick={() => onAskMore(topQuestion)}
          >
            Ask follow-up in GRC Brain chat →
          </button>
        </>
      )}
    </section>
  );
}

// ─── Existing panels (unchanged logic) ──────────────────────────────────────

function WhatsNewHighlightsPanel({ tab, data, selected, onAskMore }) {
  const sections = tab.highlightSections || [];
  const riskAvg = selected?.types?.risk?.averages;
  const evAvg = selected?.types?.evidence?.averages;
  const ra = selected?.types?.risk_assessment;
  const hasTopicBd = Boolean(selected?.types?.risk?.breakdowns?.canonical_topic_id);

  return (
    <div className="tab-panel highlights-panel">
      <div className="tab-intro">
        <span className="lens-pill">{tab.lens}</span>
        <p className="tab-desc">{tab.description}</p>
      </div>

      {/* GRC Brain callout — prominently positioned on the overview tab */}
      <section className="brain-callout-card">
        <div className="brain-callout-header">
          <span className="brain-icon brain-icon-lg">⬡</span>
          <div>
            <h3 className="brain-callout-title">What GRC Brain adds to this prototype</h3>
            <p className="brain-callout-sub">
              Every tab is enriched live from a local knowledge graph: <strong>82 frameworks</strong> · <strong>5,537 controls</strong> · <strong>1,934 regulations</strong> across 129 jurisdictions · <strong>3,241 ESG risk intelligence sources</strong> · 27,000+ cross-framework mappings.
            </p>
          </div>
        </div>
        <div className="brain-callout-grid">
          <div className="brain-callout-item">
            <strong>Jurisdiction-aware insights</strong>
            <p>Each tab prompt includes the selected org's geography — the Brain draws from 129 country and state profiles to surface locally relevant regulatory obligations and enforcement patterns.</p>
          </div>
          <div className="brain-callout-item">
            <strong>Cross-framework mapping</strong>
            <p>27,105 SCF control mappings + curated ISO/NIST/SOC 2/GDPR crosswalks. Ask the chat panel how any two frameworks align — it answers across 82 standards simultaneously.</p>
          </div>
          <div className="brain-callout-item">
            <strong>ESG supply chain intelligence</strong>
            <p>3,241 risk intelligence articles from NGOs, UN bodies, and industry reports covering child labour, forced labour, climate risk, corruption, and biodiversity across 317 countries.</p>
          </div>
          <div className="brain-callout-item">
            <strong>Regulation full-text search</strong>
            <p>2,321 regulation documents from EU, Americas, APAC, MEA, and UK embedded in pgvector — the Brain can answer detailed questions about specific regulatory articles and obligations.</p>
          </div>
        </div>
        <div className="brain-callout-demos">
          <button type="button" className="brain-callout-demo-btn" onClick={() => onAskMore("What DORA requirements apply to ICT third-party risk management for a German bank?")}>
            Try: DORA + Germany
          </button>
          <button type="button" className="brain-callout-demo-btn" onClick={() => onAskMore("What ESG supply chain risks should a Singapore electronics company assess for their Malaysian suppliers?")}>
            Try: ESG supply chain
          </button>
          <button type="button" className="brain-callout-demo-btn" onClick={() => onAskMore("How do CIS Controls v8 safeguards map to ISO 27001:2022 and NIST CSF 2.0?")}>
            Try: Cross-framework map
          </button>
        </div>
        <button
          type="button"
          className="brain-callout-cta"
          onClick={() => onAskMore("What are the most important GRC capabilities for a risk-mature organization?")}
        >
          Open GRC Brain chat →
        </button>
      </section>

      <section className="panel section-card highlights-stats">
        <h3>Live snapshot — selected organization</h3>
        <p className="section-lead">
          Pulled from the same <code className="inline-code">aggregate.json</code> that powers the other tabs (run{" "}
          <code className="inline-code">node scripts/aggregate.mjs</code> after changing{" "}
          <code className="inline-code">input_data/</code>).
        </p>
        <dl className="highlights-stat-grid">
          <div className="highlights-stat">
            <dt>Cohort size</dt>
            <dd>{data?.cohort?.organization_count ?? "—"}</dd>
          </div>
          <div className="highlights-stat">
            <dt>Selected org</dt>
            <dd>{selected?.name ?? "—"}</dd>
          </div>
          <div className="highlights-stat">
            <dt>Risks with control linkage (est.)</dt>
            <dd>{riskAvg?.pct_with_linked_controls != null ? `${riskAvg.pct_with_linked_controls}%` : "—"}</dd>
          </div>
          <div className="highlights-stat">
            <dt>Evidence linked to audits (est.)</dt>
            <dd>{evAvg?.pct_linked_audit != null ? `${evAvg.pct_linked_audit}%` : "—"}</dd>
          </div>
          <div className="highlights-stat">
            <dt>Risk assessments (count)</dt>
            <dd>{ra?.count ?? "—"}</dd>
          </div>
          <div className="highlights-stat">
            <dt>Canonical topic breakdown</dt>
            <dd>{hasTopicBd ? "Yes — open Risks tab" : "—"}</dd>
          </div>
        </dl>
        {data?.generated_at && (
          <p className="highlights-generated muted">
            Aggregate generated <time dateTime={data.generated_at}>{new Date(data.generated_at).toLocaleString()}</time>
          </p>
        )}
      </section>

      <div className="highlights-sections">
        {sections.map((sec, i) => (
          <section key={i} className="panel section-card highlight-theme-card">
            <h3>{sec.title}</h3>
            <ul className="highlight-item-list">
              {sec.items.map((item, j) => (
                <li key={j}>
                  <strong>{item.label}</strong>
                  <span className="highlight-item-body"> — {item.body}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="highlights-footer muted">
        For long-term cohort authoring guidance (time series, graph QA, provenance), use{" "}
        <strong>{COHORT_ENHANCEMENTS_TAB.shortLabel}</strong> in the hero toggle.
      </p>
    </div>
  );
}

function breakdownToChart(breakdowns, key, limit = 12) {
  const b = breakdowns?.[key];
  if (!b) return [];
  return Object.entries(b)
    .map(([name, value]) => ({ name: name.length > 22 ? `${name.slice(0, 20)}…` : name, fullName: name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function TypeTabPanel({ tab, selected, cohortRollup, cohort, scatter, onAskMore }) {
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

      {/* GRC Brain contextual insight — unique to each tab */}
      <BrainInsightPanel tabId={tab.id} selected={selected} onAskMore={onAskMore} />

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
            of each organization's averages where applicable.
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
          <p className="section-lead">
            {isRisk && firstBreakKey === "canonical_topic_id"
              ? "Risk counts by canonical topic id in the selected organization versus summed counts across all synthetic peers (cohort-wide topic pressure)."
              : "Selected organization counts versus summed cohort counts for the same dimension."}
          </p>
          <ResponsiveContainer width="100%" height={isRisk && firstBreakKey === "canonical_topic_id" ? 320 : 260}>
            <BarChart data={mergedBar} layout="vertical" margin={{ left: 4, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="name"
                type="category"
                width={isRisk && firstBreakKey === "canonical_topic_id" ? 148 : 120}
                tick={{ fontSize: 10 }}
              />
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
        <TopRisksTable risks={selected.top_risks} sector={selected?.sector} geography={selected?.geography} onAskMore={onAskMore} />
      )}
    </div>
  );
}

// ─── Top risks table with GRC Brain enrichment ───────────────────────────────

function TopRisksTable({ risks, sector, geography, onAskMore }) {
  return (
    <section className="panel section-card">
      <div className="top-risks-header">
        <div>
          <h3>Highest inherent risks (selected organization)</h3>
          <p className="section-lead">
            Top five by inherent score. <strong>Canonical topic</strong> supports stable peer prevalence when the cohort
            uses normalized topic keys.
          </p>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Risk</th>
              <th>Canonical topic</th>
              <th>Category</th>
              <th>Inherent</th>
              <th>Residual</th>
              <th>Trend / velocity</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((row, i) => (
              <tr key={i}>
                <td>{row.name}</td>
                <td className="mono-cell">{row.canonical_topic_id ?? "—"}</td>
                <td>{row.category}</td>
                <td>{row.inherent_score}</td>
                <td>{row.residual_score}</td>
                <td>{row.trend || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="brain-ask-more-btn brain-ask-risks-btn"
        onClick={() => {
          const topRisk = risks[0];
          const geoSuffix = geography ? ` operating in ${geography}` : "";
          onAskMore(`What controls and frameworks address "${topRisk?.category || "operational"}" risk in ${sector || "regulated"} organizations${geoSuffix}?`);
        }}
      >
        ⬡ Ask GRC Brain about these risk categories →
      </button>
    </section>
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

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [selectedKey, setSelectedKey] = useState("");
  const [activeTab, setActiveTab] = useState(PROTOTYPE_OBJECT_TABS[0].id);
  const [prototypeView, setPrototypeView] = useState("objects");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInitialQ, setChatInitialQ] = useState(null);
  const brainConnected = useBrainStatus();

  useEffect(() => {
    function parseEmbeddedAggregate() {
      const el = document.getElementById("__AGGREGATE_B64__");
      const raw = el?.textContent?.trim();
      if (!raw) return null;
      try {
        const bin = atob(raw.replace(/\s+/g, ""));
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return JSON.parse(new TextDecoder("utf-8").decode(bytes));
      } catch {
        return null;
      }
    }

    const embedded = parseEmbeddedAggregate();
    if (embedded) {
      setData(embedded);
      if (embedded.companies?.length) setSelectedKey(embedded.companies[0].key);
      return;
    }

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

  function openChat(question) {
    setChatInitialQ(question ? { q: question, t: Date.now() } : null);
    setChatOpen(true);
  }

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
      : PROTOTYPE_OBJECT_TABS.find((t) => t.id === activeTab) || PROTOTYPE_OBJECT_TABS[0];
  const isRoadmapView = prototypeView === "roadmap";

  return (
    <div className={`app ${chatOpen ? "app-chat-open" : ""}`}>
      <header className="hero">
        <div className="hero-top-row">
          <div>
            <h1>{data.prototype_title}</h1>
            <p className="hero-lead">{data.prototype_summary}</p>
          </div>
          <BrainBadge connected={brainConnected} onClick={() => openChat(null)} />
        </div>
        <div className="hero-meta">
          <span className="pill">Object Library–aligned</span>
          <span className="pill muted-pill">{data.cohort?.organization_count ?? 0} synthetic organizations</span>
          {brainConnected && (
            <span className="pill brain-pill">⬡ GRC Brain · 82 frameworks · 1,934 regulations · 3,241 risk sources</span>
          )}
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
          {PROTOTYPE_OBJECT_TABS.map((tab) => (
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
        ) : activeDef.id === WHATS_NEW_TAB.id ? (
          <WhatsNewHighlightsPanel tab={activeDef} data={data} selected={selected} onAskMore={openChat} />
        ) : (
          <TypeTabPanel
            tab={activeDef}
            selected={selected}
            cohortRollup={cohortRollup}
            cohort={data.cohort}
            scatter={data.ara_scatter}
            onAskMore={openChat}
          />
        )}
      </main>

      {/* Chat overlay backdrop */}
      {chatOpen && <div className="chat-backdrop" onClick={() => setChatOpen(false)} />}

      <ChatDrawer
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        initialQuestion={chatInitialQ}
      />
    </div>
  );
}
