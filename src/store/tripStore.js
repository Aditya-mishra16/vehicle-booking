// src/store/tripStore.js

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTripStore = create(
  persist(
    (set) => ({
      /* ---------------- TRIP STATE ---------------- */
      trip: null,

      setTrip: (tripData) =>
        set(() => ({
          trip: {
            ...tripData,
            updatedAt: Date.now(),
          },
        })),

      clearTrip: () =>
        set(() => ({
          trip: null,
        })),

      /* ---------------- BOOKING STATE ---------------- */
      booking: null,

      setBooking: (bookingData) =>
        set(() => ({
          booking: {
            ...bookingData,
            createdAt: Date.now(),
          },
        })),

      clearBooking: () =>
        set(() => ({
          booking: null,
        })),
    }),
    {
      name: "trip-storage",

      /* Persist only necessary data */
      partialize: (state) => ({
        trip: state.trip
          ? {
              pickup: state.trip.pickup,
              drop: state.trip.drop,
              pickupCoords: state.trip.pickupCoords,
              dropCoords: state.trip.dropCoords,
              startDate: state.trip.startDate,
              endDate: state.trip.endDate,
              tripType: state.trip.tripType,
              updatedAt: state.trip.updatedAt,
            }
          : null,

        booking: state.booking
          ? {
              name: state.booking.name,
              email: state.booking.email,
              phone: state.booking.phone,
              vehicle: state.booking.vehicle,
              price: state.booking.price,
              pickup: state.booking.pickup,
              drop: state.booking.drop,
              startDate: state.booking.startDate,
              bookingId: state.booking.bookingId,
              createdAt: state.booking.createdAt,
            }
          : null,
      }),
    },
  ),
);
