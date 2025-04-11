"use client";

import { useState, useEffect, useRef } from "react";
import { JoyDivisionGraph } from "./components/JoyDivisionGraph";
import { ControlPanel } from "./components/ControlPanel";

export default function Home() {
  const [isAnimated, setIsAnimated] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState({
    numberOfRows: 49,
    peakBandRatio: 0.1,
    peakHeightMultiplier: 3.2,
    peakBandNoiseMultiplier: 1.0,
    peakGenerationProbability: 0.1,
  });

  useEffect(() => {
    const toggleAnimation = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof MouseEvent) {
        if (!graphRef.current?.contains(e.target as Node)) return;
      }
      setIsAnimated((prev) => !prev);
    };

    window.addEventListener("click", toggleAnimation);
    window.addEventListener("keydown", toggleAnimation);

    return () => {
      window.removeEventListener("click", toggleAnimation);
      window.removeEventListener("keydown", toggleAnimation);
    };
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-24 bg-black">
      <div className="w-full max-w-[800px] text-center text-white text-4xl font-bold mb-4">
        A CHANGE OF SPEED
      </div>
      <div ref={graphRef}>
        <JoyDivisionGraph isAnimated={isAnimated} {...params} />
      </div>
      <div className="w-full max-w-[800px] text-center text-white text-4xl mt-4">
        HOPING FOR SOMETHING ELSE
      </div>
      <ControlPanel
        params={params}
        onChange={setParams}
        isAnimated={isAnimated}
        onAnimationToggle={() => setIsAnimated((prev) => !prev)}
      />
    </main>
  );
}
