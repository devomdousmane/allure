import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { CookiePreferences } from "@/components/legal/cookie-preferences";
import { LEGAL_DOCUMENTS } from "@/lib/legal";
import { legalMetadata } from "@/lib/seo";

const doc = LEGAL_DOCUMENTS.cookies;

export const metadata: Metadata = legalMetadata(doc);

export default function CookiesPage() {
  return (
    <LegalDocumentPage document={doc}>
      <CookiePreferences />
    </LegalDocumentPage>
  );
}
