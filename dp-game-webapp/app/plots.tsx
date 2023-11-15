"use client";

// LaplacePlot.js
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export function LaplacePlot({
  className,
  mean,
  scale,
}: {
  className: string;
  mean: number;
  scale: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const width: number = 900;
    const height: number = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove(); // Clear existing elements

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const data: { x: number; y: number }[] = d3
      .range(-10, 10, 0.1)
      .map((x) => ({ x, y: laplaceDistribution(x, mean, scale) }));

    const xScale = d3.scaleLinear().domain([-10, 10]).range([0, chartWidth]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y as number)!])
      .range([chartHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const line = d3
      .line<{ x: number; y: number }>()
      .x((d) => xScale(d.x) + margin.left)
      .y((d) => yScale(d.y) + margin.top);

    svg
      .append("path")
      .data([data])
      .attr("d", line as any)
      .attr("fill", "none")
      .attr("stroke", "steelblue");

    // Draw X axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(xAxis);

    // Draw Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);
  }, [scale]);

  return <svg ref={svgRef} className={className}></svg>;
}

// Function to calculate Laplace distribution
function laplaceDistribution(x: number, mean: number, scale: number): number {
  return (1 / (2 * scale)) * Math.exp(-Math.abs(x - mean) / scale);
}
