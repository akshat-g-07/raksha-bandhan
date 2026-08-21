"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

const CHANNEL = "online";

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

// Inflate the real presence count for display only (identical on every client).
function boostCount(raw) {
  return isFestival()
    ? Math.max(513, raw * 100 + jitter(raw, 100))
    : Math.max(26, raw * 10 + jitter(raw, 10));
}

export default function OnlineCount() {
  const [count, setCount] = useState(1);
  // Pure function of the shared count -> same number for everyone, hydration-safe.
  const display = boostCount(count);

  useEffect(() => {
    // No Supabase env configured -> simulated count so dev/preview still works.
    if (!supabase) {
      setCount(38);
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
    }

    const key =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Math.random());

    const channel = supabase.channel(CHANNEL, {
      config: { presence: { key } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        setCount(Math.max(1, Object.keys(channel.presenceState()).length));
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") channel.track({ online_at: Date.now() });
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      <span className="text-white/70">online</span>
    </span>
  );
}
