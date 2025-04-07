"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

interface Props {
  isAnimated: boolean;
}

export const JoyDivisionGraph: React.FC<Props> = ({ isAnimated }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<number[][]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const groupRef = useRef<SVGGElement | null>(null);
  const frameCounterRef = useRef(0);

  const generateData = useCallback(() => {
    const rows = 80;
    const cols = 100;
    const peakHeight = 60;
    const edgeHeight = 5;

    return Array.from({ length: rows }, (_, i) => {
      const distanceFactor = Math.abs(i - rows / 2) / (rows / 2);
      const amplitude =
        edgeHeight + (peakHeight - edgeHeight) * (1 - distanceFactor);

      const rowData = Array.from({ length: cols }, (_, j) => {
        const positionRatio = j / (cols - 1);
        let value = 0;

        if (positionRatio < 0.25) {
          value = Math.random() * edgeHeight * 0.5;
        } else if (positionRatio < 0.75) {
          value = Math.random() * amplitude;
        } else {
          value = Math.random() * edgeHeight * 0.5;
        }
        return value;
      });

      const middleStart = Math.floor(cols * 0.25);
      const middleEnd = Math.floor(cols * 0.75);
      const middleLength = middleEnd - middleStart;

      if (
        Math.abs(i - rows / 2) < rows * 0.2 &&
        distanceFactor < 0.5 &&
        Math.random() > 0.8
      ) {
        const peakIndex =
          Math.floor(Math.random() * (middleLength - 10)) + middleStart + 5;

        const currentPeakHeight = peakHeight * 1.5;
        for (let k = -2; k <= 2; k++) {
          const index = peakIndex + k;
          if (index >= 0 && index < cols) {
            const falloff = Math.exp(-(k * k) / 2);
            rowData[index] = Math.max(
              rowData[index],
              currentPeakHeight * falloff
            );
          }
        }
      }

      return rowData;
    });
  }, []);

  useEffect(() => {
    setData(generateData());
  }, [generateData]);

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
    group.attr("transform", null);

    const x = d3
      .scaleLinear()
      .domain([0, data[0].length - 1])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.top, height - margin.bottom]);

    const areaGenerator = d3
      .area<number>()
      .x((_d, j) => x(j))
      .y0(0)
      .y1(0)
      .curve(d3.curveBasis);

    group.selectAll("path").remove();

    data.forEach((rowData, i) => {
      const rowY = y(i);
      areaGenerator.y0(rowY);
      areaGenerator.y1((d) => rowY - d);

      group
        .append("path")
        .datum(rowData)
        .attr("fill", "black")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("d", areaGenerator);
    });
  }, [data]);

  useEffect(() => {
    const updateFrequency = 5;

    const animate = () => {
      frameCounterRef.current++;
      if (frameCounterRef.current % updateFrequency === 0) {
        setData((currentData) => {
          if (currentData.length <= 1) return currentData;
          const lastRow = currentData[currentData.length - 1];
          const restRows = currentData.slice(0, currentData.length - 1);
          return [lastRow, ...restRows];
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isAnimated && data.length > 0) {
      frameCounterRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [isAnimated, data.length]);

  return (
    <div className="relative w-[800px] h-[600px] bg-black overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
