/**
 * LightThemeBG — Renders ONLY when theme === "light"
 *
 * Layers (all absolutely positioned, z-index: 0, pointer-events: none):
 *  1. Soft radial gradient aura
 *  2. Floating eco-leaf SVGs (CSS keyframe, staggered)
 *  3. Subtle hex-grid pattern (SVG <pattern>)
 *  4. Constellation dot mesh (canvas)
 *  5. Wave ribbon (SVG path animation)
 *  6. Glass orbs (blurred circles)
 *
 * All layers: opacity 10-15 % — never interfere with readability.
 * Content always sits above via parent's isolation/z-index.
 */

import { useEffect, useRef } from "react";

// ─── 1. tiny SVG leaf path ────────────────────────────────────────────────────
const LEAF_PATH =
  "M10 2C6 2 2 6 2 10c0 3 4 8 8 8s8-5 8-8c0-4-4-8-8-8zm0 14c-3 0-6-4-6-6 0-3.3 2.7-6 6-6s6 2.7 6 6c0 2-3 6-6 6z";

// leaf positions + animation timings
const LEAVES = [
  { x: "8%",  y: "12%", s: 18, dur: 12, delay: 0,   rot: 30  },
  { x: "88%", y: "8%",  s: 14, dur: 15, delay: 2.5, rot: -20 },
  { x: "75%", y: "55%", s: 22, dur: 10, delay: 1,   rot: 55  },
  { x: "5%",  y: "65%", s: 16, dur: 13, delay: 4,   rot: -10 },
  { x: "50%", y: "5%",  s: 12, dur: 18, delay: 3,   rot: 80  },
  { x: "92%", y: "38%", s: 20, dur: 11, delay: 6,   rot: -45 },
  { x: "30%", y: "80%", s: 15, dur: 14, delay: 1.5, rot: 15  },
  { x: "62%", y: "88%", s: 17, dur: 16, delay: 5,   rot: -60 },
  { x: "18%", y: "42%", s: 13, dur: 20, delay: 7,   rot: 40  },
  { x: "45%", y: "52%", s: 11, dur: 17, delay: 2,   rot: -30 },
  { x: "80%", y: "72%", s: 19, dur: 12, delay: 8,   rot: 65  },
  { x: "3%",  y: "88%", s: 16, dur: 15, delay: 0.5, rot: -15 },
];

// ─── 2. Glass orbs config ─────────────────────────────────────────────────────
const ORBS = [
  { x: "15%",  y: "20%", size: 220, color: "rgba(16,185,129,0.07)",  blur: 60, dur: 8  },
  { x: "75%",  y: "15%", size: 180, color: "rgba(52,211,153,0.06)",  blur: 50, dur: 11 },
  { x: "60%",  y: "60%", size: 260, color: "rgba(110,231,183,0.05)", blur: 70, dur: 9  },
  { x: "5%",   y: "55%", size: 150, color: "rgba(16,185,129,0.08)",  blur: 45, dur: 13 },
  { x: "88%",  y: "75%", size: 200, color: "rgba(52,211,153,0.06)",  blur: 55, dur: 10 },
];

// ─── Canvas constellation ─────────────────────────────────────────────────────
function ConstellationCanvas({ theme }) {
  const canvasRef = useRef(null);
  const frameRef  = useRef(null);

  useEffect(() => {
    if (theme !== "light") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    // create dots
    const COUNT = Math.max(28, Math.floor((W * H) / 22000));
    const dots = Array.from({ length: COUNT }, () => ({
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * 0.18,
      vy:  (Math.random() - 0.5) * 0.18,
      r:   1.2 + Math.random() * 1.4,
    }));

    const MAX_DIST = 130;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // move
      dots.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0)  d.x = W;
        if (d.x > W)  d.x = 0;
        if (d.y < 0)  d.y = H;
        if (d.y > H)  d.y = 0;
      });

      // lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx   = dots[i].x - dots[j].x;
          const dy   = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.07;
            ctx.strokeStyle = `rgba(16,185,129,${alpha})`;
            ctx.lineWidth   = 0.8;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      // dots
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(16,185,129,0.13)";
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [theme]);

  if (theme !== "light") return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        zIndex:        0,
        pointerEvents: "none",
        opacity:       0.9,        // dots already at 13% so total stays subtle
      }}
      aria-hidden="true"
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LightThemeBG({ theme }) {
  if (theme !== "light") return null;   // ← renders NOTHING in dark mode

  return (
    <>
      {/* ── Gradient aura ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:      "fixed",
          inset:         0,
          zIndex:        0,
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 55% 40% at 12% 20%, rgba(16,185,129,0.09) 0%, transparent 70%),
            radial-gradient(ellipse 45% 35% at 88% 80%, rgba(52,211,153,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 40% 30% at 55% 50%, rgba(110,231,183,0.05) 0%, transparent 60%)
          `,
        }}
      />

      {/* ── Hex grid (SVG pattern) ─────────────────────────── */}
      <svg
        aria-hidden="true"
        style={{
          position:      "fixed",
          inset:         0,
          width:         "100%",
          height:        "100%",
          zIndex:        0,
          pointerEvents: "none",
          opacity:       0.25,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="ltbg-hex"
            x="0" y="0"
            width="56" height="64"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(0)"
          >
            {/* one hexagon outline */}
            <polygon
              points="28,2 50,15 50,41 28,54 6,41 6,15"
              fill="none"
              stroke="rgba(16,185,129,0.22)"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ltbg-hex)" />
      </svg>

      {/* ── Wave ribbon (animated SVG path) ────────────────── */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        style={{
          position:      "fixed",
          bottom:        "8%",
          left:          0,
          width:         "100%",
          height:        "180px",
          zIndex:        0,
          pointerEvents: "none",
          opacity:       0.09,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="none"
          stroke="rgba(16,185,129,0.9)"
          strokeWidth="2.5"
          d="M0,100 C180,160 360,40 540,100 C720,160 900,40 1080,100 C1260,160 1380,60 1440,100"
          style={{ animation: "ltbg-wave 8s ease-in-out infinite alternate" }}
        />
        <path
          fill="none"
          stroke="rgba(52,211,153,0.7)"
          strokeWidth="1.5"
          d="M0,130 C200,80 400,180 600,130 C800,80 1000,180 1200,130 C1320,100 1400,150 1440,130"
          style={{ animation: "ltbg-wave 11s ease-in-out infinite alternate-reverse" }}
        />
      </svg>

      {/* ── Glass orbs ─────────────────────────────────────── */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position:      "fixed",
            left:          orb.x,
            top:           orb.y,
            width:         orb.size,
            height:        orb.size,
            borderRadius:  "50%",
            background:    orb.color,
            filter:        `blur(${orb.blur}px)`,
            zIndex:        0,
            pointerEvents: "none",
            transform:     "translate(-50%, -50%)",
            animation:     `ltbg-orb ${orb.dur}s ease-in-out ${i * 1.3}s infinite alternate`,
          }}
        />
      ))}

      {/* ── Floating eco leaves ─────────────────────────────── */}
      {LEAVES.map((leaf, i) => (
        <svg
          key={i}
          aria-hidden="true"
          viewBox="0 0 20 20"
          width={leaf.s}
          height={leaf.s}
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position:      "fixed",
            left:          leaf.x,
            top:           leaf.y,
            zIndex:        0,
            pointerEvents: "none",
            opacity:       0.13,
            transform:     `rotate(${leaf.rot}deg)`,
            animation:     `ltbg-float ${leaf.dur}s ease-in-out ${leaf.delay}s infinite alternate`,
            willChange:    "transform",
          }}
        >
          {/* simple leaf shape */}
          <path
            d="M10 1 C5 1, 1 5, 1 10 C1 14, 5 19, 10 19 C15 19, 19 14, 19 10 C19 5, 15 1, 10 1 Z
               M10 3 C14 3, 17 6, 17 10 C17 13, 14 17, 10 17"
            fill="rgba(16,185,129,0.85)"
            fillRule="evenodd"
          />
          <line x1="10" y1="3" x2="10" y2="17" stroke="rgba(5,150,105,0.5)" strokeWidth="0.8" />
        </svg>
      ))}

      {/* ── Floating dust particles ─────────────────────────── */}
      {Array.from({ length: 18 }, (_, i) => {
        const size  = 3 + (i % 4);
        const left  = `${5 + (i * 5.2) % 92}%`;
        const top   = `${4 + (i * 4.8) % 90}%`;
        const dur   = 6 + (i % 7);
        const delay = (i * 0.6) % 5;
        return (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position:      "fixed",
              left,
              top,
              width:         size,
              height:        size,
              borderRadius:  "50%",
              background:    i % 3 === 0
                ? "rgba(16,185,129,0.35)"
                : i % 3 === 1
                  ? "rgba(52,211,153,0.28)"
                  : "rgba(110,231,183,0.22)",
              zIndex:        0,
              pointerEvents: "none",
              animation:     `ltbg-dust ${dur}s ease-in-out ${delay}s infinite alternate`,
              willChange:    "transform",
            }}
          />
        );
      })}

      {/* ── Canvas constellation mesh ─────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:      "fixed",
          inset:         0,
          zIndex:        0,
          pointerEvents: "none",
        }}
      >
        <ConstellationCanvas theme={theme} />
      </div>

      {/* ── Keyframe styles ─────────────────────────────────── */}
      <style>{`
        @keyframes ltbg-float {
          0%   { transform: translateY(0px)   rotate(var(--r, 0deg)) scale(1);    }
          50%  { transform: translateY(-18px) rotate(var(--r, 0deg)) scale(1.06); }
          100% { transform: translateY(8px)   rotate(var(--r, 0deg)) scale(0.96); }
        }
        @keyframes ltbg-orb {
          0%   { transform: translate(-50%,-50%) scale(1);    opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(1.18); opacity: 1;   }
        }
        @keyframes ltbg-dust {
          0%   { transform: translateY(0px)   scale(1);    }
          50%  { transform: translateY(-12px) scale(1.2);  }
          100% { transform: translateY(6px)   scale(0.85); }
        }
        @keyframes ltbg-wave {
          0%   { d: path("M0,100 C180,160 360,40 540,100 C720,160 900,40 1080,100 C1260,160 1380,60 1440,100"); }
          100% { d: path("M0,80  C180,140 360,60 540,120 C720,140 900,20 1080,80  C1260,140 1380,80 1440,80");  }
        }
      `}</style>
    </>
  );
}
