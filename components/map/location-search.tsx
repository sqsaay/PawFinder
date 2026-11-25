"use client";

import { useId, useState } from "react";
import type { LocationSearchResult } from "@/lib/location-search";

export default function LocationSearch({
    onSelect,
}: {
    onSelect: (place: LocationSearchResult) => void;
}) {
    const inputId = useId();
    const hintId = useId();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<LocationSearchResult[]>([]);
    const [status, setStatus] = useState("");
    const [pending, setPending] = useState(false);

    async function search() {
        const cleaned = query.trim();
        if (pending || cleaned.length < 3) return;

        setPending(true);
        setResults([]);
        setStatus("Searching for places...");
        try {
            const response = await fetch("/api/location-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: cleaned }),
            });
            const data = await response.json();
            if (!response.ok) {
                setStatus(data.error ?? "Address search is unavailable.");
                return;
            }

            const places: LocationSearchResult[] = data.results;
            setResults(places);
            setStatus(
                places.length
                    ? "Choose a match to zoom in."
                    : "No places found. Try including a city or country.",
            );
        } catch {
            setStatus(
                "Could not search right now. You can still choose a point on the map.",
            );
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="space-y-2">
            <label htmlFor={inputId} className="block text-sm font-medium">
                Search for a place or address
            </label>
            <p id={hintId} className="text-sm text-slate-600">
                Search for a public location. Leave out private pickup or care
                addresses.
            </p>
            <div className="flex flex-wrap gap-2">
                <input
                    id={inputId}
                    type="search"
                    aria-describedby={hintId}
                    placeholder="e.g. Rosario, Santa Fe, Argentina"
                    maxLength={160}
                    value={query}
                    disabled={pending}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setResults([]);
                        setStatus("");
                    }}
                    onKeyDown={(event) => {
                        if (
                            event.key === "Enter" &&
                            !event.nativeEvent.isComposing
                        ) {
                            event.preventDefault();
                            void search();
                        }
                    }}
                    className="min-h-11 min-w-44 flex-1 rounded-md border border-slate-400 px-3 py-2 focus-visible:outline-2 focus-visible:outline-teal-700"
                />
                <button
                    type="button"
                    disabled={pending || query.trim().length < 3}
                    onClick={search}
                    className="min-h-11 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-60"
                >
                    Search
                </button>
            </div>
            <p role="status" className="text-sm text-slate-700">
                {status}
            </p>
            {results.length > 0 && (
                <ul
                    aria-label="Search results"
                    className="divide-y divide-slate-200 rounded-md border border-slate-300 bg-white"
                >
                    {results.map((place) => (
                        <li key={place.id}>
                            <button
                                type="button"
                                onClick={() => {
                                    onSelect(place);
                                    setResults([]);
                                    setQuery(place.label.slice(0, 160));
                                    setStatus(
                                        "Place selected. Click the map to place your pin.",
                                    );
                                }}
                                className="min-h-11 w-full px-3 py-2 text-left text-sm hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-teal-700"
                            >
                                {place.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <p className="text-xs text-slate-600">
                Search data &copy;{" "}
                <a
                    href="https://www.openstreetmap.org/copyright"
                    className="underline"
                >
                    OpenStreetMap contributors
                </a>
            </p>
        </div>
    );
}
