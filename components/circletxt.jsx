"use client";
import React from "react";
import { motion } from "motion/react";

export const DrawCircleText = () => {
  return (
    <div className="grid place-content-center px-4 py-10 text-yellow-50">
      <h1 className="max-w-2xl text-center text-5xl leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        Buy Your{" "}
        <span className="relative inline-block px-1">
          Real
          {/* Explicit width/height so the circle is sized to the word.
              preserveAspectRatio="none" stretches the scribble to fit it. */}
          <svg
            viewBox="0 0 286 73"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="pointer-events-none absolute left-[-0.9rem] top-[-0.6rem] h-[calc(100%+1.2rem)] w-[calc(100%+1.8rem)] overflow-visible"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.25,
                ease: "easeInOut",
              }}
              d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
              stroke="#7FFF00"
              strokeWidth="4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </span>{" "}
        Engagement now
      </h1>
    </div>
  );
};
