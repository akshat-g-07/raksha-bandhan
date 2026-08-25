"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// Scrolls its text horizontally only when it overflows the available width.
export default function MarqueeText({ children, className }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      const t = textRef.current;
      if (!c || !t) return;
      const overflow = t.scrollWidth - c.clientWidth;
      setDistance(overflow > 1 ? overflow : 0);
    };
    measure();
    // fonts can change the text width after they load
    document.fonts?.ready?.then(measure).catch(() => {});
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [children]);

  const animate = distance > 0;

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      <span
        ref={textRef}
        className={cn("inline-block whitespace-nowrap", animate && "marquee")}
        style={
          animate
            ? {
                "--marquee-distance": `-${distance}px`,
                animationDuration: `${Math.max(4, distance / 30)}s`,
              }
            : undefined
        }
      >
        {children}
      </span>
    </div>
  );
}
