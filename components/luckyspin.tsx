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
            result.kind === "none" ? (
              <p className="text-sm text-white/70">No luck this time. Try again!</p>
            ) : (
              <p className="text-lg font-semibold text-[#7FFF00]">
                You won {result.label}!
              </p>
            )
          ) : (
            <p className="text-sm text-white/50">
              {freeAvailable
                ? "Your free daily spin is ready."
                : `Extra spins cost ${SPIN_COST} points.`}
            </p>
          )}
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>

        <button
          type="button"
          onClick={spin}
          disabled={spinning || !canPay}
          className="mt-2 flex items-center gap-2 rounded-xl bg-[#7FFF00] px-8 py-3 text-[13px] font-semibold text-black transition-colors hover:bg-[#7FFF00]/85 disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[#7FFF00]/60"
        >
          <Dices className="h-4 w-4" strokeWidth={2} />
          {spinning ? "Spinning..." : freeAvailable ? "Free spin" : `Spin (${SPIN_COST} pts)`}
        </button>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-6">
        <div className={`${card} overflow-hidden`}>
          <div className="flex items-center gap-3 border-b border-[#7FFF00]/15 px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7FFF00]/15">
              <Trophy className="h-4 w-4 text-[#7FFF00]" strokeWidth={1.5} />
            </span>
            <h2 className="text-base font-semibold text-white">Prizes</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
            {prizes
              .filter((p) => p.kind !== "none")
              .map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-[#7FFF00]/15 bg-black/40 py-3 text-center text-[13px] font-semibold text-[#7FFF00]"
                >
                  {p.label}
                </div>
              ))}
          </div>
        </div>

        <div className={`${card} overflow-hidden`}>
          <div className="flex items-center gap-3 border-b border-[#7FFF00]/15 px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7FFF00]/15">
              <History className="h-4 w-4 text-[#7FFF00]" strokeWidth={1.5} />
            </span>
            <h2 className="text-base font-semibold text-white">Recent spins</h2>
          </div>
          {history.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-[13px] text-white/60">
              No spins yet.
            </div>
          ) : (
            <ul>
              {history.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between border-t border-[#7FFF00]/10 px-5 py-3 text-[13px] first:border-t-0"
                >
                  <span className={h.prize.kind === "none" ? "text-white/50" : "text-[#7FFF00]"}>
                    {h.prize.label}
                  </span>
                  <span className="text-white/40">{h.at}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
