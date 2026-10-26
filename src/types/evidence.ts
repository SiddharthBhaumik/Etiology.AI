export type EvidenceSourceType =
  | "Biomedical archive"
  | "Research database"
  | "Guidelines"
  | "Evidence synthesis"
  | "Indian medical education";

export type ReviewStatus = "Directory" | "Metadata checked" | "Content reviewed";

export interface EvidenceSource {
  id: string;
  title: string;
  organisation: string;
  sourceType: EvidenceSourceType;
  description: string;
  url: string;
  topics: string[];
  reviewStatus: ReviewStatus;
  publicationYear?: number;
  identifier?: string;
  lastChecked?: string;
  accessNote: string;
}
