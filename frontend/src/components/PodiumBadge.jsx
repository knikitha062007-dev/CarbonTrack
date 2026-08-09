/**
 * PodiumBadge — Inline SVG badge component
 * Renders a crown + medal + ribbon in gold / silver / bronze
 * based on the "rank" prop (1 | 2 | 3).
 *
 * No image files required — fully self-contained SVG.
 * Crown floats continuously via CSS animation.
 */

import { useEffect, useRef } from "react";

const THEMES = {
  1: {
    // Gold — Crown Winner
    crownFill:     "#FFD700",
    crownHighlight:"#FFF176",
    crownShadow:   "#B8860B",
    medalRim:      "#FFD700",
    medalDark:     "#B8860B",
    medalFace:     "#FFF8DC",
    ribbonA:       "#1a237e",
    ribbonB:       "#283593",
    ribbonAccent:  "#FFD700",
    label:         "CROWN WINNER",
    gem1: "#e53935", gem2: "#1565c0", gem3: "#2e7d32", gem4: "#6a1fa8",
    leafStroke:    "#FFD700",
    glow:          "rgba(255,215,0,0.45)",
    size:          165,
  },
  2: {
    // Silver — Royal Achiever
    crownFill:     "#E8E8E8",
    crownHighlight:"#FFFFFF",
    crownShadow:   "#9E9E9E",
    medalRim:      "#C0C0C0",
    medalDark:     "#9E9E9E",
    medalFace:     "#F5F5F5",
    ribbonA:       "#1a237e",
    ribbonB:       "#283593",
    ribbonAccent:  "#C0C0C0",
    label:         "ROYAL ACHIEVER",
    gem1: "#7986CB", gem2: "#FFFFFF", gem3: "#9C27B0", gem4: "#BDBDBD",
    leafStroke:    "#C0C0C0",
    glow:          "rgba(192,192,192,0.40)",
    size:          140,
  },
  3: {
    // Bronze — Elite Performer
    crownFill:     "#CD7F32",
    crownHighlight:"#FFAB40",
    crownShadow:   "#6D4C41",
    medalRim:      "#CD7F32",
    medalDark:     "#795548",
    medalFace:     "#EFEBE9",
    ribbonA:       "#1a237e",
    ribbonB:       "#283593",
    ribbonAccent:  "#CD7F32",
    label:         "ELITE PERFORMER",
    gem1: "#e53935", gem2: "#2e7d32", gem3: "#1565c0", gem4: "#6a1fa8",
    leafStroke:    "#CD7F32",
    glow:          "rgba(205,127,50,0.40)",
    size:          140,
  },
};

export default function PodiumBadge({ rank }) {
  const t = THEMES[rank] || THEMES[1];
  const S = t.size;          // viewBox size
  const cx = S / 2;          // centre x

  // unique IDs so multiple badges on the same page don't clash
  const uid = `pb${rank}`;

  const animClass = rank === 1
    ? "pb-float-1"
    : rank === 2
      ? "pb-float-2"
      : "pb-float-3";

  return (
    <div
      className={`podium-badge-svg-wrap ${animClass}`}
      style={{
        width:  t.size,
        height: t.size,
        filter: `drop-shadow(0 6px 18px ${t.glow})`,
        willChange: "transform",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label={`Rank ${rank} — ${t.label}`}
    >
      <svg
        viewBox={`0 0 ${S} ${S}`}
        width={t.size}
        height={t.size}
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <defs>
          {/* Medal face gradient */}
          <radialGradient id={`mf${uid}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor={t.medalFace} />
            <stop offset="100%" stopColor="#BCAAA4" />
          </radialGradient>
          {/* Medal rim gradient */}
          <radialGradient id={`mr${uid}`} cx="40%" cy="30%" r="70%">
            <stop offset="0%"   stopColor={t.crownHighlight} />
            <stop offset="50%"  stopColor={t.medalRim} />
            <stop offset="100%" stopColor={t.medalDark} />
          </radialGradient>
          {/* Crown gradient */}
          <linearGradient id={`cg${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={t.crownHighlight} />
            <stop offset="40%"  stopColor={t.crownFill} />
            <stop offset="100%" stopColor={t.crownShadow} />
          </linearGradient>
          {/* Glow filter */}
          <filter id={`glow${uid}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Ribbon tails ────────────────────────────────── */}
        {/* Left ribbon */}
        <polygon
          points={`${cx-18},${S*0.62} ${cx-6},${S*0.62} ${cx-6},${S*0.93} ${cx-18},${S*0.85}`}
          fill={t.ribbonA}
        />
        {/* Left ribbon accent */}
        <rect x={cx-11} y={S*0.62} width="4" height={S*0.31} fill={t.ribbonAccent} opacity="0.7" />
        {/* Left ribbon notch */}
        <polygon
          points={`${cx-18},${S*0.85} ${cx-6},${S*0.93} ${cx-12},${S*0.97}`}
          fill={t.ribbonB}
        />

        {/* Centre ribbon */}
        <polygon
          points={`${cx-7},${S*0.62} ${cx+7},${S*0.62} ${cx+7},${S*0.92} ${cx},${S*0.97} ${cx-7},${S*0.92}`}
          fill={t.ribbonAccent}
          opacity="0.85"
        />

        {/* Right ribbon */}
        <polygon
          points={`${cx+6},${S*0.62} ${cx+18},${S*0.62} ${cx+18},${S*0.85} ${cx+6},${S*0.93}`}
          fill={t.ribbonA}
        />
        <rect x={cx+7} y={S*0.62} width="4" height={S*0.31} fill={t.ribbonAccent} opacity="0.7" />
        <polygon
          points={`${cx+6},${S*0.93} ${cx+18},${S*0.85} ${cx+12},${S*0.97}`}
          fill={t.ribbonB}
        />

        {/* ── Outer medal ring ─────────────────────────────── */}
        <circle
          cx={cx} cy={S * 0.47} r={S * 0.31}
          fill={`url(#mr${uid})`}
          filter={`url(#glow${uid})`}
        />

        {/* ── Inner dark ring ──────────────────────────────── */}
        <circle cx={cx} cy={S * 0.47} r={S * 0.265} fill={t.ribbonA} />

        {/* ── Laurel wreath (simplified arc leaves) ─────────── */}
        {Array.from({ length: 10 }, (_, i) => {
          const angle = -160 + i * 32;          // degrees, bottom arc
          const rad   = (angle * Math.PI) / 180;
          const lx = cx + (S * 0.245) * Math.cos(rad);
          const ly = (S * 0.47) + (S * 0.245) * Math.sin(rad);
          return (
            <ellipse
              key={i}
              cx={lx} cy={ly}
              rx={S * 0.032} ry={S * 0.016}
              fill={t.leafStroke}
              opacity="0.72"
              transform={`rotate(${angle + 90} ${lx} ${ly})`}
            />
          );
        })}

        {/* ── Medal face ───────────────────────────────────── */}
        <circle cx={cx} cy={S * 0.47} r={S * 0.20} fill={`url(#mf${uid})`} />

        {/* ── Mini crown on medal face ─────────────────────── */}
        <text
          x={cx} y={S * 0.425}
          textAnchor="middle"
          fontSize={S * 0.085}
          fill={t.medalRim}
          fontFamily="serif"
        >
          ♛
        </text>

        {/* ── Stars on medal face ──────────────────────────── */}
        <text x={cx}      y={S * 0.395} textAnchor="middle" fontSize={S*0.045} fill={t.medalRim} opacity="0.7">★</text>
        <text x={cx-S*0.07} y={S*0.4}  textAnchor="middle" fontSize={S*0.03}  fill={t.medalRim} opacity="0.55">★</text>
        <text x={cx+S*0.07} y={S*0.4}  textAnchor="middle" fontSize={S*0.03}  fill={t.medalRim} opacity="0.55">★</text>

        {/* ── Badge label text ─────────────────────────────── */}
        {t.label.split(" ").map((word, wi) => (
          <text
            key={wi}
            x={cx}
            y={S * 0.474 + wi * (S * 0.055)}
            textAnchor="middle"
            fontSize={S * 0.065}
            fontWeight="900"
            fontFamily="'Inter', 'Arial Narrow', sans-serif"
            letterSpacing="0.5"
            fill={t.ribbonA}
          >
            {word}
          </text>
        ))}

        {/* ── Decorative line below text ───────────────────── */}
        <line
          x1={cx - S * 0.09} y1={S * 0.555}
          x2={cx + S * 0.09} y2={S * 0.555}
          stroke={t.medalRim} strokeWidth="0.8" opacity="0.55"
        />

        {/* ── Top diamond gem on outer ring ────────────────── */}
        <polygon
          points={`${cx},${S*0.163} ${cx+4},${S*0.175} ${cx},${S*0.187} ${cx-4},${S*0.175}`}
          fill={t.crownHighlight}
          stroke={t.medalRim} strokeWidth="0.5"
        />

        {/* ── CROWN (drawn last, sits above medal) ─────────── */}
        {/* Crown base band */}
        <rect
          x={cx - S * 0.145} y={S * 0.08}
          width={S * 0.29} height={S * 0.065}
          rx="3"
          fill={`url(#cg${uid})`}
        />

        {/* Crown prongs — 5 prongs (left, mid-left, centre, mid-right, right) */}
        {/* Left outer prong */}
        <polygon
          points={`
            ${cx - S*0.145},${S*0.085}
            ${cx - S*0.145},${S*0.030}
            ${cx - S*0.105},${S*0.062}
            ${cx - S*0.105},${S*0.085}
          `}
          fill={`url(#cg${uid})`}
        />
        {/* Left inner prong */}
        <polygon
          points={`
            ${cx - S*0.075},${S*0.085}
            ${cx - S*0.08}, ${S*0.038}
            ${cx - S*0.04}, ${S*0.058}
            ${cx - S*0.04}, ${S*0.085}
          `}
          fill={`url(#cg${uid})`}
        />
        {/* Centre prong (tallest — fleur-de-lis tip) */}
        <polygon
          points={`
            ${cx - S*0.025},${S*0.085}
            ${cx},           ${S*0.000}
            ${cx + S*0.025},${S*0.085}
          `}
          fill={`url(#cg${uid})`}
        />
        {/* Centre tip diamond */}
        <polygon
          points={`
            ${cx},            ${S*0.000}
            ${cx + S*0.008},${S*0.016}
            ${cx},            ${S*0.032}
            ${cx - S*0.008},${S*0.016}
          `}
          fill={t.crownHighlight}
        />
        {/* Right inner prong */}
        <polygon
          points={`
            ${cx + S*0.04}, ${S*0.085}
            ${cx + S*0.04}, ${S*0.058}
            ${cx + S*0.08}, ${S*0.038}
            ${cx + S*0.075},${S*0.085}
          `}
          fill={`url(#cg${uid})`}
        />
        {/* Right outer prong */}
        <polygon
          points={`
            ${cx + S*0.105},${S*0.085}
            ${cx + S*0.105},${S*0.062}
            ${cx + S*0.145},${S*0.030}
            ${cx + S*0.145},${S*0.085}
          `}
          fill={`url(#cg${uid})`}
        />

        {/* Crown outline stroke for 3D depth */}
        <rect
          x={cx - S * 0.145} y={S * 0.08}
          width={S * 0.29} height={S * 0.065}
          rx="3"
          fill="none"
          stroke={t.medalDark} strokeWidth="0.8" opacity="0.5"
        />

        {/* ── Gems on crown ────────────────────────────────── */}
        {/* Centre gem */}
        <circle cx={cx}         cy={S*0.098} r={S*0.020} fill={t.gem1} stroke={t.crownHighlight} strokeWidth="0.7" />
        {/* Left gem */}
        <circle cx={cx-S*0.07} cy={S*0.103} r={S*0.015} fill={t.gem2} stroke={t.crownHighlight} strokeWidth="0.6" />
        {/* Right gem */}
        <circle cx={cx+S*0.07} cy={S*0.103} r={S*0.015} fill={t.gem3} stroke={t.crownHighlight} strokeWidth="0.6" />
        {/* Far-left gem */}
        <circle cx={cx-S*0.115} cy={S*0.107} r={S*0.012} fill={t.gem4} stroke={t.crownHighlight} strokeWidth="0.5" />
        {/* Far-right gem */}
        <circle cx={cx+S*0.115} cy={S*0.107} r={S*0.012} fill={t.gem4} stroke={t.crownHighlight} strokeWidth="0.5" />

        {/* ── Glow halo under crown ────────────────────────── */}
        <ellipse
          cx={cx} cy={S * 0.148}
          rx={S * 0.13} ry={S * 0.022}
          fill={t.crownFill}
          opacity="0.28"
          filter={`url(#glow${uid})`}
        />
      </svg>

      {/* Scoped float keyframe */}
      <style>{`
        .pb-float-1 {
          animation: pbFloat1 3.8s ease-in-out infinite;
        }
        .pb-float-2 {
          animation: pbFloat2 4.2s ease-in-out 0.4s infinite;
        }
        .pb-float-3 {
          animation: pbFloat3 4.5s ease-in-out 0.9s infinite;
        }
        @keyframes pbFloat1 {
          0%   { transform: translateY(0px)   rotate(0deg); }
          30%  { transform: translateY(-8px)  rotate(0.4deg); }
          65%  { transform: translateY(-5px)  rotate(-0.3deg); }
          100% { transform: translateY(0px)   rotate(0deg); }
        }
        @keyframes pbFloat2 {
          0%   { transform: translateY(0px)  rotate(0deg); }
          35%  { transform: translateY(-7px) rotate(-0.5deg); }
          70%  { transform: translateY(-4px) rotate(0.3deg); }
          100% { transform: translateY(0px)  rotate(0deg); }
        }
        @keyframes pbFloat3 {
          0%   { transform: translateY(0px)  rotate(0deg); }
          40%  { transform: translateY(-6px) rotate(0.4deg); }
          75%  { transform: translateY(-4px) rotate(-0.2deg); }
          100% { transform: translateY(0px)  rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
