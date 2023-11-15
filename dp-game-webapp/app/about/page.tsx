"use client";

import React, { useState } from "react";
import { PageContainer, PageDescription, PageTitle } from "../components";
import { LaplacePlot } from "../plots";
import { ExponentialNumber } from "../exponentialNumber";

export default function About() {
  const [scale, setScale] = useState<ExponentialNumber>(
    new ExponentialNumber(0, 1.072),
  );

  return (
    <PageContainer>
      <PageTitle>Learn more about the Differential Privacy Game.</PageTitle>
      <PageDescription>.</PageDescription>
      <div className="mt-10">
        <h3 className="text-lg sm:text-4xl font-bold tracking-tight">
          Differential Privacy
        </h3>
        <p>
          We often think of privacy as a <i>binary</i> attribute: either a
          system is private or it is not. Contrary to this idea, differential
          privacy does not tell us if a system is private or not.
        </p>
        <p>
          Instead, it's <b>measure of a system</b> that tells us how much
          information is revealed about individual data points within that
          system.
        </p>

        <LaplacePlot
          mean={0}
          scale={scale.value}
          className="w-full aspect-[3/1] mt-4 bg-slate-100 dark:bg-slate-900 rounded-lg"
        />

        <ScaleSlider scale={scale} onChange={setScale} />
      </div>
    </PageContainer>
  );
}

function ScaleSlider({
  scale,
  onChange,
}: {
  scale: ExponentialNumber;
  onChange: (value: ExponentialNumber) => void;
}) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const newScale = new ExponentialNumber(val, scale.base);
    onChange(newScale);
  };

  return (
    <>
      <p>Laplace Scale Parameter: {scale.toString()}</p>
      <input
        type="range"
        min="-100"
        max="100"
        value={scale.exponent}
        onChange={handleSliderChange}
        className="w-full"
      />
    </>
  );
}
