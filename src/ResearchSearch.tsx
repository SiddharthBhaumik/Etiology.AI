import { FormEvent, useState } from "react";
import { BookOpen, ExternalLink, FileText, Filter, LoaderCircle, Search, ShieldCheck } from "lucide-react";

type EuropePmcArticle = {
  id: string;
  source?: string;
  pmid?: string;
  pmcid?: string;
  doi?: string;
  title?: string;
  authorString?: string;
  journalTitle?: string;
  pubYear?: string;
  firstPublicationDate?: string;
  abstractText?: string;
  isOpenAccess?: string;
  inEPMC?: string;
  pubTypeList?: { pubType?: string[] };
};
type SearchResponse = { hitCount?: number; resultList?: { result?: EuropePmcArticle[] } };

const API = "https://www.ebi.ac.uk/europepmc/webservices/rest/search";
const STOP_WORDS = new Set(["find","recent","latest","papers","paper","studies","study","research","about","on","in","for","of","and","or","the","a","an","with","including","patients","patient","without","among","from","over","last","past","years","year","show","search","related","material"]);
const DEFAULT_PROMPT = "Find recent systematic reviews and clinical trials on SGLT2 inhibitors in heart failure, including patients without diabetes.";

function buildSearchQuery(prompt: string, years: string, studyType: string, openAccessOnly: boolean) {
  // Keep this deterministic and transparent: no LLM is used to rewrite the student's question.
  const clean = prompt.replace(/[?]/g, " ").replace(/\b(find|recent|latest|papers?|studies|research|about|show me|search for)\b/gi, " ").replace(/\s+/g, " ").trim();
  const terms = clean.split(/\s+/).map((word) => word.replace(/^[^\w-]+|[^\w-]+$/g, "")).filter((word) => word.length > 2 && !STOP_WORDS.has(word.toLowerCase()));
  const unique = [...new Set(terms)];
  const textQuery = unique.length ? unique.map((word) => word.includes("-") ? word : word).join(" AND ") : clean;
  const clauses = [`(${textQuery})`];
  if (years !== "any") {
    const start = new Date();
    start.setFullYear(start.getFullYear() - Number(years));
    const date = start.toISOString().slice(0, 10);
    clauses.push(`FIRST_PDATE:[${date} TO *]`);
  }
  if (studyType === "reviews") clauses.push('(PUB_TYPE:"systematic review" OR PUB_TYPE:"meta-analysis")');
  if (studyType === "trials") clauses.push('PUB_TYPE:"clinical trial"');
  if (openAccessOnly) clauses.push("OPEN_ACCESS:Y");
  return clauses.join(" AND ");
}

function articleLink(article: EuropePmcArticle) {
  if (article.pmcid) return `https://europepmc.org/articles/${article.pmcid}`;
  if (article.pmid) return `https://europepmc.org/article/MED/${article.pmid}`;
  if (article.doi) return `https://doi.org/${article.doi}`;
  return `https://europepmc.org/search?query=EXT_ID:${encodeURIComponent(article.id)}`;
}

export default function ResearchSearch() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [years, setYears] = useState("5");
  const [studyType, setStudyType] = useState("all");
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [articles, setArticles] = useState<EuropePmcArticle[]>([]);
  const [hitCount, setHitCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);

  async function runSearch(event?: FormEvent, nextPage = 1) {
    event?.preventDefault();
    if (!prompt.trim()) { setError("Enter a medical topic or research question first."); return; }
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const query = buildSearchQuery(prompt.trim(), years, studyType, openAccessOnly);
      const params = new URLSearchParams({ query, format: "json", pageSize: "25", page: String(nextPage), resultType: "core", sort_date: "y" });
      const response = await fetch(`${API}?${params.toString()}`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Europe PMC returned HTTP ${response.status}. Please retry in a moment.`);
      const data = await response.json() as SearchResponse;
      const rows = data.resultList?.result ?? [];
      setArticles((current) => nextPage === 1 ? rows : [...current, ...rows]);
      setHitCount(data.hitCount ?? rows.length);
      setPage(nextPage);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The paper search failed. Check your connection and try again.");
      if (nextPage === 1) { setArticles([]); setHitCount(null); }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="research-search" aria-labelledby="research-search-title">
      <div className="research-search-heading">
        <div>
          <p className="eyebrow">LIVE LITERATURE SEARCH · EUROPE PMC</p>
          <h2 id="research-search-title">Research Search</h2>
          <p className="muted">Search real biomedical publication records from a research question. No account or paid API key required.</p>
        </div>
        <div className="research-api-badge"><span /> Live database</div>
      </div>

      <div className="research-search-trust">
        <ShieldCheck size={19} />
        <div><b>Traceable evidence, not invented citations</b><p>Titles, authors, dates and abstracts are returned by Europe PMC. Abstracts are not full-text articles, and search results are not a clinical recommendation.</p></div>
      </div>

      <form className="research-search-form" onSubmit={(event) => runSearch(event, 1)}>
        <label htmlFor="research-question">What do you want to find?</label>
        <textarea id="research-question" value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={3} placeholder="e.g. Recent evidence for SGLT2 inhibitors in heart failure, including people without diabetes" />
        <div className="research-search-filters">
          <label><span><Filter size={15} /> Publication date</span><select value={years} onChange={(event) => setYears(event.target.value)}><option value="1">Past year</option><option value="3">Past 3 years</option><option value="5">Past 5 years</option><option value="10">Past 10 years</option><option value="any">Any time</option></select></label>
          <label><span><BookOpen size={15} /> Evidence type</span><select value={studyType} onChange={(event) => setStudyType(event.target.value)}><option value="all">All study types</option><option value="reviews">Systematic reviews / meta-analyses</option><option value="trials">Clinical trials</option></select></label>
          <label className="research-open-access"><input type="checkbox" checked={openAccessOnly} onChange={(event) => setOpenAccessOnly(event.target.checked)} /> Open-access records only</label>
        </div>
        <div className="research-search-actions"><button className="primary" type="submit" disabled={loading}><Search size={16} /> {loading ? "Searching papers…" : "Search papers"} </button><span>Searches Europe PMC directly · results may include records without abstracts</span></div>
      </form>

      {error && <div className="research-error" role="alert"><b>Search could not complete</b><p>{error}</p></div>}
      {loading && <div className="research-loading" role="status"><LoaderCircle className="spin" size={22} /><span>Searching publication records…</span></div>}
      {!loading && searched && !error && articles.length === 0 && <div className="research-empty"><Search size={25} /><h3>No matching papers found</h3><p>Try a broader question, expand the date range, or switch evidence type to “All study types”.</p></div>}

      {articles.length > 0 && <>
        <div className="research-results-summary"><div><b>{hitCount?.toLocaleString() ?? articles.length}</b> matching records <span>· showing {articles.length}</span></div><a href={`https://europepmc.org/search?query=${encodeURIComponent(buildSearchQuery(prompt, years, studyType, openAccessOnly))}`} target="_blank" rel="noreferrer">Open search in Europe PMC <ExternalLink size={14} /></a></div>
        <div className="research-article-list">
          {articles.map((article, index) => {
            const types = article.pubTypeList?.pubType ?? [];
            const hasAbstract = Boolean(article.abstractText?.trim());
            const hasFullText = article.inEPMC === "Y" && Boolean(article.pmcid);
            return <article className="research-article" key={`${article.source ?? "src"}-${article.id}-${index}`}>
              <div className="research-article-meta"><span>{article.pubYear || article.firstPublicationDate || "Date not supplied"}</span>{article.journalTitle && <span>{article.journalTitle}</span>}{types.slice(0, 2).map((type) => <span className="research-type-chip" key={type}>{type}</span>)}</div>
              <h3><a href={articleLink(article)} target="_blank" rel="noreferrer">{article.title || "Untitled record"} <ExternalLink size={14} /></a></h3>
              <p className="research-authors">{article.authorString || "Author information not supplied by the database"}</p>
              <div className="research-availability"><span className={hasAbstract ? "availability-yes" : ""}><FileText size={14} /> {hasAbstract ? "Abstract available" : "No abstract in this record"}</span><span className={hasFullText ? "availability-yes" : ""}><BookOpen size={14} /> {hasFullText ? "Full text available at Europe PMC" : "Full text not confirmed here"}</span>{article.doi && <span>DOI: {article.doi}</span>}{article.pmid && <span>PMID: {article.pmid}</span>}</div>
              {hasAbstract && <details className="research-abstract"><summary>Read abstract</summary><p>{article.abstractText}</p></details>}
              <div className="research-article-links"><a href={articleLink(article)} target="_blank" rel="noreferrer">View publication record <ExternalLink size={14} /></a>{article.pmcid && <a href={`https://europepmc.org/articles/${article.pmcid}`} target="_blank" rel="noreferrer">Open full text <ExternalLink size={14} /></a>}{article.doi && <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noreferrer">Publisher / DOI <ExternalLink size={14} /></a>}</div>
            </article>;
          })}
        </div>
        {articles.length < (hitCount ?? 0) && <button className="research-load-more" disabled={loading} onClick={() => runSearch(undefined, page + 1)}>{loading ? "Loading…" : "Load more papers"}</button>}
      </>}
      <p className="research-search-footnote">Coverage and indexing vary by source. Study-type labels reflect database metadata and may be missing or imperfect. Verify eligibility, methods, results and current publication status in the original article before citing it.</p>
    </section>
  );
}
