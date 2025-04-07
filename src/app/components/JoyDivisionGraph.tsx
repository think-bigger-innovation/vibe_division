"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Props {
  isAnimated: boolean;
}

export const JoyDivisionGraph: React.FC<Props> = ({ isAnimated }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<number[][]>([]);
  const animationRef = useRef<number>();

  const generateData = () => {
    const rows = 50;
    const cols = 100;
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() * 50)
    );
  };

  useEffect(() => {
    setData(generateData());
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    svg.attr("width", width).attr("height", height);

    const x = d3
      .scaleLinear()
      .domain([0, data[0].length - 1])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.top, height - margin.bottom]);

    const area = d3
      .area()
      .x((d, i) => x(i))
      .y0((d) => d[0])
      .y1((d) => d[1])
      .curve(d3.curveBasis);

    const updateGraph = (offset = 0) => {
      svg.selectAll("path").remove();

      data.forEach((row, i) => {
        const points = row.map((value, j) => {
          const animOffset = isAnimated
            ? Math.sin((j + offset) * 0.1) * 10 +
              Math.cos((i + offset) * 0.1) * 10
            : 0;
          return [y(i), y(i) - value - animOffset];
        });

        svg
          .append("path")
          .datum(points)
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 1)
          .attr("d", area as any);
      });
    };

    if (isAnimated) {
      let offset = 0;
      const animate = () => {
        offset += 0.5;
        updateGraph(offset);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      updateGraph();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, isAnimated]);

  return (
    <div className="relative w-full h-[600px] bg-black">
      <div className="absolute top-4 left-0 w-full text-center text-white text-4xl font-bold">
        THINK BIGGER
      </div>
      <svg ref={svgRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-0 w-full text-center text-white text-2xl">
        CHOICE MAPPER
      </div>
    </div>
  );
};
