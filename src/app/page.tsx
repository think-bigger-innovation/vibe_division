"use client";

import { useState } from "react";
import { JoyDivisionGraph } from "./components/JoyDivisionGraph";

export default function Home() {
  const [isAnimated, setIsAnimated] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black">
      <JoyDivisionGraph isAnimated={isAnimated} />
      <button
        onClick={() => setIsAnimated(!isAnimated)}
        className="mt-8 px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
      >
        {isAnimated ? "Stop Animation" : "Start Animation"}
      </button>
    </main>
  );
}
