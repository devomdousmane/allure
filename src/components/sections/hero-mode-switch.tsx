"use client";

import { HomeHero } from "@/components/sections/home-hero";
// Conservé hors circuit : import { CinematicHero } from "@/components/sections/cinematic-hero";

/**
 * Point d’entrée du hero home.
 * CinematicHero reste dans le repo mais n’est plus monté ici.
 */
export function HeroModeSwitch() {
  return (
    <div className="relative">
      <HomeHero />
    </div>
  );
}
