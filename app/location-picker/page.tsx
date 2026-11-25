import type { Metadata } from "next";
import LocationPickerDemo from "./location-picker-demo";

export const metadata: Metadata = {
    title: "Location picker | PawFinder",
};

export default function LocationPickerPage() {
    return <LocationPickerDemo />;
}
