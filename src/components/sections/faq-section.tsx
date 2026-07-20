"use client";

import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { FAQS } from "@/lib/faqs";
import { useSectionReveal } from "@/hooks/use-section-reveal";

export function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative bg-white py-24 lg:py-32 dark:bg-allure-petrol-deep"
    >
      <SectionSeam from={SEAM.sand} fromDark={SEAM.petrol} />
      <div className="relative z-[2] mx-auto max-w-3xl px-6">
        <div className="mb-14 text-center">
          <p
            data-reveal="eyebrow"
            className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            Questions fréquentes
          </p>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-4 font-heading text-3xl text-allure-petrol sm:text-4xl dark:text-allure-sand"
          >
            Vous avez des questions ?
          </h2>
        </div>

        <div>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`item-${i}`}
                data-reveal="item"
                className="border-allure-petrol/10 py-2 dark:border-allure-sand/10"
              >
                <AccordionTrigger className="font-heading text-base text-allure-petrol hover:no-underline dark:text-allure-sand">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-allure-ink/60 dark:text-allure-sand/60">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
