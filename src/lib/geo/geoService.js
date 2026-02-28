import { orsProvider } from "./providers/orsProvider";

export const geoService = {
  async search(query) {
    if (!query) return { features: [] };
    return orsProvider.search(query);
  },

  async reverse(lat, lon) {
    if (lat == null || lon == null) {
      throw new Error("Missing coordinates");
    }

    return orsProvider.reverse(lat, lon);
  },

  async route(pickupCoords, dropCoords) {
    if (!pickupCoords || !dropCoords) {
      throw new Error("Missing locations");
    }

    const data = await orsProvider.route(pickupCoords, dropCoords);

    const feature = data?.features?.[0];
    const summary = feature?.properties?.summary;

    return {
      route: data,
      distanceKm: summary ? summary.distance / 1000 : 0,
      durationMin: summary ? Math.round(summary.duration / 60) : 0,
    };
  },
};
