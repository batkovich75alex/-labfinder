"use client";
import { useSyncExternalStore } from "react";
import { cities } from "@/data/mock";
let memoryCity = "Москва";
function snapshot() {
  try {
    const saved = localStorage.getItem("labfinder_city");
    return cities.some((c) => c.name === saved) ? saved! : memoryCity;
  } catch { return memoryCity; }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("labfinder-city", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("labfinder-city", callback);
  };
}
export function useCity() {
  const city = useSyncExternalStore(subscribe, snapshot, () => "Москва");
  function setCity(name: string) {
    if (!cities.some((c) => c.name === name)) return;
    memoryCity = name;
    try { localStorage.setItem("labfinder_city", name); } catch { /* Keep session choice when storage is unavailable. */ }
    window.dispatchEvent(new Event("labfinder-city"));
  }
  return [city, setCity] as const;
}
