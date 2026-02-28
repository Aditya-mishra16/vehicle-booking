"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useDebounce from "@/hooks/useDebounce";

export default function useLocationField(initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const [coords, setCoords] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);

  const selectingRef = useRef(false);
  const containerRef = useRef(null);

  const debouncedValue = useDebounce(value, 300);

  /* ---------------- Sync external prefill ---------------- */
  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue]);

  /* ---------------- Search ---------------- */
  useEffect(() => {
    // If selecting from dropdown, skip search
    if (selectingRef.current) {
      selectingRef.current = false;
      return;
    }

    // If empty, clear suggestions
    if (!debouncedValue) {
      setSuggestions([]);
      return;
    }

    // 🔥 PRODUCTION OPTIMIZATION (Minimum 3 chars)
    if (debouncedValue.length < 1) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    axios
      .get(`/api/geo?type=search&q=${debouncedValue}`, {
        signal: controller.signal,
      })
      .then((res) => {
        setSuggestions(res.data?.features || []);
      })
      .catch((err) => {
        if (err.name !== "CanceledError") {
          setSuggestions([]);
        }
      });

    return () => controller.abort();
  }, [debouncedValue]);

  /* ---------------- Outside click ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!focused && value && !coords) {
      setValue("");
    }
  }, [focused]);

  /* ---------------- Select location ---------------- */
  const selectLocation = (item) => {
    if (!item?.properties || !item?.geometry) return;

    selectingRef.current = true;

    setValue(item.properties.label || "");
    setCoords(item.geometry.coordinates || null);
    setSuggestions([]);
    setFocused(false);
  };

  return {
    value,
    setValue,
    coords,
    setCoords,
    suggestions,
    focused,
    setFocused,
    containerRef,
    selectLocation,
  };
}
