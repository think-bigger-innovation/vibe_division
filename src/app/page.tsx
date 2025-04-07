"use client";

import { useState } from "react";
import { JoyDivisionGraph } from "./components/JoyDivisionGraph";

export default function Home() {
  const [isAnimated, setIsAnimated] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black">
      <div className="w-full max-w-[800px] text-center text-white text-4xl font-bold mb-4">
        THINK BIGGER
      </div>
      <JoyDivisionGraph isAnimated={isAnimated} />
      <div className="w-full max-w-[800px] text-center text-white text-2xl mt-4">
        CHOICE MAPPER
      </div>
      <button
        onClick={() => setIsAnimated(!isAnimated)}
        className="mt-8 px-6 py-3 bg-blue-800 text-white font-bold rounded hover:bg-blue-700 transition-colors"
      >
        {isAnimated ? "Stop Animation" : "Start Animation"}
      </button>
    </main>
  );
}
