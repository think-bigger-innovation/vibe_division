"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

interface Props {
  isAnimated: boolean;
  numberOfRows?: number;
  peakBandRatio?: number;
  peakHeightMultiplier?: number;
  peakBandNoiseMultiplier?: number;
  peakGenerationProbability?: number;
}

export const JoyDivisionGraph: React.FC<Props> = ({
  isAnimated,
  numberOfRows = 45,
  peakBandRatio = 0.2,
  peakHeightMultiplier = 2.0,
  peakBandNoiseMultiplier = 1.0,
  peakGenerationProbability = 0.05,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<number[][]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const groupRef = useRef<SVGGElement | null>(null);
  const frameCounterRef = useRef(0);

  const generateData = useCallback(() => {
    const rows = numberOfRows;
    const cols = 100;
    const peakHeight = 60;
    const edgeHeight = 5;

    return Array.from({ length: rows }, (_, i) => {
      const rowData = Array.from({ length: cols }, (_, j) => {
        const positionRatio = j / (cols - 1);
        let value = 0;

        if (positionRatio < 0.25) {
          value = Math.random() * edgeHeight * 0.5;
        } else if (positionRatio < 0.75) {
          value = Math.random() * peakHeight;
        } else {
          value = Math.random() * edgeHeight * 0.5;
        }
        return value;
      });

      const middleStart = Math.floor(cols * 0.25);
      const middleEnd = Math.floor(cols * 0.75);
      const middleLength = middleEnd - middleStart;

      if (
        Math.abs(i - rows / 2) < rows * peakBandRatio &&
        Math.random() > 0.8
      ) {
        const peakIndex =
          Math.floor(Math.random() * (middleLength - 10)) + middleStart + 5;

        const currentPeakHeight = peakHeight * peakHeightMultiplier;
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
  }, [numberOfRows, peakBandRatio, peakHeightMultiplier]);

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
    const updateFrequency = 2;
    const cols = 100;
    const peakHeight = 60;
    const edgeHeight = 5;

    const animate = () => {
      frameCounterRef.current++;
      if (frameCounterRef.current % updateFrequency === 0) {
        setData((currentData) => {
          if (currentData.length === 0) return currentData;

          let processedData = currentData.map((row) => {
            const newRow = [...row];
            for (let j = cols - 2; j >= 0; j--) {
              const nextPositionRatio = (j + 1) / (cols - 1);
              if (nextPositionRatio >= 0.75) {
                newRow[j + 1] = Math.random() * edgeHeight * 0.5;
              } else {
                newRow[j + 1] = row[j];
              }
            }
            newRow[0] = Math.random() * edgeHeight * 0.5;
            return newRow;
          });

          const middleStart = Math.floor(cols * 0.25);
          const middleEnd = Math.floor(cols * 0.75);
          const middleLength = middleEnd - middleStart;

          processedData = processedData.map((row /*, i*/) => {
            const amplitude = peakHeight;
            for (let j = middleStart; j < middleEnd; j++) {
              row[j] = Math.max(
                row[j],
                Math.random() * amplitude * peakBandNoiseMultiplier
              );
            }

            if (Math.random() < peakGenerationProbability) {
              const peakIndex =
                Math.floor(Math.random() * (middleLength - 10)) +
                middleStart +
                5;
              const currentPeakHeight = peakHeight * peakHeightMultiplier;
              for (let k = -2; k <= 2; k++) {
                const index = peakIndex + k;
                if (index >= middleStart && index < middleEnd) {
                  const falloff = Math.exp(-(k * k) / 2);
                  row[index] = Math.max(
                    row[index],
                    currentPeakHeight * falloff
                  );
                }
              }
            }
            return row;
          });

          if (processedData.length <= 1) return processedData;
          const lastRow = processedData[processedData.length - 1];
          const restRows = processedData.slice(0, processedData.length - 1);
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
  }, [
    isAnimated,
    data.length,
    numberOfRows,
    peakHeightMultiplier,
    peakBandNoiseMultiplier,
    peakGenerationProbability,
  ]);

  return (
    <div className="relative w-[800px] h-[600px] bg-black overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
