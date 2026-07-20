export type ProgressPhase = {
  id: string;
  title: string;
  subtitle: string;
  status: "done" | "current" | "upcoming";
  image: string;
};

export const PROGRESS_PHASES: ProgressPhase[] = [
  {
    id: "phase-1",
    title: "Phase 1 — Terrassement & sous-sol",
    subtitle: "Fondations et infrastructures techniques.",
    status: "done",
    image: "/Allure/HD.webp",
  },
  {
    id: "phase-2",
    title: "Phase 2 — Rez-de-chaussée",
    subtitle: "Structure du RDC et locaux communs.",
    status: "done",
    image: "/Allure/HD_137.webp",
  },
  {
    id: "phase-3",
    title: "Phase 3 — 1er & 2ème étage",
    subtitle: "Élévation des premiers niveaux résidentiels.",
    status: "done",
    image: "/Allure/HD_139.webp",
  },
  {
    id: "phase-4",
    title: "Phase 4 — 3ème & 4ème étage",
    subtitle: "Poursuite du gros œuvre.",
    status: "done",
    image: "/Allure/HD_147.webp",
  },
  {
    id: "phase-5",
    title: "Phase 5 — 5ème & 7ème étage",
    subtitle: "Montée en hauteur de la structure.",
    status: "done",
    image: "/Allure/HD_172.webp",
  },
  {
    id: "phase-6",
    title: "Phase 6 — 8ème & 11ème étage",
    subtitle: "Derniers niveaux du gros œuvre.",
    status: "done",
    image: "/hero-sequence/frame_018.webp",
  },
  {
    id: "phase-7",
    title: "Phase 7 — Achèvement des gros œuvres",
    subtitle: "Cérémonie officielle et bascule vers second œuvre.",
    status: "current",
    image: "/hero-sequence/frame_024.webp",
  },
];
