"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Props {
  isAnimated: boolean;
}

export const JoyDivisionGraph: React.FC<Props> = ({ isAnimated }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<number[][]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const groupRef = useRef<SVGGElement | null>(null);

  const generateData = () => {
    const rows = 80;
    const cols = 100;
    const peakHeight = 60;
    const edgeHeight = 5;

    return Array.from({ length: rows }, (_, i) => {
      const distanceFactor = Math.abs(i - rows / 2) / (rows / 2);
      const amplitude =
        edgeHeight + (peakHeight - edgeHeight) * (1 - distanceFactor);

      const rowData = Array.from(
        { length: cols },
        () => Math.random() * amplitude
      );

      if (Math.abs(i - rows / 2) < rows * 0.2 && Math.random() > 0.8) {
        const peakIndex = Math.floor(Math.random() * (cols - 20)) + 10;
        for (let k = 0; k < 5; k++) {
          if (peakIndex + k < cols) {
            rowData[peakIndex + k] = peakHeight * (1 + Math.random() * 0.5);
          }
        }
      }

      return rowData;
    });
  };

  useEffect(() => {
    setData(generateData());
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;
    const margin = { top: 50, right: 20, bottom: 50, left: 20 };

    svg.attr("width", width).attr("height", height);

    if (!groupRef.current) {
      groupRef.current = svg.append("g").node();
    }
    const group = d3.select(groupRef.current);

    const x = d3
      .scaleLinear()
      .domain([0, data[0].length - 1])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.top, height - margin.bottom]);

    const area = d3
      .area<[number, number]>()
      .x((d, i) => x(i))
      .y0((d) => d[0])
      .y1((d) => d[1])
      .curve(d3.curveBasis);

    const linesData = data.map((row, i) => {
      return row.map((value, j) => {
        return [y(i), y(i) - value];
      });
    });

    const drawStaticGraph = () => {
      group.selectAll("path").remove();
      group.attr("transform", null);

      linesData.forEach((points) => {
        group
          .append("path")
          .datum(points)
          .attr("fill", "black")
          .attr("stroke", "white")
          .attr("stroke-width", 1)
          .attr("d", area);
      });
    };

    if (isAnimated) {
      let yOffset = 0;
      const scrollSpeed = 0.5;
      const totalHeight = height - margin.top - margin.bottom;

      const animate = () => {
        yOffset = (yOffset + scrollSpeed) % totalHeight;

        group.attr("transform", `translate(0, ${yOffset})`);

        animationRef.current = requestAnimationFrame(animate);
      };

      drawStaticGraph();
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      drawStaticGraph();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, isAnimated]);

  return (
    <div className="relative w-[800px] h-[600px] bg-black overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
