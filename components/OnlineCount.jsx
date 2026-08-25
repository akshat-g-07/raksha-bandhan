"use client";

import { useEffect, useState } from "react";

// Raksha Bandhan window (Aug 26–29, 2026) in IST, a fixed UTC+5:30 (no DST).
function isFestival(now = new Date()) {
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000); // shift so UTC fields read IST
  const dateIST = Date.UTC(
    ist.getUTCFullYear(),
    ist.getUTCMonth(),
    ist.getUTCDate(),
  );
  return dateIST >= Date.UTC(2026, 7, 26) && dateIST <= Date.UTC(2026, 7, 29);
}

// Deterministic add-on (0..mod-1) derived from the shared count, so every
// client renders the exact same inflated number.
function jitter(raw, mod) {
  return (Math.imul(raw, 2654435761) >>> 0) % mod;
}

// Real total-since-launch visitors, a little boosted for display.
function boostReal(v) {
  const factor = isFestival() ? 1.6 : 1.25;
  return Math.max(1, Math.round(v * factor));
}

// Fallback only (no analytics token, e.g. local dev): inflate the simulated
// random walk so the badge still looks alive.
function boostSim(raw) {
  return isFestival()
    ? Math.max(513, raw * 100 + jitter(raw, 100))
    : Math.max(26, raw * 10 + jitter(raw, 10));
}

export default function OnlineCount() {
  // Starts as the simulated base (hydration-safe: deterministic on first render);
  // swaps to the real Vercel total once /api/online responds.
  const [count, setCount] = useState(38);
  const [isReal, setIsReal] = useState(false);

  // Pull the real total from our server route (which holds the secret token).
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const r = await fetch("/api/online", { cache: "no-store" });
        const j = await r.json();
        if (active && typeof j?.visitors === "number") {
          setCount(j.visitors);
          setIsReal(true);
        }
      } catch {
        /* keep the simulated fallback */
      }
    };
    load();
    const id = setInterval(load, 60000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  // Simulated random walk until/unless real data arrives (keeps dev lively).
  useEffect(() => {
    if (isReal) return;
    let timer;
    const tick = () => {
      setCount((n) => {
        const dir = Math.random() < (n < 36 ? 0.58 : 0.42) ? 1 : -1;
        return Math.max(
          14,
          Math.min(58, n + dir * (1 + Math.floor(Math.random() * 3))),
        );
      });
      timer = setTimeout(tick, 2500 + Math.random() * 3500);
    };
    timer = setTimeout(tick, 2500 + Math.random() * 3500);
    return () => clearTimeout(timer);
  }, [isReal]);

  // en-US locale forces identical grouping on server + client (no hydration drift).
  const display = (isReal ? boostReal(count) : boostSim(count)).toLocaleString(
    "en-US",
  );

  return (
    <span
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-full bg-black/40 py-1.5 px-4 text-sm font-medium 2xl:text-base text-white backdrop-blur-sm drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
      </span>
      <span className="tabular-nums">{display}</span>
      <span className="text-white/70">visitors</span>
    </span>
  );
}
