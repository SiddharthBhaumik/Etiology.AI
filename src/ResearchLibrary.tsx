import { useMemo, useState } from "react";
import { Bookmark, BookOpen, ExternalLink, Filter, Search, ShieldCheck } from "lucide-react";
import { evidenceSources } from "./data/sources";
import type { EvidenceSourceType } from "./types/evidence";

const STORAGE_KEY = "etiology-ai:saved-evidence-sources";
const sourceTypes = ["All types", ...Array.from(new Set(evidenceSources.map((source) => source.sourceType)))];

function readSavedIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default function ResearchLibrary() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All types");
  const [savedIds, setSavedIds] = useState<string[]>(readSavedIds);
  const [savedOnly, setSavedOnly] = useState(false);

  const visibleSources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return evidenceSources.filter((source) => {
      const searchableText = [
        source.title,
        source.organisation,
        source.description,
        source.sourceType,
        ...source.topics,
      ].join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesType = selectedType === "All types" || source.sourceType === selectedType;
      const matchesSaved = !savedOnly || savedIds.includes(source.id);
      return matchesQuery && matchesType && matchesSaved;
    });
  }, [query, selectedType, savedIds, savedOnly]);

  function toggleSaved(id: string) {
    setSavedIds((current) => {
      const next = current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // The UI still works for this session if browser storage is unavailable.
      }
      return next;
    });
  }

  return (
    <section className="research-library" aria-labelledby="research-library-title">
      <div className="library-intro">
        <div>
          <p className="eyebrow">SOURCE DISCOVERY · EVIDENCE FIRST</p>
          <h2 id="research-library-title">Research Library</h2>
          <p className="muted">Start with traceable medical and educational sources. Open the original publication to verify the evidence.</p>
        </div>
        <div className="library-count"><BookOpen size={17} /><span><b>{evidenceSources.length}</b> source portals</span></div>
      </div>

      <div className="library-principle">
        <ShieldCheck size={19} />
        <div>
          <b>Transparency over false certainty</b>
          <p>These are source-discovery portals, not individually reviewed medical claims. A source is not automatically proof that a claim is correct.</p>
        </div>
      </div>

      <div className="library-controls">
        <label className="library-search">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sources, subjects or topics…" aria-label="Search sources and topics" />
        </label>
        <label className="library-filter">
          <Filter size={16} />
          <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)} aria-label="Filter by source type">
            {sourceTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <button className={savedOnly ? "library-saved-filter selected" : "library-saved-filter"} onClick={() => setSavedOnly((current) => !current)} aria-pressed={savedOnly}>
          <Bookmark size={15} /> Saved ({savedIds.length})
        </button>
      </div>

      <div className="library-results" aria-live="polite">
        <span>{visibleSources.length} {visibleSources.length === 1 ? "source" : "sources"} shown</span>
        <span>Directory status · not article-level verification</span>
      </div>

      {visibleSources.length > 0 ? (
        <div className="source-grid">
          {visibleSources.map((source) => (
            <article className="source-card" key={source.id}>
              <div className="source-card-top">
                <span className="source-type">{source.sourceType as EvidenceSourceType}</span>
                <button className={savedIds.includes(source.id) ? "bookmark-button saved" : "bookmark-button"} onClick={() => toggleSaved(source.id)} aria-label={savedIds.includes(source.id) ? `Remove ${source.title} from saved sources` : `Save ${source.title}`} aria-pressed={savedIds.includes(source.id)}>
                  <Bookmark size={17} fill={savedIds.includes(source.id) ? "currentColor" : "none"} />
                </button>
              </div>
              <h3>{source.title}</h3>
              <p className="source-organisation">{source.organisation}</p>
              <p className="source-description">{source.description}</p>
              <div className="source-topics">{source.topics.slice(0, 4).map((topic) => <span key={topic}>{topic}</span>)}</div>
              <div className="source-status"><span className="status-dot" /> Directory listing · content not reviewed by Etiology.AI</div>
              <details className="source-details">
                <summary>Access and verification notes</summary>
                <p>{source.accessNote}</p>
                <p>Before citing an individual document, verify its exact title, author or issuing body, publication date, relevant passage, and current status.</p>
              </details>
              <a className="source-link" href={source.url} target="_blank" rel="noreferrer">
                Open original source <ExternalLink size={15} />
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="library-empty">
          <Search size={25} />
          <h3>No sources match this search</h3>
          <p>Try another keyword, choose a different source type, or clear the saved-only filter.</p>
          <button onClick={() => { setQuery(""); setSelectedType("All types"); setSavedOnly(false); }}>Clear filters</button>
        </div>
      )}

      <p className="library-storage-note"><Bookmark size={14} /> Saved sources are stored only in this browser on this device for now. They are not synced to an account or Google Drive.</p>
    </section>
  );
}
