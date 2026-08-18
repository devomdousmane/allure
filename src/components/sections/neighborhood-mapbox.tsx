"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import {
  ALLURE_RESIDENCE,
  CATEGORY_COLORS,
  POI_PIN_PATHS,
  poisForCategory,
  type NeighborhoodCategory,
  type NeighborhoodPoi,
} from "@/lib/neighborhood";
import { cn } from "@/lib/utils";

/** Vue sombre 3D — plus lisible pour les pins Allure que le satellite. */
const STYLE = "mapbox://styles/mapbox/dark-v11";

function pinSvg(fill: string, iconPath: string, active = false) {
  const size = active ? 40 : 34;
  const h = active ? 50 : 42;
  return `
    <svg width="${size}" height="${h}" viewBox="0 0 34 42" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="s" x="-50%" y="-20%" width="200%" height="150%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-color="#000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <path filter="url(#s)" d="M17 0C7.6 0 0 7.6 0 17c0 11.2 14.3 23.4 15.9 24.7.6.5 1.6.5 2.2 0C19.7 40.4 34 28.2 34 17 34 7.6 26.4 0 17 0Z" fill="${fill}"/>
      <circle cx="17" cy="17" r="10" fill="white"/>
      <g transform="translate(9.5, 9.5)" stroke="${fill}" stroke-width="1.55" fill="none" stroke-linecap="round" stroke-linejoin="round">
        ${iconPath}
      </g>
    </svg>
  `;
}

function popupHtml(poi: NeighborhoodPoi) {
  return `<div style="font-family:system-ui,sans-serif;min-width:140px;padding:2px 0">
    <div style="font-weight:600;font-size:13px;color:#1E4B5D">${poi.distance}</div>
    <div style="font-size:12px;color:#111;margin-top:2px">${poi.label}</div>
    <div style="font-size:11px;color:#6b6b6b;margin-top:4px;line-height:1.35">${poi.detail}</div>
  </div>`;
}

type NeighborhoodMapboxProps = {
  category: NeighborhoodCategory;
  activePoiId: string | null;
  onSelectPoi?: (id: string | null) => void;
  className?: string;
};

export function NeighborhoodMapbox({
  category,
  activePoiId,
  onSelectPoi,
  className,
}: NeighborhoodMapboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const residenceMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const onSelectRef = useRef(onSelectPoi);
  onSelectRef.current = onSelectPoi;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !token || !containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;
    Object.defineProperty(mapboxgl.config, "EVENTS_URL", {
      value: null,
      writable: false,
      configurable: true,
    });

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: STYLE,
      center: ALLURE_RESIDENCE,
      zoom: 13.8,
      pitch: 52,
      bearing: -28,
      attributionControl: false,
      collectResourceTiming: false,
      antialias: true,
    });
    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: true }),
      "top-right"
    );
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    map.on("load", () => {
      // Bâtiments 3D si la source composite est dispo
      try {
        if (map.getSource("composite") && !map.getLayer("3d-buildings")) {
          const layers = map.getStyle().layers ?? [];
          const labelLayer = layers.find(
            (l) =>
              l.type === "symbol" &&
              (l.layout as { "text-field"?: unknown })?.["text-field"]
          );
          map.addLayer(
            {
              id: "3d-buildings",
              source: "composite",
              "source-layer": "building",
              filter: ["==", "extrude", "true"],
              type: "fill-extrusion",
              minzoom: 14,
              paint: {
                "fill-extrusion-color": "#1a3038",
                "fill-extrusion-height": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  14,
                  0,
                  14.5,
                  ["get", "height"],
                ],
                "fill-extrusion-base": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  14,
                  0,
                  14.5,
                  ["get", "min_height"],
                ],
                "fill-extrusion-opacity": 0.65,
              },
            },
            labelLayer?.id
          );
        }
      } catch {
        /* style sans buildings — ok */
      }
      setMapReady(true);
    });

    const residenceEl = document.createElement("div");
    residenceEl.style.cursor = "pointer";
    residenceEl.innerHTML = pinSvg("#E0BF89", POI_PIN_PATHS.home, true);
    residenceEl.setAttribute("aria-label", "Résidence Allure");
    const residenceMarker = new mapboxgl.Marker({
      element: residenceEl,
      anchor: "bottom",
    })
      .setLngLat(ALLURE_RESIDENCE)
      .setPopup(
        new mapboxgl.Popup({ offset: 32, closeButton: false }).setHTML(
          '<div style="font-family:system-ui,sans-serif;font-size:12px;font-weight:600;color:#1E4B5D">Résidence Allure</div><div style="font-size:11px;color:#6b6b6b;margin-top:2px">Route des Almadies</div>'
        )
      )
      .addTo(map);
    residenceMarkerRef.current = residenceMarker;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      residenceMarker.remove();
      residenceMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [mounted, token]);

  /** Sync markers selon catégorie / sélection. */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const pois = poisForCategory(category);

    pois.forEach((poi) => {
      const active = activePoiId === poi.id;
      const color = CATEGORY_COLORS[poi.category];
      const iconPath =
        poi.id === "airport"
          ? POI_PIN_PATHS.plane
          : POI_PIN_PATHS[poi.category];

      const el = document.createElement("button");
      el.type = "button";
      el.style.cursor = "pointer";
      el.style.background = "transparent";
      el.style.border = "none";
      el.style.padding = "0";
      el.setAttribute("aria-label", poi.label);
      el.innerHTML = pinSvg(color, iconPath, active);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRef.current?.(active ? null : poi.id);
      });

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
        scale: active ? 1 : 0.9,
      })
        .setLngLat(poi.coords)
        .setPopup(
          new mapboxgl.Popup({
            offset: 28,
            closeButton: false,
            maxWidth: "220px",
          }).setHTML(popupHtml(poi))
        )
        .addTo(map);

      if (active) marker.togglePopup();
      markersRef.current.push(marker);
    });

    if (activePoiId) {
      const poi = pois.find((p) => p.id === activePoiId);
      if (poi) {
        map.flyTo({
          center: poi.coords,
          zoom: poi.zoom ?? 14.8,
          pitch: poi.id === "airport" ? 35 : 52,
          bearing: poi.id === "airport" ? 0 : -28,
          essential: true,
          duration: 1200,
        });
        return;
      }
    }

    // Vue d’ensemble des POIs filtrés
    if (pois.length === 0) {
      map.flyTo({
        center: ALLURE_RESIDENCE,
        zoom: 13.8,
        pitch: 52,
        bearing: -28,
        essential: true,
        duration: 900,
      });
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(ALLURE_RESIDENCE);
    pois.forEach((p) => bounds.extend(p.coords));
    map.fitBounds(bounds, {
      padding: { top: 72, bottom: 72, left: 56, right: 56 },
      maxZoom: category === "transport" ? 12.8 : 14.6,
      pitch: 48,
      bearing: -22,
      duration: 1000,
      essential: true,
    });
  }, [category, activePoiId, mapReady]);

  if (!mounted) return null;

  if (!token) {
    return (
      <div
        className={cn(
          "flex min-h-[22rem] w-full flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-allure-petrol/20 bg-allure-petrol/5 p-8 text-center dark:border-white/20 dark:bg-white/5 lg:min-h-[32rem]",
          className
        )}
      >
        <MapPin className="h-8 w-8 text-allure-petrol/40 dark:text-white/40" />
        <p className="max-w-sm font-sans text-sm text-allure-ink/60 dark:text-white/60">
          Carte interactive indisponible — ajoutez{" "}
          <code className="rounded bg-allure-petrol/10 px-1.5 py-0.5 text-xs dark:bg-white/10">
            NEXT_PUBLIC_MAPBOX_TOKEN
          </code>{" "}
          dans `.env.local`.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-[min(70vh,36rem)] w-full overflow-hidden rounded-[1.75rem] border border-allure-petrol/10 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)] dark:border-white/10 lg:h-[min(75vh,42rem)]",
        className
      )}
    />
  );
}
