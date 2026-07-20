"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/gsap/register";
import {
  HOME_CHAPTERS,
  type HomeChapterCta,
} from "@/components/home-scroll/home-chapters";
import { cn } from "@/lib/utils";

registerGsap();

const DEFAULT_CTA: HomeChapterCta = {
  label: "Planifier une visite",
  href: "/contact",
};

/** Floating CTA — follows active chapter, hidden on contact/faq. */
export function FloatingVisitCta() {
  const [cta, setCta] = useState<HomeChapterCta>(DEFAULT_CTA);
  const [visible, setVisible] = useState(false);
  const [hiddenOnEnd, setHiddenOnEnd] = useState(false);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    const first = document.getElementById("qui-sommes-nous");
    if (first) {
      triggers.push(
        ScrollTrigger.create({
          trigger: first,
          start: "top 70%",
          onEnter: () => setVisible(true),
          onLeaveBack: () => setVisible(false),
        })
      );
    }

    HOME_CHAPTERS.forEach((chapter) => {
      const el = document.getElementById(chapter.id);
      if (!el || !chapter.cta) return;

      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive && chapter.cta) setCta(chapter.cta);
          },
        })
      );
    });

    ["contact", "faq"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          end: "bottom bottom",
          onToggle: (self) => {
            if (self.isActive) setHiddenOnEnd(true);
            else setHiddenOnEnd(false);
          },
        })
      );
    });

    ScrollTrigger.refresh();

    return () => triggers.forEach((t) => t.kill());
  }, []);

  const show = visible && !hiddenOnEnd;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-4 z-50 transition-all duration-500 sm:bottom-8 sm:right-6 xl:right-20",
        show ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <Link
        href={cta.href}
        className="btn-3d-gold inline-flex cursor-pointer items-center gap-2 rounded-full bg-allure-gold px-5 py-3 font-sans text-xs uppercase tracking-[0.14em] text-allure-petrol-deep shadow-lg transition-colors hover:bg-allure-gold/90"
      >
        {cta.label}
        <ArrowUpRight className="size-3.5" />
      </Link>
    </div>
  );
}
