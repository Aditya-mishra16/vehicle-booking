// src/store/tripStore.js

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTripStore = create(
  persist(
    (set, get) => ({
      trip: null,

      setTrip: (tripData) =>
        set(() => ({
          trip: {
            ...tripData,
            updatedAt: Date.now(), // track freshness
          },
        })),

      clearTrip: () =>
        set(() => ({
          trip: null,
        })),
    }),
    {
      name: "trip-storage",

      // Persist only necessary data
      partialize: (state) => ({
        trip: state.trip
          ? {
              pickup: state.trip.pickup,
              drop: state.trip.drop,
              date: state.trip.date,
              time: state.trip.time,
              pickupCoords: state.trip.pickupCoords,
              dropCoords: state.trip.dropCoords,
              updatedAt: state.trip.updatedAt,
            }
          : null,
      }),
    },
  ),
);
