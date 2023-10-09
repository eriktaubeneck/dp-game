import React, { useState } from 'react';

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
  const [sliderValue, setSliderValue] = useState(10);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSliderValue(val);
  };

  const displayValue = (1 /1000 * sliderValue).toLocaleString();
  return (
    <>
      <p>Average Conversion Rate: {displayValue}</p>
      <input
        type="range"
        min="1"
        max="1000"
        value={sliderValue}
        onChange={handleSliderChange}
        className="w-full"
      />
    </>
  );
}
