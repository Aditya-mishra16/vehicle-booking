import axios from "axios";

const ORS_BASE = "https://api.openrouteservice.org";

export const orsProvider = {
  async search(query) {
    const res = await axios.get(`${ORS_BASE}/geocode/autocomplete`, {
      params: {
        api_key: process.env.ORS_API_KEY,
        text: query,
        "boundary.country": "IN",
        size: 5,
      },
    });

    return res.data;
  },

  async reverse(lat, lon) {
    const res = await axios.get(`${ORS_BASE}/geocode/reverse`, {
      params: {
        api_key: process.env.ORS_API_KEY,
        "point.lat": lat,
        "point.lon": lon,
      },
    });

    return res.data;
  },

  async route(pickupCoords, dropCoords) {
    const res = await axios.post(
      `${ORS_BASE}/v2/directions/driving-car/geojson`,
      {
        coordinates: [pickupCoords, dropCoords],
      },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    return res.data;
  },
};
