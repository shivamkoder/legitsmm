"use client";
import React from "react";
import { motion } from "framer-motion";

// Gradient Blinds Background Component
export const GradientBlinds = ({ blindCount = 12 }) => {
  const blinds = Array.from({ length: blindCount });

  return (
    <div
      className="absolute inset-0 grid h-full w-full overflow-hidden pointer-events-none z-0"
      style={{
        gridTemplateColumns: `repeat(${blindCount}, minmax(0, 1fr))`,
      }}
    >
      {blinds.map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0 }} // Opacity set to 0
          transition={{
            duration: 1,
            delay: i * 0.08,
            ease: [0.25, 1, 0.5, 1],
          }}
          className="h-full w-full origin-top border-r border-transparent"
        />
      ))}
    </div>
  );
};

// Main Hero Section Export
export const DrawCircleText = () => {
  return (
    <section className="relative min-h-[80vh] w-full grid place-content-center bg-transparent px-4 py-24 text-yellow-50 overflow-hidden">
      {/* 1. Background Blinds */}
      <GradientBlinds blindCount={16} />

      {/* 2. Foreground Heading & Subtext */}
      <div className="relative z-10 max-w-3xl text-center mx-auto">
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight">
          Create Viral{" "}
          <span className="relative inline-block">
            Content
            <svg
              viewBox="0 0 286 73"
              fill="none"
              className="absolute -left-2 -right-2 -top-2 bottom-0 translate-y-1 w-[112%] h-full pointer-events-none"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.25,
                  delay: 0.4,
                  ease: "easeInOut",
                }}
                d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
                stroke="#FACC15"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          with Us
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-yellow-100/80 max-w-xl mx-auto">
          Let us clip your content For you
        </p>
      </div>
    </section>
  );
};
