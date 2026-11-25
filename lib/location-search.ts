export type LocationSearchResult = {
    id: number;
    label: string;
    latitude: number;
    longitude: number;
    bounds?: [south: number, west: number, north: number, east: number];
};
