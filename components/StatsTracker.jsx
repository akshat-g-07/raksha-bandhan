"use client";

import { useEffect } from "react";

import { heartbeat, startSession } from "@/lib/stats";

const HEARTBEAT_MS = 20000;

export default function StatsTracker() {
  useEffect(() => {
    let active = true;
    let timer;

    (async () => {
      await startSession();
      if (!active) return;
      heartbeat();
      timer = setInterval(heartbeat, HEARTBEAT_MS);
    })();

    const onVisible = () => {
      if (document.visibilityState === "visible") heartbeat();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      active = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
