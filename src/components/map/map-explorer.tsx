"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Map as LeafletMap, Marker } from "leaflet";
import { ArrowRight, Crosshair, MapPin, Search, X } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { mapCategoryMeta } from "@/data/map-locations";
import { matchesQuery } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { MapCategory, MapLocation } from "@/types/content";
import "leaflet/dist/leaflet.css";

const SIZE = 1000;
const categories = Object.keys(mapCategoryMeta) as MapCategory[];

/**
 * Interaktive Karte auf Basis von Leaflet (CRS.Simple = eigenes Pixel-Koordinatensystem).
 * Das Kartenbild ist ein selbst erstellter Platzhalter. Sobald rechtlich nutzbare
 * Kartendaten vorliegen, kann imageUrl ausgetauscht werden (oder Kacheln per L.tileLayer).
 */
export function MapExplorer({ locations, imageUrl, initialMarker }: { locations: MapLocation[]; imageUrl: string; initialMarker?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Set<MapCategory>>(() => new Set(categories));
  const [selectedId, setSelectedId] = useState<string | undefined>(initialMarker);

  const visible = useMemo(
    () => locations.filter((l) => active.has(l.category) && (!query || matchesQuery(query, l.title, l.description))),
    [locations, active, query],
  );
  const selected = locations.find((l) => l.id === selectedId);

  // Karte einmalig initialisieren (Leaflet benötigt window → dynamischer Import)
  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;
    (async () => {
      try {
        const L = (await import("leaflet")).default;
        if (cancelled || !containerRef.current || mapRef.current) return;
        const bounds = L.latLngBounds([0, 0], [SIZE, SIZE]);
        const map = L.map(containerRef.current, {
          crs: L.CRS.Simple,
          minZoom: -1,
          maxZoom: 2,
          zoomSnap: 0.25,
          maxBounds: bounds.pad(0.2),
          attributionControl: true,
        });
        L.imageOverlay(imageUrl, bounds, { alt: "Selbst erstellte Platzhalter-Karte" }).addTo(map);
        map.attributionControl.setPrefix(false);
        map.attributionControl.addAttribution("Platzhalter-Karte © GTA6-Kompass");
        map.fitBounds(bounds);

        for (const loc of locations) {
          const color = mapCategoryMeta[loc.category].color;
          const icon = L.divIcon({
            className: "",
            html: `<span style="display:block;width:22px;height:22px;border-radius:9999px;background:${color};border:3px solid #100F20;box-shadow:0 0 0 2px ${color}66,0 6px 16px -4px ${color}"></span>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });
          const marker = L.marker([SIZE - loc.y, loc.x], { icon, title: loc.title, keyboard: true, alt: loc.title });
          marker.on("click", () => setSelectedId(loc.id));
          markers.set(loc.id, marker);
        }
        mapRef.current = map;
        setReady(true);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markers.clear();
    };
  }, [locations, imageUrl]);

  // Sichtbare Marker synchronisieren
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const ids = new Set(visible.map((v) => v.id));
    markersRef.current.forEach((marker, id) => {
      if (ids.has(id)) marker.addTo(map);
      else marker.remove();
    });
  }, [visible, ready]);

  // Ausgewählten Marker anfliegen
  useEffect(() => {
    if (!ready || !selected || !mapRef.current) return;
    mapRef.current.flyTo([SIZE - selected.y, selected.x], 1, { duration: 0.6 });
  }, [selected, ready]);

  const toggle = (c: MapCategory) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <aside className="surface order-2 flex flex-col gap-4 p-4 lg:order-1 lg:max-h-[640px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Marker suchen…"
            aria-label="Marker suchen"
            maxLength={60}
            className="h-11 w-full rounded-xl border border-line bg-night-2 pl-9 pr-3 text-sm outline-none focus:border-teal"
          />
        </div>
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Kategorien</legend>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={active.has(c)}
                onClick={() => toggle(c)}
                className={cn("inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition", active.has(c) ? "border-white/30 bg-white/10 text-white" : "border-line text-muted opacity-60")}
              >
                <span className="size-2.5 rounded-full" style={{ background: mapCategoryMeta[c].color }} aria-hidden="true" />
                {mapCategoryMeta[c].label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <p className="mb-2 text-xs text-muted" role="status">
            {visible.length} von {locations.length} Markern sichtbar
          </p>
          {visible.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">Keine Marker für diese Auswahl.</p>
          ) : (
            <ul className="grid gap-1.5">
              {visible.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(l.id)}
                    aria-current={selectedId === l.id ? "true" : undefined}
                    className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-white/5", selectedId === l.id && "bg-white/10")}
                  >
                    <span className="size-3 shrink-0 rounded-full" style={{ background: mapCategoryMeta[l.category].color }} aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{l.title}</span>
                    <Crosshair className="size-4 text-muted" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      <div className="relative order-1 lg:order-2">
        <div ref={containerRef} className="h-[460px] w-full overflow-hidden rounded-[1.25rem] border border-line sm:h-[640px]" role="application" aria-label="Interaktive Platzhalter-Karte" />
        {!ready && !loadError && (
          <div className="absolute inset-0 grid place-items-center rounded-[1.25rem] bg-night-2 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="size-3 animate-ping rounded-full bg-teal" aria-hidden="true" /> Karte wird geladen…
            </span>
          </div>
        )}
        {loadError && (
          <div role="alert" className="absolute inset-0 grid place-items-center rounded-[1.25rem] bg-night-2 p-6 text-center text-sm text-danger">
            Die Karte konnte nicht geladen werden. Bitte lade die Seite neu.
          </div>
        )}
        {selected && (
          <div className="surface absolute inset-x-3 bottom-3 z-[500] p-4 sm:left-auto sm:right-4 sm:w-80" aria-live="polite">
            <button type="button" onClick={() => setSelectedId(undefined)} aria-label="Details schließen" className="absolute right-3 top-3 grid size-8 place-items-center rounded-full text-muted hover:bg-white/10 hover:text-white">
              <X className="size-4" aria-hidden="true" />
            </button>
            <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: mapCategoryMeta[selected.category].color }}>
              <MapPin className="size-3.5" aria-hidden="true" /> {mapCategoryMeta[selected.category].label}
            </p>
            <h2 className="pr-8 font-bold">{selected.title}</h2>
            <p className="mt-1 text-sm text-muted">{selected.description}</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <StatusBadge status={selected.status} />
              {selected.href && (
                <Link href={selected.href} className="inline-flex items-center gap-1 text-sm font-semibold text-teal hover:text-white">
                  Details <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
