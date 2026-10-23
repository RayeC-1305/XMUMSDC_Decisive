import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { InputError } from "./profile_intake.js";

export const PROVIDER = "Crossref REST API";
export const QUERY = "artificial intelligence workforce skills employment";
export const MAPPING_NOTE = "Keyword rules convert research metadata into small, bounded planning weights. These are Nexus assumptions, not paper findings, vacancy counts, growth rates or evidence of Malaysian employer demand. Metadata retrieval does not verify research quality.";
const clean = (s = "") => String(s).replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();

export function evidenceUrl(today) {
  const url = new URL("https://api.crossref.org/works");
  url.search = new URLSearchParams({ "query.title": QUERY, filter: `from-pub-date:2023-01-01,until-pub-date:${today}`, sort: "published", order: "desc", rows: "100", select: "DOI,title,published,publisher,URL,abstract,container-title" });
  return url.href;
}

export function mapResearch(item, retrievedAt) {
  if (!item || !Array.isArray(item.title) || typeof item.title[0] !== "string" || typeof item.DOI !== "string" || !/^10\.\d{4,9}\/[^\s]+$/i.test(item.DOI) || item.DOI.length > 300) return null;
  const title = clean(item.title[0]).slice(0, 600);
  const abstract = typeof item.abstract === "string" ? clean(item.abstract).slice(0, 8000) : "";
  const content = `${title} ${abstract}`;
  if (!/(artificial intelligence|generative ai|\bAI\b|\bLLMs?\b|automation)/i.test(content) || !/(workforce|workplace|career|employment|labou?r|occupation|job market|\bskills?\b|human resource|reskilling)/i.test(content)) return null;
  const parts = item.published?.["date-parts"]?.[0];
  if (!Array.isArray(parts) || parts.length < 1 || parts.length > 3 || !parts.every(Number.isInteger)) return null;
  const [year, month = 1, day = 1] = parts;
  if (year < 2023 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  if (date > retrievedAt.slice(0, 10) || !Number.isFinite(Date.parse(date)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) return null;
  const mappings = [{ skillId: "aiLiteracy", factor: 1.04, matchedTerms: "AI and workforce/skills terms", rationale: "Review AI literacy in the context of work." }];
  const rules = [
    ["dataQuality", /reliab|validat|accuracy|human.?review|human.?oversight|critical.?thinking|trustworth/i, 1.04, "Review data reliability and human validation."],
    ["analytics", /data analy|analytics|data.?driven/i, 1.04, "Review data analysis capability."],
    ["sql", /\bSQL\b|database|data query/i, 1.05, "Review database and querying capability."],
    ["automation", /automation|robotic|manufactur/i, 1.04, "Explore automation support capability."],
    ["communication", /collaborat|communication|human resource|teamwork/i, 1.03, "Review stakeholder and team communication."],
    ["sustainability", /sustainab|green.?skill|environmental/i, 1.04, "Explore sustainability capability."],
    ["python", /\bpython\b|programming|software develop/i, 1.04, "Explore programming capability."],
  ];
  for (const [skillId, pattern, factor, rationale] of rules) {
    const term = content.match(pattern)?.[0];
    if (term) mappings.push({ skillId, factor, matchedTerms: term, rationale });
  }
  if (/automation|automati[sz]/i.test(content) && /data entry|routine (tasks|work)|clerical|bookkeep/i.test(content)) mappings.push({ skillId: "dataEntry", factor: 0.96, matchedTerms: "automation and routine information work", rationale: "Stress-test lower emphasis on routine processing; this is an authored exposure assumption, not observed job loss." });
  return {
    id: `crossref:${item.DOI.toLowerCase()}`, doi: item.DOI, title, publisher: clean(item.publisher || "Publisher not supplied").slice(0, 200),
    date, datePrecision: ["", "year", "month", "day"][parts.length], url: `https://doi.org/${encodeURIComponent(item.DOI)}`,
    type: "Research", provider: PROVIDER, retrievedAt, retrieval: "live", reviewStatus: "metadata_only_unreviewed", geography: "not_established",
    summary: abstract ? abstract.slice(0, 620) : "No abstract supplied. Open the DOI to inspect the source.",
    impacts: Object.fromEntries(mappings.map(m => [m.skillId, m.factor])), mappings, mappingNote: MAPPING_NOTE,
  };
}

async function readJsonBounded(response, limit = 2 * 1024 * 1024) {
  if (!response.ok) throw new Error(`Public feed returned HTTP ${response.status}.`);
  if (!response.body) throw new Error("Public feed returned an empty body.");
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) throw new Error("Public feed exceeded the response size limit.");
      chunks.push(Buffer.from(value));
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } finally { await reader.cancel().catch(() => {}); }
}

export class EvidenceService {
  constructor({ cacheFile, fetchImpl = globalThis.fetch, now = () => new Date(), ttlMs = 6 * 3600000, minRefreshMs = 60000, timeoutMs = 20000 } = {}) {
    this.cacheFile = cacheFile;
    this.fetchImpl = fetchImpl;
    this.now = now;
    this.ttlMs = ttlMs;
    this.minRefreshMs = minRefreshMs;
    this.timeoutMs = timeoutMs;
    this.snapshot = null;
    this.history = new Map();
    this.lastAttemptAt = null;
    this.lastError = null;
    this.cacheWarning = null;
    this.inFlight = null;
    this.loading = this.load();
  }
  async load() {
    if (!this.cacheFile) return;
    try {
      const stat = await fs.stat(this.cacheFile);
      if (stat.size > 8 * 1024 * 1024) throw new Error("Cache too large");
      const saved = JSON.parse(await fs.readFile(this.cacheFile, "utf8"));
      if (![1, 2].includes(saved.schemaVersion)) throw new Error("Invalid cache");
      const entries = saved.schemaVersion === 1 ? [saved] : saved.snapshots;
      if (!Array.isArray(entries) || !entries.length || entries.length > 20) throw new Error("Invalid history");
      for (const entry of entries) {
        if (!Array.isArray(entry.items) || !entry.items.length || entry.items.length > 12 || !Number.isFinite(Date.parse(entry.retrievedAt)) || Date.parse(entry.retrievedAt) > this.now().getTime()) throw new Error("Invalid cache");
        const sources = entry.items.map(item => mapResearch(item, entry.retrievedAt));
        if (sources.some(s => !s) || new Set(sources.map(s => s.id)).size !== sources.length) throw new Error("Invalid sources");
        const snapshot = this.makeSnapshot(sources, entry.items, entry.retrievedAt, entry.checked);
        this.history.set(snapshot.revision, snapshot);
        this.snapshot = snapshot;
      }
    } catch (error) {
      this.snapshot = null;
      this.history.clear();
      if (error.code !== "ENOENT") this.cacheWarning = "Stored evidence was unreadable; refresh to retrieve public metadata.";
    }
  }
  makeSnapshot(sources, items, retrievedAt, checked) {
    const revision = createHash("sha256").update(JSON.stringify(sources.map(s => [s.id, s.date, s.impacts]).sort((a, b) => a[0].localeCompare(b[0])))).digest("hex").slice(0, 16);
    return { sources, items, retrievedAt, checked, revision };
  }
  state({ live = false } = {}) {
    const ageMs = this.snapshot ? Math.max(0, this.now().getTime() - Date.parse(this.snapshot.retrievedAt)) : null;
    return {
      status: !this.snapshot ? "unavailable" : this.lastError || ageMs >= this.ttlMs ? "stale" : live ? "live" : "cached",
      provider: PROVIDER, query: QUERY, sourceUrl: evidenceUrl(this.now().toISOString().slice(0, 10)),
      retrievedAt: this.snapshot?.retrievedAt ?? null, lastAttemptAt: this.lastAttemptAt, ageHours: ageMs === null ? null : Math.round(ageMs / 36000) / 100,
      revision: this.snapshot?.revision ?? "none", checked: this.snapshot?.checked ?? 0,
      sources: (this.snapshot?.sources ?? []).map(s => ({ ...s, retrieval: live ? "live" : "cached" })),
      lastError: this.lastError, cacheWarning: this.cacheWarning, mappingNote: MAPPING_NOTE,
      refreshAfter: this.lastAttemptAt ? new Date(Date.parse(this.lastAttemptAt) + this.minRefreshMs).toISOString() : null,
    };
  }
  async get(revision) {
    await this.loading;
    if (revision === undefined || revision === null || revision === this.snapshot?.revision) return this.state();
    if (revision === "none") return { ...this.state(), status: "neutral", revision: "none", sources: [], retrievedAt: null, ageHours: null, checked: 0, currentRevision: this.snapshot?.revision ?? "none", lastError: null, isHistorical: true };
    if (typeof revision !== "string" || !this.history.has(revision)) throw new InputError("This evidence revision is no longer available. Refresh evidence to use the current sources.", 409);
    const snapshot = this.history.get(revision);
    return { ...this.state(), status: "archived", revision, retrievedAt: snapshot.retrievedAt, ageHours: Math.round((this.now().getTime() - Date.parse(snapshot.retrievedAt)) / 36000) / 100, sources: snapshot.sources.map(s => ({ ...s, retrieval: "cached" })), currentRevision: this.snapshot?.revision ?? "none", checked: snapshot.checked, lastError: null, isHistorical: true };
  }
  async refresh() {
    await this.loading;
    if (this.inFlight) return this.inFlight;
    if (this.lastAttemptAt && this.now().getTime() - Date.parse(this.lastAttemptAt) < this.minRefreshMs) return { ...this.state(), throttled: true };
    this.inFlight = this.retrieve();
    try { return await this.inFlight; } finally { this.inFlight = null; }
  }
  async retrieve() {
    this.lastAttemptAt = this.now().toISOString();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const previousRevision = this.snapshot?.revision ?? "none";
    try {
      const url = evidenceUrl(this.lastAttemptAt.slice(0, 10));
      const response = await this.fetchImpl(url, { signal: controller.signal, headers: { Accept: "application/json", "User-Agent": "NexusTalent/1.0 (public workforce research prototype)" }, redirect: "error" });
      const body = await readJsonBounded(response);
      if (!Array.isArray(body.message?.items) || body.message.items.length > 100) throw new Error("Public feed returned an unexpected schema.");
      const retrievedAt = this.now().toISOString();
      const selected = new Map();
      for (const item of body.message.items) {
        const source = mapResearch(item, retrievedAt);
        if (source && !selected.has(source.id)) selected.set(source.id, { source, item: { DOI: item.DOI, title: [item.title[0].slice(0, 2000)], abstract: typeof item.abstract === "string" ? item.abstract.slice(0, 12000) : undefined, publisher: source.publisher, published: item.published } });
        if (selected.size >= 12) break;
      }
      if (!selected.size) throw new Error("No dated AI-and-workforce research matched. Previous evidence is kept.");
      const records = [...selected.values()];
      this.snapshot = this.makeSnapshot(records.map(r => r.source), records.map(r => r.item), retrievedAt, body.message.items.length);
      this.history.delete(this.snapshot.revision);
      this.history.set(this.snapshot.revision, this.snapshot);
      if (this.history.size > 20) this.history.delete(this.history.keys().next().value);
      this.lastError = null;
      this.cacheWarning = null;
      if (this.cacheFile) {
        const temporary = `${this.cacheFile}.${process.pid}.tmp`;
        try {
          await fs.mkdir(path.dirname(this.cacheFile), { recursive: true });
          await fs.writeFile(temporary, JSON.stringify({ schemaVersion: 2, snapshots: [...this.history.values()].map(s => ({ retrievedAt: s.retrievedAt, checked: s.checked, items: s.items })) }, null, 2));
          await fs.rename(temporary, this.cacheFile);
        } catch {
          this.cacheWarning = "Evidence is available in memory but could not be saved for the next restart.";
        } finally { await fs.rm(temporary, { force: true }).catch(() => {}); }
      }
      return { ...this.state({ live: true }), previousRevision, changed: previousRevision !== this.snapshot.revision };
    } catch (error) {
      this.lastError = error.name === "AbortError" ? "Public feed timed out. Previous evidence is kept." : error.message === "fetch failed" ? "Public feed could not be reached. Previous evidence is kept." : error.message;
      return { ...this.state(), previousRevision, changed: false };
    } finally { clearTimeout(timer); }
  }
}
