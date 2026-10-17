"use client";

import React, { useState } from "react";
import { Dices, History, Trophy } from "lucide-react";

type Prize = {
  id: string;
  label: string;
  kind: "balance" | "points" | "none";
  value: number;
  weight: number; // higher = more likely
};

// Placeholder prizes. Move these to Supabase later.
const prizes: Prize[] = [
  { id: "p1", label: "$0.10", kind: "balance", value: 0.1, weight: 25 },
  { id: "p2", label: "10 pts", kind: "points", value: 10, weight: 25 },
  { id: "p3", label: "Try again", kind: "none", value: 0, weight: 20 },
  { id: "p4", label: "$0.50", kind: "balance", value: 0.5, weight: 10 },
  { id: "p5", label: "25 pts", kind: "points", value: 25, weight: 10 },
  { id: "p6", label: "Try again", kind: "none", value: 0, weight: 5 },
  { id: "p7", label: "$1.00", kind: "balance", value: 1, weight: 4 },
  { id: "p8", label: "$5.00", kind: "balance", value: 5, weight: 1 },
];

const SPIN_COST = 50; // points per extra spin
const SIZE = 320;
const C = SIZE / 2;
const R = C - 6;
const SEG = 360 / prizes.length;

const polar = (angle: number, r: number) => {
  const rad = (angle * Math.PI) / 180;
  return { x: C + r * Math.sin(rad), y: C - r * Math.cos(rad) };
};

const segmentPath = (i: number) => {
  const a0 = i * SEG;
  const a1 = (i + 1) * SEG;
  const p0 = polar(a0, R);
  const p1 = polar(a1, R);
  return `M ${C} ${C} L ${p0.x} ${p0.y} A ${R} ${R} 0 0 1 ${p1.x} ${p1.y} Z`;
};

// TODO: the winning prize MUST be decided on the server (API route / Supabase
// function), never in the browser, or users can cheat. This is a placeholder.
const pickPrizeIndex = () => {
  const total = prizes.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < prizes.length; i++) {
    r -= prizes[i].weight;
    if (r <= 0) return i;
  }
  return 0;
};

const card = "rounded-2xl border border-[#7FFF00]/15 bg-[#050a02]";

type Win = { id: number; prize: Prize; at: string };

export function LuckSpin({ points = 0 }: { points?: number }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [freeAvailable, setFreeAvailable] = useState(true); // TODO: daily reset from Supabase
  const [result, setResult] = useState<Prize | null>(null);
  const [history, setHistory] = useState<Win[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canPay = freeAvailable || points >= SPIN_COST;

  const spin = () => {
    if (spinning) return;
    if (!canPay) {
      setError(`You need ${SPIN_COST} points for another spin.`);
      return;
    }
    setError(null);
    setResult(null);
    setSpinning(true);

    const index = pickPrizeIndex();
    const center = index * SEG + SEG / 2;
    const current = ((rotation % 360) + 360) % 360;
    const delta = (((360 - center - current) % 360) + 360) % 360;
    setRotation(rotation + 360 * 6 + delta);

    // matches the transition duration below
    setTimeout(() => {
      const prize = prizes[index];
      setSpinning(false);
      setResult(prize);
      if (freeAvailable) setFreeAvailable(false);
      setHistory((h) =>
        [{ id: Date.now(), prize, at: new Date().toLocaleTimeString() }, ...h].slice(0, 8),
      );
      // TODO: credit balance/points in Supabase
    }, 5200);
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
      {/* Wheel card */}
      <div className={`${card} flex flex-col items-center p-5 md:p-8`}>
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          {/* Pointer */}
          <div
            className="absolute left-1/2 top-[-6px] z-20 h-0 w-0 -translate-x-1/2"
            style={{
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "22px solid #7FFF00",
              filter: "drop-shadow(0 2px 6px rgba(127,255,0,0.5))",
            }}
          />

          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 5s cubic-bezier(0.12, 0.7, 0.1, 1)"
                : "none",
            }}
          >
            <circle cx={C} cy={C} r={R + 4} fill="#000" stroke="#7FFF00" strokeOpacity="0.5" strokeWidth="2" />
            {prizes.map((p, i) => (
              <g key={p.id}>
                <path
                  d={segmentPath(i)}
                  fill={i % 2 === 0 ? "#0a1a02" : "#050a02"}
                  stroke="#7FFF00"
                  strokeOpacity="0.25"
                  strokeWidth="1"
                />
                <text
                  x={C}
                  y={C - R * 0.68}
                  transform={`rotate(${i * SEG + SEG / 2} ${C} ${C})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill={p.kind === "none" ? "#ffffff99" : "#7FFF00"}
                >
                  {p.label}
                </text>
              </g>
            ))}
            <circle cx={C} cy={C} r="26" fill="#000" stroke="#7FFF00" strokeOpacity="0.6" strokeWidth="2" />
            <circle cx={C} cy={C} r="6" fill="#7FFF00" />
          </svg>
        </div>

        <div className="mt-6 min-h-[52px] text-center">
          {result ? (
