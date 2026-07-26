"use client";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}

const DIRECTION_MAP = {
  up: "translate-y-6",
  down: "-translate-y-6",
  left: "translate-x-6",
  right: "-translate-x-6",
  none: "",
};

export function FadeIn({
  children,
  delay = 0,
  className,
  direction = "up",
}: FadeInProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        inView ? "translate-x-0 translate-y-0 opacity-100" : `${DIRECTION_MAP[direction]} opacity-0`,
        className
      )}
    >
      {children}
    </div>
  );
}