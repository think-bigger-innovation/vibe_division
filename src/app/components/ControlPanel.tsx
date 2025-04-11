import { useState } from "react";

interface ControlPanelProps {
  params: {
    numberOfRows: number;
    peakBandRatio: number;
    peakHeightMultiplier: number;
    peakBandNoiseMultiplier: number;
    peakGenerationProbability: number;
  };
  isAnimated: boolean;
  onAnimationToggle: () => void;
  onChange: (params: ControlPanelProps["params"]) => void;
}

export function ControlPanel({
  params,
  isAnimated,
  onAnimationToggle,
  onChange,
}: ControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`fixed right-0 top-0 h-full bg-gray-900/95 text-white transition-all duration-300 ${
        isOpen ? "w-80" : "w-12"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-20 top-1/2 -translate-y-1/2 -translate-x-full rotate-90 bg-gray-900/95 px-2 py-1 text-sm"
      >
        {isOpen ? "▲▲" : "▼▼▼"} CONTROL {isOpen ? "▲▲" : "▼▼▼"}
      </button>

      <div className={`p-6 ${isOpen ? "opacity-100" : "opacity-0"}`}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold">Parameters</h3>
          <button
            onClick={onAnimationToggle}
            className={`px-3 py-1 rounded ${
              isAnimated ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {isAnimated ? "Stop" : "Start"} Animation
          </button>
        </div>

        {Object.entries(params).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm mb-1">
              {key}: {value}
            </label>
            <input
              type="range"
              min={key === "numberOfRows" ? "10" : "0"}
              max={
                key === "numberOfRows"
                  ? "100"
                  : key === "peakHeightMultiplier"
                  ? "10"
                  : "1"
              }
              step={key === "numberOfRows" ? "1" : "0.1"}
              value={value}
              onChange={(e) =>
                onChange({ ...params, [key]: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
