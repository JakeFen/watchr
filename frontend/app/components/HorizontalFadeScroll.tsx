"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export function HorizontalFadeScroll({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 0);
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateFades();
    window.addEventListener("resize", updateFades);
    return () => window.removeEventListener("resize", updateFades);
  }, [updateFades, children]);

  return (
    <div className="relative">
      {/* Fades the left edge in once you've scrolled away from the start */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-zinc-900 to-transparent transition-opacity duration-300 ${
          showLeftFade ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Fades the right edge in as long as there's more to scroll to */}
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-zinc-900 to-transparent transition-opacity duration-300 ${
          showRightFade ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={scrollRef}
        onScroll={updateFades}
        className="flex gap-4 overflow-x-auto pb-4 [scrollbar-color:var(--color-zinc-600)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {children}
      </div>
    </div>
  );
}
