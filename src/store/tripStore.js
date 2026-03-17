// src/store/tripStore.js

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTripStore = create(
  persist(
    (set, get) => ({
      /* ---------------- TRIP STATE ---------------- */
      trip: null,

      setTrip: (tripData) =>
        set(() => ({
          trip: {
            ...tripData,
            updatedAt: Date.now(),
          },
        })),

      clearTrip: () => set({ trip: null }),

      /* ---------------- BOOKING STATE ---------------- */
      booking: null,

      setBooking: (bookingData) => {
        const currentTrip = get().trip;

        set(() => ({
          booking: {
            // User details
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,

            // Vehicle details
            vehicle: bookingData.vehicle,
            price: bookingData.price,
            bookingId: bookingData.bookingId,

            // Trip details (fallback from trip state if not passed)
            pickup: bookingData.pickup || currentTrip?.pickup || null,
            drop: bookingData.drop || currentTrip?.drop || null,

            startDate: bookingData.startDate || currentTrip?.startDate || null,
            startTime: bookingData.startTime || currentTrip?.startTime || null,

            endDate: bookingData.endDate || currentTrip?.endDate || null,
            endTime: bookingData.endTime || currentTrip?.endTime || null,

            tripType: bookingData.tripType || currentTrip?.tripType || null,

            createdAt: Date.now(),
          },
        }));
      },

      clearBooking: () => set({ booking: null }),
    }),
    {
      name: "trip-storage",

      /* Persist only required fields */
      partialize: (state) => ({
        trip: state.trip
          ? {
              pickup: state.trip.pickup,
              drop: state.trip.drop,
              pickupCoords: state.trip.pickupCoords,
              dropCoords: state.trip.dropCoords,

              startDate: state.trip.startDate,
              startTime: state.trip.startTime,

              endDate: state.trip.endDate,
              endTime: state.trip.endTime,

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
              startTime: state.booking.startTime,

              endDate: state.booking.endDate,
              endTime: state.booking.endTime,

              tripType: state.booking.tripType,

              bookingId: state.booking.bookingId,
              createdAt: state.booking.createdAt,
            }
          : null,
      }),
    },
  ),
);
