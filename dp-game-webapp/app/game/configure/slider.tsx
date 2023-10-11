import React, { useState } from "react";
import { generateSimulatedConversions, adjustedVariance } from "../simulate";

export function CampaignSizeSlider({ value, onChange }) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onChange(val);
  };
  const displayValue = Math.pow(10, value).toLocaleString();

  return (
    <>
      <p>Campaign Size (impressions): {displayValue}</p>
      <input
        type="range"
        min="4"
        max="8"
        value={value}
        onChange={handleSliderChange}
        className="w-full"
      />
    </>
  );
}

export function ConversionRateSlider({ value, onChange }) {
  const sliderValue = (value * 1000) / 5;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    let conversionRate = (5 / 1000) * val;
    onChange(conversionRate);
    let variance = adjustedVariance(conversionRate);
    console.log(
      Array.from(
        generateSimulatedConversions(1000000, conversionRate, variance, 10),
      ),
    );
  };

  const displayValue = ((5 / 1000) * sliderValue).toFixed(3);
  return (
    <>
      <p>Average Conversion Rate: {displayValue}</p>
      <input
        type="range"
        min="1"
        max="199"
        value={sliderValue}
        onChange={handleSliderChange}
        className="w-full"
      />
    </>
  );
}