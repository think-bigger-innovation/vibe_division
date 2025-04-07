"use client";

import { useState } from "react";
import { JoyDivisionGraph } from "./components/JoyDivisionGraph";

export default function Home() {
  const [isAnimated, setIsAnimated] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-24 bg-black">
      <button
        onClick={() => setIsAnimated(!isAnimated)}
        className="absolute top-8 right-8 z-10 px-4 py-2 bg-blue-800 text-white font-bold rounded hover:bg-blue-700 transition-colors text-sm"
      >
        {isAnimated ? "Stop" : "Animate"}
      </button>

      <div className="w-full max-w-[800px] text-center text-white text-4xl font-bold mb-4">
        THINK BIGGER
      </div>
      <JoyDivisionGraph isAnimated={isAnimated} />
      <div className="w-full max-w-[800px] text-center text-white text-2xl mt-4">
        CHOICE MAPPER
      </div>
    </main>
  );
}
