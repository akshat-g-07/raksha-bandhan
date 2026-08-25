"use client";

import { useEffect, useState } from "react";

const IMAGES = ["rakhi", "tika", "mithai", "gift"];
const INTERVAL_MS = 15000;

export default function BackgroundSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-black">
      {IMAGES.map((name, i) => (
        <picture key={name}>
          {/* md (768px)+ = lg crop, below = sm crop (webp only) */}
          <source media="(min-width: 768px)" srcSet={`/webp/lg/${name}.webp`} />
          <img
            src={`/webp/sm/${name}.webp`}
            alt=""
            fetchPriority={"high"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-3000 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        </picture>
      ))}
    </div>
  );
}
