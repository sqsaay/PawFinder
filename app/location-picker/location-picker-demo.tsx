"use client";

import { useState } from "react";
import LocationPicker, {
    type MapPoint,
} from "@/components/map/location-picker";

export default function LocationPickerDemo() {
    const [point, setPoint] = useState<MapPoint | null>(null);

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
            <div className="mx-auto max-w-3xl space-y-5">
                <h1 className="text-3xl font-semibold">
                    Choose a report location
                </h1>
                <LocationPicker value={point} onChange={setPoint} />
            </div>
        </main>
    );
}
