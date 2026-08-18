import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionSharp, SHARP } from "@/components/ui/section-sharp";
import {
  LEGAL_LINKS,
  type LegalDocument,
} from "@/lib/legal";
import { PageJsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils";

type LegalDocumentPageProps = {
  document: LegalDocument;
  children?: ReactNode;
};

export function LegalDocumentPage({ document, children }: LegalDocumentPageProps) {
  return (
    <>
      <PageJsonLd
        title={document.title}
        path={`/${document.slug}`}
        description={document.description}
      />
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <header className="relative overflow-hidden bg-allure-sand pb-16 pt-28 dark:bg-allure-petrol lg:pb-20 lg:pt-32">
          <div className="relative z-[2] mx-auto max-w-3xl px-6 text-center">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold">
              {document.eyebrow}
            </p>
            <h1 className="mt-4 font-heading text-3xl text-allure-petrol sm:text-4xl lg:text-5xl dark:text-allure-sand">
              {document.title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl font-sans text-sm text-allure-ink/65 dark:text-allure-sand/65">
              {document.description}
            </p>
            <p className="mt-6 font-sans text-[11px] uppercase tracking-[0.2em] text-allure-ink/40 dark:text-allure-sand/40">
              Mise à jour — {document.updatedAt}
            </p>
          </div>
          <SectionSharp
            edge="bottom"
            fill={SHARP.white}
            fillDark={SHARP.petrolDeep}
            variant="fold"
          />
        </header>

        <section className="relative bg-white py-16 dark:bg-allure-petrol-deep lg:py-24">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-allure-ink/40 dark:text-allure-sand/40">
                Documents
              </p>
              <nav aria-label="Pages légales" className="mt-4 flex flex-col gap-2">
                {LEGAL_LINKS.map((link) => {
                  const active = link.href === `/${document.slug}`;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "font-sans text-sm transition-colors",
                        active
                          ? "text-allure-petrol dark:text-allure-gold"
                          : "text-allure-ink/55 hover:text-allure-petrol dark:text-allure-sand/55 dark:hover:text-allure-gold"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <article className="min-w-0">
              <div className="flex flex-col gap-12">
                {document.sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    <h2 className="font-heading text-xl text-allure-petrol sm:text-2xl dark:text-allure-sand">
                      {section.title}
                    </h2>
                    <div className="mt-4 flex flex-col gap-4">
                      {section.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 48)}
                          className="font-sans text-sm leading-relaxed text-allure-ink/70 dark:text-allure-sand/70"
                        >
                          {paragraph}
                        </p>
                      ))}
                      {section.bullets?.length ? (
                        <ul className="flex flex-col gap-2.5 border-l border-allure-gold/40 pl-4">
                          {section.bullets.map((item) => (
                            <li
                              key={item}
                              className="font-sans text-sm leading-relaxed text-allure-ink/70 dark:text-allure-sand/70"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </section>
                ))}
              </div>

              {children ? <div className="mt-12">{children}</div> : null}

              <p className="mt-16 border-t border-allure-petrol/10 pt-8 font-sans text-xs text-allure-ink/45 dark:border-allure-sand/10 dark:text-allure-sand/45">
                Document informatif — pour toute précision juridique ou
                commerciale, contactez l’équipe Allure.
              </p>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
