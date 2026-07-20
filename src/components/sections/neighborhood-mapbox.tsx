"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

// Coordonnées vérifiées via géocodage OpenStreetMap (Nominatim) — Route des
// Almadies / Route de King Fahd, quartier des Almadies, Dakar.
const RESIDENCE: [number, number] = [-17.519, 14.744];

const POINTS: {
  coords: [number, number];
  label: string;
  distance: string;
}[] = [
  { coords: [-17.5287, 14.7449], label: "Plage des Almadies", distance: "300 m" },
  { coords: [-17.5155, 14.7395], label: "Écoles internationales", distance: "5 min" },
  { coords: [-17.5135, 14.7425], label: "Commerces & restaurants", distance: "3 min" },
  { coords: [-17.0735, 14.665], label: "Aéroport AIBD à proximité", distance: "35 min" },
];

const STYLE = "mapbox://styles/mapbox/satellite-streets-v12";

// Pin en goutte moderne (pointe basse = point exact des coordonnées),
// dégradé + ombre pour un rendu plus soigné que le simple cercle plein.
function pinSvg(fill: string, iconPath: string) {
  return `
    <svg width="34" height="42" viewBox="0 0 34 42" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-20%" width="200%" height="150%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <path filter="url(#shadow)" d="M17 0C7.6 0 0 7.6 0 17c0 11.2 14.3 23.4 15.9 24.7.6.5 1.6.5 2.2 0C19.7 40.4 34 28.2 34 17 34 7.6 26.4 0 17 0Z" fill="${fill}"/>
      <circle cx="17" cy="17" r="10" fill="white"/>
      <g transform="translate(9.5, 9.5)" stroke="${fill}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
        ${iconPath}
      </g>
    </svg>
  `;
}

const ICONS = {
  home: '<path d="M0 6.5 7 1l7 5.5v7.5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1Z"/><path d="M4.5 15V8h5v7"/>',
  waves:
    '<path d="M0 6c1.2-1.2 2.5-1.2 3.7 0 1.2 1.2 2.5 1.2 3.7 0 1.2-1.2 2.5-1.2 3.7 0 1.2 1.2 2.5 1.2 3.7 0"/><path d="M0 11c1.2-1.2 2.5-1.2 3.7 0 1.2 1.2 2.5 1.2 3.7 0 1.2-1.2 2.5-1.2 3.7 0 1.2 1.2 2.5 1.2 3.7 0"/>',
  school:
    '<path d="M7 0 0 3.5 7 7l7-3.5Z"/><path d="M2.5 5.2v4.3c0 1 2 2 4.5 2s4.5-1 4.5-2V5.2"/>',
  shop: '<path d="M1 4h12l-1 9H2Z"/><path d="M4 4V2.5A3 3 0 0 1 7 -0.5a3 3 0 0 1 3 3V4"/>',
  plane:
    '<path d="M7 0v14M0 4.5 14 9M0 9 14 4.5M4 12l3 2 3-2"/>',
};

export function NeighborhoodMapbox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mounted, setMounted] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !token || !containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;
    // Désactive la télémétrie Mapbox (events.mapbox.com) — souvent bloquée
    // par les adblockers (ERR_BLOCKED_BY_CLIENT) sans impact sur la carte.
    Object.defineProperty(mapboxgl.config, "EVENTS_URL", {
      value: null,
      writable: false,
      configurable: true,
    });

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: STYLE,
      center: RESIDENCE,
      zoom: 13.5,
      pitch: 45,
      attributionControl: false,
      collectResourceTiming: false,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    const residenceEl = document.createElement("div");
    residenceEl.style.cursor = "pointer";
    residenceEl.innerHTML = pinSvg("#1E4B5D", ICONS.home);
    new mapboxgl.Marker({ element: residenceEl, anchor: "bottom" })
      .setLngLat(RESIDENCE)
      .setPopup(
        new mapboxgl.Popup({ offset: 30, closeButton: false }).setHTML(
          '<div style="font-family: var(--font-sans); font-size: 12px; font-weight: 600; color: #1E4B5D;">Résidence Allure</div>'
        )
      )
      .addTo(map);

    const pointIcons = [ICONS.waves, ICONS.school, ICONS.shop, ICONS.plane];
    POINTS.forEach((point, i) => {
      const el = document.createElement("div");
      el.style.cursor = "pointer";
      el.innerHTML = pinSvg("#E0BF89", pointIcons[i]);

      new mapboxgl.Marker({ element: el, anchor: "bottom", scale: 0.85 })
        .setLngLat(point.coords)
        .setPopup(
          new mapboxgl.Popup({ offset: 26, closeButton: false }).setHTML(
            `<div style="font-family: var(--font-sans);">
              <div style="font-weight: 600; font-size: 13px; color: #1E4B5D;">${point.distance}</div>
              <div style="font-size: 11px; color: #6b6b6b;">${point.label}</div>
            </div>`
          )
        )
        .addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mounted, token]);

  if (!mounted) return null;

  if (!token) {
    return (
      <div className="flex aspect-square w-full max-w-md flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-allure-petrol/20 bg-allure-petrol/5 p-8 text-center dark:border-white/20 dark:bg-white/5 sm:max-w-lg">
        <MapPin className="h-8 w-8 text-allure-petrol/40 dark:text-white/40" />
        <p className="font-sans text-sm text-allure-ink/60 dark:text-white/60">
          Carte interactive indisponible — ajoutez votre token Mapbox dans
          <code className="mx-1 rounded bg-allure-petrol/10 px-1.5 py-0.5 text-xs dark:bg-white/10">
            NEXT_PUBLIC_MAPBOX_TOKEN
          </code>
          (.env.local).
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-allure-petrol/10 shadow-lg dark:border-white/10 sm:max-w-lg"
    />
  );
}
