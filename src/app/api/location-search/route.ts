import type { LocationSearchResult } from "@/lib/location-search";

const publicEndpoint = "https://nominatim.openstreetmap.org/search";
const cache = new Map<
    string,
    { expires: number; results: LocationSearchResult[] }
>();
let nextRequestAt = 0;

type ProviderResult = {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    boundingbox?: string[];
};

function toLocation(result: ProviderResult): LocationSearchResult | null {
    if (!result?.display_name || !Number.isFinite(result.place_id)) return null;

    const latitude = Number(result.lat);
    const longitude = Number(result.lon);
    if (!(Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180)) return null;

    const [south, north, west, east] = result.boundingbox?.map(Number) ?? [];
    const hasBounds =
        south >= -90 &&
        north <= 90 &&
        south < north &&
        west >= -180 &&
        east <= 180 &&
        west < east;

    return {
        id: result.place_id,
        label: result.display_name,
        latitude,
        longitude,
        bounds: hasBounds ? [south, west, north, east] : undefined,
    };
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const query =
        typeof body?.query === "string"
            ? body.query.trim().replace(/\s+/g, " ")
            : "";
    if (query.length < 3 || query.length > 160) {
        return Response.json(
            { error: "Enter a place or address between 3 and 160 characters." },
            { status: 400 },
        );
    }

    const configuredEndpoint = process.env.PAWFINDER_GEOCODER_URL;
    const isDevelopment = process.env.NODE_ENV === "development";
    if (!configuredEndpoint && !isDevelopment) {
        return Response.json(
            {
                error: "Address search is not configured. You can still use the map.",
            },
            { status: 503 },
        );
    }

    try {
        const url = new URL(configuredEndpoint || publicEndpoint);
        if (url.hostname === "nominatim.openstreetmap.org" && !isDevelopment) {
            return Response.json(
                {
                    error: "Address search is not configured. You can still use the map.",
                },
                { status: 503 },
            );
        }

        const now = Date.now();
        const key = `${url.href}|${query.toLowerCase()}`;
        const cached = cache.get(key);
        if (cached && cached.expires > now)
            return Response.json({ results: cached.results });

        if (now < nextRequestAt) {
            return Response.json(
                { error: "Please wait a moment before searching again." },
                { status: 429, headers: { "Retry-After": "1" } },
            );
        }
        nextRequestAt = now + 1_000;

        url.searchParams.set("q", query);
        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("limit", "5");
        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "User-Agent":
                    "PawFinder/0.1 (https://github.com/sqsaay/PawFinder)",
            },
            signal: AbortSignal.timeout(7_000),
            cache: "no-store",
        });
        if (!response.ok) throw new Error("Location provider unavailable");

        const places = (await response.json()) as ProviderResult[];
        const results = places
            .map(toLocation)
            .filter((place) => place !== null);
        if (cache.size >= 64) {
            const oldest = cache.keys().next().value;
            if (oldest !== undefined) cache.delete(oldest);
        }
        cache.set(key, { expires: Date.now() + 10 * 60_000, results });
        return Response.json({ results });
    } catch {
        return Response.json(
            {
                error: "Address search is unavailable. Try again or choose a point on the map.",
            },
            { status: 502 },
        );
    }
}
