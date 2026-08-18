"use client";

/**
 * Gold horizontal rule through WhoWeAre.
 * Scale is driven by WhoWeAreSection’s entrance timeline ([data-presence-line]).
 */
export function AnnexPresenceLine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[42%] z-[3] flex justify-center"
    >
      <div
        data-presence-line
        className="h-px w-[min(70%,36rem)] origin-center scale-x-0 bg-gradient-to-r from-transparent via-allure-gold to-transparent will-change-transform"
      />
    </div>
  );
}
