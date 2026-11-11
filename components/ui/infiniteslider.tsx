"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type InfiniteSliderProps = {
  children: React.ReactNode;
  /** Space between items, in px. Default 16. */
  gap?: number;
  /** Scroll speed in px per second. Default 100. */
  speed?: number;
  /** Speed while the pointer is over the slider. Defaults to `speed`. */
  speedOnHover?: number;
  direction?: "horizontal" | "vertical";
  /** Run the opposite way (down / right instead of up / left). */
  reverse?: boolean;
  className?: string;
};

/**
 * Endless marquee. The children are rendered twice and the track is moved by
 * one copy's length, then wrapped back, so the loop has no visible seam.
 * Movement is driven by requestAnimationFrame writing straight to the DOM, so
 * it never re-renders React. Speed eases between `speed` and `speedOnHover`.
 */
export function InfiniteSlider({
  children,
  gap = 16,
  speed = 100,
  speedOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const groupRef = React.useRef<HTMLDivElement>(null);
  const hoverRef = React.useRef(false);

  // Latest props, read inside the animation loop without restarting it.
  const config = React.useRef({ speed, speedOnHover, gap, reverse });
  config.current = { speed, speedOnHover, gap, reverse };

  React.useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group) return;

    const vertical = direction === "vertical";
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let loop = 0; // length of one copy plus the gap
    const measure = () => {
      const size = vertical ? group.offsetHeight : group.offsetWidth;
      loop = size + config.current.gap;
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(group);

    let offset = 0;
    let current = reduceMotion ? 0 : config.current.speed;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const { speed, speedOnHover, reverse } = config.current;
      const target = reduceMotion
        ? 0
        : hoverRef.current && speedOnHover !== undefined
          ? speedOnHover
          : speed;

      // Ease towards the target so hovering slows down smoothly.
      current += (target - current) * (1 - Math.exp(-dt / 0.15));

      if (loop > 0) {
        offset += (reverse ? -1 : 1) * current * dt;
        offset = ((offset % loop) + loop) % loop;
        track.style.transform = vertical
          ? `translate3d(0, ${-offset}px, 0)`
          : `translate3d(${-offset}px, 0, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [direction]);

  const vertical = direction === "vertical";
  const groupClass = cn("flex shrink-0", vertical ? "flex-col" : "flex-row");

  return (
    <div
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => {
        hoverRef.current = true;
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
      }}
    >
      <div
        ref={trackRef}
        className={cn(
          "flex will-change-transform",
          vertical ? "flex-col" : "w-max flex-row",
        )}
        style={{ gap }}
      >
        <div ref={groupRef} className={groupClass} style={{ gap }}>
          {children}
        </div>
        <div className={groupClass} style={{ gap }} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

export default InfiniteSlider;
