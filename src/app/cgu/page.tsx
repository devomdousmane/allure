import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { LEGAL_DOCUMENTS } from "@/lib/legal";
import { legalMetadata } from "@/lib/seo";

const doc = LEGAL_DOCUMENTS.cgu;

export const metadata: Metadata = legalMetadata(doc);

export default function CguPage() {
  return <LegalDocumentPage document={doc} />;
}
