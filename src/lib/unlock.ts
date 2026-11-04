"use client";

import { useSyncExternalStore } from "react";
import { LEAD_SUBMITTED_KEY } from "@/components/forms/EnquiryForm";

// Gated content (3D home tour, floor plans) unlocks once a visitor has shared
// their details on any form or tapped through to WhatsApp, and stays
// unlocked on that device.
const UNLOCK_KEY = "aspire-3d-unlocked";
const UNLOCK_EVENT = "aspire-3d-unlock";

const isUnlocked = () => {
  try {
    return localStorage.getItem(UNLOCK_KEY) === "1" || localStorage.getItem(LEAD_SUBMITTED_KEY) === "1";
  } catch {
    return false;
  }
};

const subscribe = (cb: () => void) => {
  window.addEventListener(UNLOCK_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(UNLOCK_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};

export function unlock() {
  try {
    localStorage.setItem(UNLOCK_KEY, "1");
  } catch {}
  window.dispatchEvent(new Event(UNLOCK_EVENT));
}

export function useUnlocked() {
  return useSyncExternalStore(subscribe, isUnlocked, () => false);
}
