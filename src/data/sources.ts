import type { EvidenceSource } from "../types/evidence";

/**
 * These are source-discovery portals, not claims that individual articles have
 * been clinically reviewed. Article-level records should only be marked
 * reviewed after a human has checked the original source and supporting passage.
 */
export const evidenceSources: EvidenceSource[] = [
  {
    id: "ncbi-bookshelf",
    title: "NCBI Bookshelf",
    organisation: "U.S. National Library of Medicine",
    sourceType: "Biomedical archive",
    description: "Search biomedical books, clinical guidelines, and other health-science documents hosted by the National Library of Medicine.",
    url: "https://www.ncbi.nlm.nih.gov/books/",
    topics: ["textbooks", "clinical medicine", "pathology", "physiology", "pharmacology"],
    reviewStatus: "Directory",
    accessNote: "Access and reuse rights vary by publication. Check the individual book's copyright and licence information."
  },
  {
    id: "pubmed",
    title: "PubMed",
    organisation: "U.S. National Library of Medicine",
    sourceType: "Research database",
    description: "Search biomedical and life-sciences literature, including citations and abstracts. Full text may be hosted elsewhere.",
    url: "https://pubmed.ncbi.nlm.nih.gov/",
    topics: ["research", "systematic reviews", "clinical medicine", "biomedical science"],
    reviewStatus: "Directory",
    accessNote: "A PubMed record is not itself a quality endorsement. Assess study design, relevance, and limitations."
  },
  {
    id: "pubmed-central",
    title: "PubMed Central",
    organisation: "U.S. National Library of Medicine",
    sourceType: "Biomedical archive",
    description: "Free full-text archive of biomedical and life-sciences journal literature.",
    url: "https://pmc.ncbi.nlm.nih.gov/",
    topics: ["full text", "biomedical research", "reviews", "clinical medicine"],
    reviewStatus: "Directory",
    accessNote: "Reuse permissions differ by article. Check the specific article's licence before copying or redistributing content."
  },
  {
    id: "europe-pmc",
    title: "Europe PMC",
    organisation: "EMBL's European Bioinformatics Institute and partners",
    sourceType: "Research database",
    description: "Search biomedical literature, abstracts, open-access full text, and related research information.",
    url: "https://europepmc.org/",
    topics: ["biomedical research", "open access", "publications", "life sciences"],
    reviewStatus: "Directory",
    accessNote: "Confirm the article's licence and publication details before reusing its content."
  },
  {
    id: "who-publications",
    title: "WHO Publications",
    organisation: "World Health Organization",
    sourceType: "Guidelines",
    description: "Find WHO guidelines, technical reports, and public-health publications.",
    url: "https://www.who.int/publications",
    topics: ["public health", "guidelines", "infectious diseases", "global health"],
    reviewStatus: "Directory",
    accessNote: "Check publication date, scope, updates, and applicability to the question and local setting."
  },
  {
    id: "cochrane",
    title: "Cochrane Library",
    organisation: "Cochrane",
    sourceType: "Evidence synthesis",
    description: "Find systematic reviews and evidence summaries that assess research on healthcare interventions.",
    url: "https://www.cochranelibrary.com/",
    topics: ["systematic reviews", "treatment", "prevention", "evidence-based medicine"],
    reviewStatus: "Directory",
    accessNote: "Some content may require a subscription. Review conclusions, certainty ratings, and publication dates."
  },
  {
    id: "icmr",
    title: "Indian Council of Medical Research",
    organisation: "ICMR",
    sourceType: "Indian medical education",
    description: "Find Indian biomedical research, guidance, and institutional publications relevant to local health contexts.",
    url: "https://www.icmr.gov.in/",
    topics: ["India", "clinical guidance", "public health", "biomedical research"],
    reviewStatus: "Directory",
    accessNote: "Verify the issuing body, publication date, current status, and intended population for each document."
  },
  {
    id: "nmc",
    title: "National Medical Commission",
    organisation: "National Medical Commission, India",
    sourceType: "Indian medical education",
    description: "Find official medical education regulations, competency-based curriculum resources, and notices.",
    url: "https://www.nmc.org.in/",
    topics: ["MBBS curriculum", "competencies", "medical education", "India"],
    reviewStatus: "Directory",
    accessNote: "Use the official current document and check whether a later revision or notice supersedes it."
  }
];
