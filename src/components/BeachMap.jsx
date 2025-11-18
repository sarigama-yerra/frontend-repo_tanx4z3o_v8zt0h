import { useEffect, useMemo, useRef, useState } from "react";

function UmbrellaIcon({ status = "available" }) {
  const color = status === "available" ? "fill-emerald-500" : status === "occupied" ? "fill-rose-500" : "fill-amber-400";
  return (
    <svg viewBox="0 0 24 24" className={`w-6 h-6 ${color} drop-shadow`}>
      <path d="M12 2C7 2 3 6 3 11h18c0-5-4-9-9-9zm0 0v9M8 22h8" stroke="white" strokeWidth="1.5" fill="currentColor" />
    </svg>
  );
}

export default function BeachMap({ umbrellas = [], availability = {}, onSelect }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // simple responsive fit
    const el = containerRef.current;
    if (!el) return;
    const resize = () => {
      const w = el.clientWidth;
      setScale(Math.max(1, w / 360));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[360px] bg-sky-50 rounded-xl border border-sky-200 overflow-hidden">
      {/* sea */}
      <div className="absolute inset-x-0 top-0 h-20 bg-sky-200" />
      {/* sand */}
      <div className="absolute inset-x-0 bottom-0 h-[280px] bg-amber-100" />

      {/* umbrellas */}
      {umbrellas.map((u) => {
        const status = availability[u._id] || "available";
        const left = `${u.x * 100}%`;
        const top = `${u.y * 100}%`;
        return (
          <button
            key={u._id}
            onClick={() => onSelect && onSelect(u)}
            className="absolute -translate-x-1/2 -translate-y-1/2 active:scale-95"
            style={{ left, top }}
          >
            <div className="flex flex-col items-center">
              <UmbrellaIcon status={status} />
              <span className="text-[10px] font-semibold text-slate-700">{u.number}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
