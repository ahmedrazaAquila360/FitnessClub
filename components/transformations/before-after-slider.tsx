"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  memberName,
}: {
  beforeImage: string;
  afterImage: string;
  memberName: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-4/5 w-full touch-none select-none overflow-hidden rounded-3xl"
      onMouseDown={(e) => {
        dragging.current = true;
        updateFromClientX(e.clientX);
      }}
      onMouseMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX);
      }}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => updateFromClientX(e.touches[0].clientX)}
      onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
    >
      <div className="absolute inset-0">
        <Image src={afterImage} alt={`${memberName} after`} fill sizes="500px" className="object-cover" />
        <span className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
          After
        </span>
      </div>

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <div
          className="relative h-full"
          style={{ width: position > 0 ? `${(100 / position) * 100}%` : "100%" }}
        >
          <Image src={beforeImage} alt={`${memberName} before`} fill sizes="500px" className="object-cover" />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
          Before
        </span>
      </div>

      <motion.div
        className="absolute inset-y-0 z-10 flex w-0.5 -translate-x-1/2 cursor-ew-resize items-center justify-center bg-white/80"
        style={{ left: `${position}%` }}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg">
          <MoveHorizontal className="h-4 w-4" />
        </span>
      </motion.div>
    </div>
  );
}
