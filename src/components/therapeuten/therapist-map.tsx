"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export interface TherapistMarker {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  title?: string;
  city?: string;
  canton?: string;
  latitude: number;
  longitude: number;
  specializations?: string[];
  photo_url?: string;
}

interface TherapistMapProps {
  therapists: TherapistMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (slug: string) => void;
  className?: string;
  mini?: boolean;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export function TherapistMap({
  therapists,
  center,
  zoom,
  onMarkerClick,
  className = "",
  mini = false,
}: TherapistMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  const initMap = useCallback(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const defaultCenter: [number, number] = [
      center?.lng ?? 8.2275,
      center?.lat ?? 46.8182,
    ];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: defaultCenter,
      zoom: zoom ?? (center ? 10 : 7.5),
      attributionControl: !mini,
    });

    if (!mini) {
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }

    map.current.on("load", () => {
      setLoaded(true);
      addTherapists();
    });
  }, [center, zoom, mini]);

  const addTherapists = useCallback(() => {
    if (!map.current || !map.current.loaded()) return;

    const sourceId = "therapists";

    // Remove existing source/layer
    if (map.current.getSource(sourceId)) {
      map.current.removeLayer("clusters");
      map.current.removeLayer("cluster-count");
      map.current.removeLayer("unclustered-point");
      map.current.removeSource(sourceId);
    }

    if (therapists.length === 0) return;

    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: therapists
        .filter((t) => t.latitude && t.longitude)
        .map((t) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [t.longitude, t.latitude],
          },
          properties: {
            id: t.id,
            slug: t.slug,
            name: `${t.first_name} ${t.last_name}`,
            title: t.title || "",
            city: t.city || "",
            canton: t.canton || "",
          },
        })),
    };

    map.current.addSource(sourceId, {
      type: "geojson",
      data: geojson,
      cluster: !mini,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    if (!mini) {
      // Cluster circles
      map.current.addLayer({
        id: "clusters",
        type: "circle",
        source: sourceId,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#2471A3",
            10,
            "#1B4F72",
            30,
            "#154360",
          ],
          "circle-radius": ["step", ["get", "point_count"], 20, 10, 28, 30, 36],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Cluster count text
      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: sourceId,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 13,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });
    }

    // Individual markers
    map.current.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: sourceId,
      filter: mini ? ["all"] : ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#1B4F72",
        "circle-radius": mini ? 8 : 8,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    // Click on cluster -> zoom in
    if (!mini) {
      map.current.on("click", "clusters", (e) => {
        const features = map.current!.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        if (!features.length) return;
        const clusterId = features[0].properties!.cluster_id;
        const source = map.current!.getSource(sourceId) as mapboxgl.GeoJSONSource;
        (source.getClusterExpansionZoom as (id: number, callback: (err: Error | null, zoom: number) => void) => void)(
          clusterId,
          (err, clusterZoom) => {
            if (err || !map.current) return;
            map.current.easeTo({
              center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
              zoom: clusterZoom,
            });
          }
        );
      });
    }

    // Click on individual point -> show popup
    map.current.on("click", "unclustered-point", (e) => {
      const features = map.current!.queryRenderedFeatures(e.point, {
        layers: ["unclustered-point"],
      });
      if (!features.length) return;

      const feature = features[0];
      const props = feature.properties!;
      const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];

      if (onMarkerClick) {
        onMarkerClick(props.slug);
        return;
      }

      const popup = new mapboxgl.Popup({ offset: 15, maxWidth: "250px" })
        .setLngLat(coords)
        .setHTML(
          `<div style="font-family: sans-serif;">
            <p style="font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">${props.name}</p>
            ${props.title ? `<p style="color: #64748b; margin: 0 0 4px 0; font-size: 12px;">${props.title}</p>` : ""}
            ${props.city ? `<p style="color: #64748b; margin: 0 0 8px 0; font-size: 12px;">${props.city}${props.canton ? `, ${props.canton}` : ""}</p>` : ""}
            <a href="/therapeuten/${props.slug}" style="color: #1B4F72; font-size: 13px; font-weight: 500;">Profil ansehen &rarr;</a>
          </div>`
        )
        .addTo(map.current!);
    });

    // Cursor pointer on hover
    map.current.on("mouseenter", "unclustered-point", () => {
      map.current!.getCanvas().style.cursor = "pointer";
    });
    map.current.on("mouseleave", "unclustered-point", () => {
      map.current!.getCanvas().style.cursor = "";
    });
    if (!mini) {
      map.current.on("mouseenter", "clusters", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "clusters", () => {
        map.current!.getCanvas().style.cursor = "";
      });
    }

    // Fit bounds to markers if not mini
    if (!mini && therapists.length > 1 && !center) {
      const bounds = new mapboxgl.LngLatBounds();
      therapists.forEach((t) => {
        if (t.latitude && t.longitude) {
          bounds.extend([t.longitude, t.latitude]);
        }
      });
      map.current.fitBounds(bounds, { padding: 60, maxZoom: 12 });
    }
  }, [therapists, center, mini, onMarkerClick]);

  useEffect(() => {
    initMap();
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initMap]);

  useEffect(() => {
    if (loaded) {
      addTherapists();
    }
  }, [loaded, addTherapists]);

  if (!MAPBOX_TOKEN) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border bg-muted text-sm text-muted-foreground ${className}`}
      >
        Karte nicht verfügbar (Mapbox-Token fehlt)
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className={`rounded-2xl overflow-hidden ${className}`}
    />
  );
}
