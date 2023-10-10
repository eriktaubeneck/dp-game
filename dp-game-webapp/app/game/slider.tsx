import React, { useState } from "react";
import { simulateConversions } from "./simulate";

export function CampaignSizeSlider() {
  const [sliderExpValue, setSliderExpValue] = useState(6);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSliderExpValue(val);
  };
  const displayValue = Math.pow(10, sliderExpValue).toLocaleString();

  return (
    <>
      <p>Campaign Size (impressions): {displayValue}</p>
      <input
        type="range"
        min="4"
        max="8"
        value={sliderExpValue}
        onChange={handleSliderChange}
        className="w-full"
      />
    </>
  );
}

export function ConversionRateSlider() {
  const [sliderValue, setSliderValue] = useState(2);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSliderValue(val);
    let conversionRate = (5 / 1000) * val;
    console.log(simulateConversions(1000000, conversionRate, 10));
  };

  const displayValue = ((5 / 1000) * sliderValue).toFixed(3);
  return (
    <>
      <p>Average Conversion Rate: {displayValue}</p>
      <input
        type="range"
        min="1"
        max="200"
        value={sliderValue}
        onChange={handleSliderChange}
        className="w-full"
      />
    </>
  );
}
