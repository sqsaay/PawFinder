"use client";

import Script from "next/script";
import type { LocationSearchResult } from "@/lib/location-search";
import LocationSearch from "./location-search";
import { useEffect, useEffectEvent, useId, useRef, useState } from "react";

export type MapPoint = { latitude: number; longitude: number };

type Coordinates = [number, number];

type Marker = {
    addTo: (map: MapView) => Marker;
    setLatLng: (point: Coordinates) => void;
    remove: () => void;
};

type MapView = {
    setView: (point: Coordinates, zoom: number) => MapView;
    on: (
        event: "click",
        callback: (event: { latlng: { lat: number; lng: number } }) => void,
    ) => void;
    getBounds: () => { contains: (point: Coordinates) => boolean };
    panTo: (point: Coordinates) => void;
    fitBounds: (
        bounds: [Coordinates, Coordinates],
        options: { maxZoom: number; padding: Coordinates },
    ) => void;
    remove: () => void;
};

type Leaflet = {
    map: (element: HTMLDivElement) => MapView;
    tileLayer: (
        url: string,
        options: { attribution: string; maxZoom: number },
    ) => {
        addTo: (map: MapView) => void;
    };
    icon: (options: {
        iconUrl: string;
        iconRetinaUrl: string;
        iconSize: Coordinates;
        iconAnchor: Coordinates;
    }) => object;
    marker: (
        point: Coordinates,
        options: { icon: object; interactive: boolean; keyboard: boolean },
    ) => Marker;
};

const leafletAssets = "https://unpkg.com/leaflet@1.9.4/dist";
const defaultCenter: MapPoint = { latitude: 20, longitude: 0 };

type Props = {
    value: MapPoint | null;
    onChange: (point: MapPoint) => void;
    initialCenter?: MapPoint;
};

export default function LocationPicker({
    value,
    onChange,
    initialCenter = defaultCenter,
}: Props) {
    const mapElement = useRef<HTMLDivElement>(null);
    const map = useRef<MapView | null>(null);
    const marker = useRef<Marker | null>(null);
    const leaflet = useRef<Leaflet | null>(null);
    const [mapStatus, setMapStatus] = useState<
        "loading" | "ready" | "unavailable"
    >("loading");
    const [draft, setDraft] = useState<Partial<Record<keyof MapPoint, string>>>(
        {},
    );
    const [error, setError] = useState("");
    const [place, setPlace] = useState<LocationSearchResult | null>(null);
    const instructionsId = useId();
    const errorId = useId();

    const selectPoint = useEffectEvent(
        ({ lat, lng }: { lat: number; lng: number }) => {
            const longitude = ((((lng + 180) % 360) + 360) % 360) - 180;
            onChange({
                latitude: Number(lat.toFixed(6)),
                longitude: Number(longitude.toFixed(6)),
            });
            setDraft({});
            setError("");
        },
    );

    const getStartLocation = useEffectEvent(() => ({
        point: value ?? initialCenter,
        zoom: value ? 13 : 2,
    }));

    useEffect(() => {
        const library = leaflet.current;
        const element = mapElement.current;
        if (mapStatus !== "ready" || !library || !element) return;

        const { point, zoom } = getStartLocation();
        const instance = library
            .map(element)
            .setView([point.latitude, point.longitude], zoom);
        map.current = instance;
        library
            .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            })
            .addTo(instance);
        instance.on("click", ({ latlng }) => selectPoint(latlng));

        return () => {
            instance.remove();
            map.current = null;
            marker.current = null;
        };
    }, [mapStatus]);

    useEffect(() => {
        const instance = map.current;
        const library = leaflet.current;
        if (!instance || !library) return;

        if (!value) {
            marker.current?.remove();
            marker.current = null;
            return;
        }

        const point: Coordinates = [value.latitude, value.longitude];
        if (marker.current) {
            marker.current.setLatLng(point);
        } else {
            const icon = library.icon({
                iconUrl: `${leafletAssets}/images/marker-icon.png`,
                iconRetinaUrl: `${leafletAssets}/images/marker-icon-2x.png`,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
            });
            marker.current = library
                .marker(point, { icon, interactive: false, keyboard: false })
                .addTo(instance);
        }

        if (!instance.getBounds().contains(point)) instance.panTo(point);
    }, [mapStatus, value]);

    useEffect(() => {
        const instance = map.current;
        if (!instance || !place) return;

        if (place.bounds) {
            const [south, west, north, east] = place.bounds;
            instance.fitBounds(
                [
                    [south, west],
                    [north, east],
                ],
                { maxZoom: 17, padding: [20, 20] },
            );
        } else {
            instance.setView([place.latitude, place.longitude], 14);
        }
    }, [mapStatus, place]);

    const latitudeText = draft.latitude ?? value?.latitude.toString() ?? "";
    const longitudeText = draft.longitude ?? value?.longitude.toString() ?? "";

    function applyCoordinates() {
        const latitude = Number(latitudeText);
        const longitude = Number(longitudeText);

        if (
            !latitudeText.trim() ||
            !longitudeText.trim() ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            setError(
                "Enter a latitude from -90 to 90 and a longitude from -180 to 180.",
            );
            return;
        }

        onChange({ latitude, longitude });
        setDraft({});
        setError("");
    }

    function loadMap() {
        leaflet.current = (window as Window & { L?: Leaflet }).L ?? null;
        setMapStatus(leaflet.current ? "ready" : "unavailable");
    }

    return (
        <section aria-label="Report location" className="space-y-4">
            <link
                rel="stylesheet"
                href={`${leafletAssets}/leaflet.css`}
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin="anonymous"
                precedence="leaflet"
            />
            <Script
                src={`${leafletAssets}/leaflet.js`}
                integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                crossOrigin="anonymous"
                onReady={loadMap}
                onError={() => setMapStatus("unavailable")}
            />
            <LocationSearch onSelect={(result) => setPlace({ ...result })} />
            <p id={instructionsId} className="text-sm text-slate-600">
                Click the last-seen or found location on the map, or enter its
                coordinates below. Choose a point you are comfortable sharing
                publicly.
            </p>
            <div
                ref={mapElement}
                role="region"
                aria-label="Location map"
                aria-describedby={instructionsId}
                className="h-80 w-full overflow-hidden rounded-lg border border-slate-300 bg-slate-100"
            />
            {mapStatus !== "ready" && (
                <p role="status" className="text-sm text-slate-600">
                    {mapStatus === "loading"
                        ? "Loading the map…"
                        : "The map is unavailable. You can still enter coordinates below."}
                </p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                    Latitude
                    <input
                        type="number"
                        step="any"
                        min={-90}
                        max={90}
                        value={latitudeText}
                        aria-describedby={error ? errorId : undefined}
                        onChange={(event) =>
                            setDraft((previous) => ({
                                ...previous,
                                latitude: event.target.value,
                            }))
                        }
                        className="mt-1 block w-full rounded-md border border-slate-400 px-3 py-2 focus-visible:outline-2 focus-visible:outline-teal-700"
                    />
                </label>
                <label className="block text-sm font-medium">
                    Longitude
                    <input
                        type="number"
                        step="any"
                        min={-180}
                        max={180}
                        value={longitudeText}
                        aria-describedby={error ? errorId : undefined}
                        onChange={(event) =>
                            setDraft((previous) => ({
                                ...previous,
                                longitude: event.target.value,
                            }))
                        }
                        className="mt-1 block w-full rounded-md border border-slate-400 px-3 py-2 focus-visible:outline-2 focus-visible:outline-teal-700"
                    />
                </label>
            </div>
            <button
                type="button"
                onClick={applyCoordinates}
                className="min-h-11 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
                Use these coordinates
            </button>
            <p id={errorId} aria-live="polite" className="text-sm text-red-700">
                {error}
            </p>
            <p aria-live="polite" className="text-sm text-slate-700">
                {value
                    ? `Selected point: ${value.latitude}, ${value.longitude}`
                    : "No location selected."}
            </p>
        </section>
    );
}
