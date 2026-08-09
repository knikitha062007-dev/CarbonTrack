/**
 * DarkThemeBG
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders ONLY when theme === "dark".
 * All layers are fixed, z-index:0, pointer-events:none — always behind content.
 *
 * Layers:
 *  1. Radial dark-green gradient aura (CSS)
 *  2. Floating 3D eco-leaves (SVG, many sizes, slow CSS keyframe drift)
 *  3. Soft glowing dust particles (tiny divs, CSS animation)
 *  4. Subtle constellation/mesh (canvas RAF)
 *
 * Leaf opacity: 0.09 – 0.15  |  particle opacity: 0.12 – 0.22
 * Everything moves very slowly (8 s – 22 s cycles).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";

// ─── Leaf definitions ─────────────────────────────────────────────────────────
// Each leaf: position (%), size (px), animation duration (s), delay (s),
//            initial rotation (deg), drift direction, opacity level
const LEAVES = [
  // large background leaves – very slow, low opacity
  { x: "3%",   y: "5%",   s: 52, dur: 20, delay: 0,    rot: 25,  op: 0.09, variant: "a" },
  { x: "91%",  y: "3%",   s: 48, dur: 22, delay: 3,    rot: -35, op: 0.09, variant: "b" },
  { x: "78%",  y: "68%",  s: 56, dur: 18, delay: 6,    rot: 50,  op: 0.10, variant: "a" },
  { x: "8%",   y: "72%",  s: 44, dur: 21, delay: 9,    rot: -15, op: 0.09, variant: "c" },
  { x: "50%",  y: "88%",  s: 60, dur: 19, delay: 4,    rot: 70,  op: 0.08, variant: "b" },

  // medium leaves
  { x: "20%",  y: "18%",  s: 34, dur: 14, delay: 1,    rot: -55, op: 0.12, variant: "c" },
  { x: "65%",  y: "12%",  s: 30, dur: 16, delay: 5,    rot: 40,  op: 0.13, variant: "a" },
  { x: "38%",  y: "55%",  s: 36, dur: 13, delay: 7.5,  rot: -80, op: 0.11, variant: "b" },
  { x: "84%",  y: "42%",  s: 32, dur: 17, delay: 2,    rot: 20,  op: 0.12, variant: "c" },
  { x: "12%",  y: "48%",  s: 38, dur: 15, delay: 8,    rot: 65,  op: 0.11, variant: "a" },
  { x: "55%",  y: "33%",  s: 28, dur: 18, delay: 3.5,  rot: -30, op: 0.13, variant: "b" },
  { x: "70%",  y: "78%",  s: 32, dur: 14, delay: 10,   rot: 45,  op: 0.12, variant: "c" },

  // small accent leaves
  { x: "28%",  y: "82%",  s: 20, dur: 11, delay: 0.5,  rot: -60, op: 0.14, variant: "a" },
  { x: "42%",  y: "6%",   s: 18, dur: 12, delay: 4,    rot: 30,  op: 0.15, variant: "b" },
  { x: "95%",  y: "55%",  s: 22, dur: 10, delay: 6.5,  rot: -25, op: 0.14, variant: "c" },
  { x: "60%",  y: "92%",  s: 16, dur: 13, delay: 2,    rot: 80,  op: 0.13, variant: "a" },
  { x: "15%",  y: "30%",  s: 24, dur: 11, delay: 7,    rot: -50, op: 0.14, variant: "b" },
  { x: "80%",  y: "22%",  s: 19, dur: 12, delay: 1.5,  rot: 15,  op: 0.15, variant: "c" },
  { x: "32%",  y: "43%",  s: 17, dur: 14, delay: 5.5,  rot: -70, op: 0.13, variant: "a" },
  { x: "72%",  y: "50%",  s: 21, dur: 10, delay: 3,    rot: 55,  op: 0.14, variant: "b" },
];

// ─── SVG leaf paths (3 variants to create visual diversity) ───────────────────
function LeafSVG({ variant, size, rot, op, x, y, dur, delay }) {
  // Each variant = slightly different leaf silhouette for 3D feel
  const paths = {
    // classic oval leaf with midrib + veins
    a: (
      <>
        <path
          d="M12 2 C6 2 2 7 2 12 C2 17 6 22 12 22 C18 22 22 17 22 12 C22 7 18 2 12 2 Z"
          fill="url(#lgA)"
        />
        <line x1="12" y1="3" x2="12" y2="21" stroke="rgba(0,200,100,0.3)" strokeWidth="0.8" />
        <path d="M12 8 Q8 9 6 12" fill="none" stroke="rgba(0,200,100,0.18)" strokeWidth="0.5" />
        <path d="M12 8 Q16 9 18 12" fill="none" stroke="rgba(0,200,100,0.18)" strokeWidth="0.5" />
        <path d="M12 14 Q8 15 7 17" fill="none" stroke="rgba(0,200,100,0.15)" strokeWidth="0.5" />
        <path d="M12 14 Q16 15 17 17" fill="none" stroke="rgba(0,200,100,0.15)" strokeWidth="0.5" />
      </>
    ),
    // elongated pointed leaf
    b: (
      <>
        <path
          d="M12 1 C8 4 4 8 4 13 C4 18 8 23 12 23 C16 23 20 18 20 13 C20 8 16 4 12 1 Z"
          fill="url(#lgB)"
        />
        <line x1="12" y1="2" x2="12" y2="22" stroke="rgba(0,210,110,0.28)" strokeWidth="0.7" />
        <path d="M12 10 Q9 11 7 14" fill="none" stroke="rgba(0,210,110,0.16)" strokeWidth="0.5" />
        <path d="M12 10 Q15 11 17 14" fill="none" stroke="rgba(0,210,110,0.16)" strokeWidth="0.5" />
      </>
    ),
    // rounder heart-ish leaf
    c: (
      <>
        <path
          d="M12 3 C7 3 3 6 3 11 C3 16 7 21 12 22 C17 21 21 16 21 11 C21 6 17 3 12 3 Z"
          fill="url(#lgC)"
        />
        <line x1="12" y1="4" x2="12" y2="21" stroke="rgba(20,220,120,0.25)" strokeWidth="0.7" />
        <path d="M12 9 Q8 10 6 13" fill="none" stroke="rgba(20,220,120,0.15)" strokeWidth="0.5" />
        <path d="M12 9 Q16 10 18 13" fill="none" stroke="rgba(20,220,120,0.15)" strokeWidth="0.5" />
        <path d="M12 15 Q9 16 8 19" fill="none" stroke="rgba(20,220,120,0.12)" strokeWidth="0.4" />
        <path d="M12 15 Q15 16 16 19" fill="none" stroke="rgba(20,220,120,0.12)" strokeWidth="0.4" />
      </>
    ),
  };

  // Unique animation name per leaf (avoids collision between different timings)
  const animName = `dtLeaf_${Math.round(x.replace("%","") * 10)}_${Math.round(y.replace("%","") * 10)}`;

  return (
    <>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          position: "fixed",
          left: x,
          top:  y,
          zIndex: 0,
          pointerEvents: "none",
          opacity: op,
          willChange: "transform",
          filter: `blur(${size > 35 ? "0.4px" : "0px"}) drop-shadow(0 0 ${size > 35 ? "6px" : "3px"} rgba(0,200,100,0.35))`,
          animation: `${animName} ${dur}s ease-in-out ${delay}s infinite alternate`,
        }}
      >
        <defs>
          <radialGradient id="lgA" cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#4ade80" />
            <stop offset="45%"  stopColor="#16a34a" />
            <stop offset="100%" stopColor="#064e3b" />
          </radialGradient>
          <radialGradient id="lgB" cx="45%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#34d399" />
            <stop offset="50%"  stopColor="#059669" />
            <stop offset="100%" stopColor="#052e16" />
          </radialGradient>
          <radialGradient id="lgC" cx="38%" cy="38%" r="62%">
            <stop offset="0%"   stopColor="#6ee7b7" />
            <stop offset="40%"  stopColor="#10b981" />
            <stop offset="100%" stopColor="#064e3b" />
          </radialGradient>
        </defs>
        {paths[variant]}
      </svg>

      {/* Scoped keyframe for this leaf */}
      <style>{`
        @keyframes ${animName} {
          0%   { transform: translate(0px,   0px)  rotate(${rot}deg)       scale(1);    }
          25%  { transform: translate(6px,  -14px) rotate(${rot + 8}deg)   scale(1.03); }
          50%  { transform: translate(-5px, -22px) rotate(${rot - 5}deg)   scale(0.97); }
          75%  { transform: translate(8px,  -10px) rotate(${rot + 12}deg)  scale(1.02); }
          100% { transform: translate(-4px, -18px) rotate(${rot + 3}deg)   scale(1);    }
        }
      `}</style>
    </>
  );
}

// ─── Dust particles ───────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  x: `${(i * 3.4 + 2) % 96}%`,
  y: `${(i * 3.1 + 5) % 92}%`,
  size: 1.5 + (i % 4) * 0.8,
  dur:  7 + (i % 8),
  delay: (i * 0.38) % 6,
  color: i % 3 === 0
    ? "rgba(74,222,128,0.55)"
    : i % 3 === 1
      ? "rgba(52,211,153,0.45)"
      : "rgba(16,185,129,0.40)",
}));

// ─── Canvas ambient mesh ──────────────────────────────────────────────────────
function AmbientCanvas() {
  const ref    = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    const COUNT = Math.max(20, Math.floor((W * H) / 28000));
    const dots = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r:  0.8 + Math.random() * 1.2,
    }));

    const MAX = 110;

    function tick() {
      ctx.clearRect(0, 0, W, H);

      dots.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;
      });

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx   = dots[i].x - dots[j].x;
          const dy   = dots[i].y - dots[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX) {
            ctx.strokeStyle = `rgba(74,222,128,${(1 - dist / MAX) * 0.05})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(dots[i].x, dots[i].y, dots[i].r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(74,222,128,0.10)";
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(tick);
    }

    tick();
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function DarkThemeBG({ theme }) {
  // Render NOTHING when not in dark mode
  if (theme !== "dark") return null;

  return (
    <>
      {/* ── Layer 1 – deep green radial aura ───────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 60% 45% at 8%  15%, rgba(6,78,59,0.18)  0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 92% 85%, rgba(4,120,87,0.14)  0%, transparent 65%),
            radial-gradient(ellipse 40% 35% at 50% 50%, rgba(5,46,22,0.10)   0%, transparent 60%)
          `,
        }}
      />

      {/* ── Layer 2 – constellation mesh canvas ────────────── */}
      <AmbientCanvas />

      {/* ── Layer 3 – floating 3D leaves ───────────────────── */}
      {LEAVES.map((leaf, i) => (
        <LeafSVG key={i} {...leaf} />
      ))}

      {/* ── Layer 4 – dust particles ────────────────────────── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: p.x,
            top:  p.y,
            width:  p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            zIndex: 0,
            pointerEvents: "none",
            willChange: "transform",
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animation: `dtDust_${i} ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Dust keyframes */}
      <style>{`
        ${PARTICLES.map((p, i) => `
          @keyframes dtDust_${i} {
            0%   { transform: translate(0px,  0px)   scale(1);    opacity: 0.7; }
            33%  { transform: translate(${3 + i % 5}px, -${8 + i % 10}px) scale(1.3);  opacity: 1;   }
            66%  { transform: translate(-${2 + i % 4}px, -${5 + i % 8}px) scale(0.85); opacity: 0.8; }
            100% { transform: translate(${1 + i % 3}px, -${12 + i % 7}px) scale(1.1);  opacity: 0.6; }
          }
        `).join("")}
      `}</style>
    </>
  );
}
