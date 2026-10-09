"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

export function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const background = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, var(--accent-soft), transparent 65%)`;

  return (
    <motion.div
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
        rx.set(((e.clientY - r.top) / r.height - 0.5) * -5);
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 5);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={cn("group relative overflow-hidden rounded-3xl border bg-card transition-colors hover:border-accent/40", className)}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background }} />
      {children}
    </motion.div>
  );
}
