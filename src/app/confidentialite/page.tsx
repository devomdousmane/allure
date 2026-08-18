import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { LEGAL_DOCUMENTS } from "@/lib/legal";
import { legalMetadata } from "@/lib/seo";

const doc = LEGAL_DOCUMENTS.confidentialite;

export const metadata: Metadata = legalMetadata(doc);

export default function ConfidentialitePage() {
  return <LegalDocumentPage document={doc} />;
}
