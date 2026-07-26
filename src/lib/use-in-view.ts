"use client";
import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  once?: boolean;
  margin?: string;
}

export function useInView({
  once = true,
  margin = "0px",
}: UseInViewOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: margin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [once, margin]);

  return { ref, inView };
}