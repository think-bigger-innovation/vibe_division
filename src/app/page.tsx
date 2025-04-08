"use client";

import { useState, useEffect } from "react";
import { JoyDivisionGraph } from "./components/JoyDivisionGraph";

export default function Home() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const toggleAnimation = () => {
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
      <JoyDivisionGraph
        isAnimated={isAnimated}
        numberOfRows={30}
        peakBandRatio={0.1}
        peakHeightMultiplier={1.2}
        peakBandNoiseMultiplier={1.0}
        peakGenerationProbability={0.1}
      />
      <div className="w-full max-w-[800px] text-center text-white text-4xl mt-4">
        HOPING FOR SOMETHING ELSE
      </div>
    </main>
  );
}
