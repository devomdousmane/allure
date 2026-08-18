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
import { useCookieConsentOptional } from "@/components/legal/cookie-consent-provider";

registerGsap();

const DEFAULT_CTA: HomeChapterCta = {
  label: "Planifier une visite",
  href: "/rendez-vous",
};

/** Floating CTA — follows active chapter, hidden on contact/faq. */
export function FloatingVisitCta() {
  const [cta, setCta] = useState<HomeChapterCta>(DEFAULT_CTA);
  const [visible, setVisible] = useState(false);
  const [hiddenOnEnd, setHiddenOnEnd] = useState(false);
  const cookies = useCookieConsentOptional();

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

    // Masquer le CTA flottant sur le parcours horizontal (pas de chapitre home)
    ["contact", "faq", "dakar"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (id === "dakar") {
              if (self.isActive) setHiddenOnEnd(true);
              else setHiddenOnEnd(false);
              return;
            }
            if (self.isActive) setHiddenOnEnd(true);
            else setHiddenOnEnd(false);
          },
        })
      );
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  const show = visible && !hiddenOnEnd;

  return (
    <div
      className={cn(
        "fixed right-4 z-50 transition-all duration-500 sm:bottom-8 sm:right-6 xl:right-20",
        cookies?.bannerVisible ? "bottom-44" : "bottom-6",
        /* Laisse la place à SkipToContent (icône ~44px) en bas à droite */
        show ? "opacity-100 -translate-y-14" : "pointer-events-none opacity-0",
      )}
    >
      <Link
        href={cta.href}
        className="btn-cta cursor-pointer gap-2 font-sans text-xs uppercase tracking-[0.14em]"
      >
        {cta.label}
        <ArrowUpRight className="size-3.5" />
      </Link>
    </div>
  );
}
