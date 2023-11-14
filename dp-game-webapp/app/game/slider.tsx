import React from "react";
import { ExponentialNumber } from "../exponentialNumber";

export function CampaignSizeSlider({
  campaignSize,
  setCampaignSize,
}: {
  campaignSize: ExponentialNumber;
  setCampaignSize: (value: ExponentialNumber) => void;
}) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const newCampaignSize = new ExponentialNumber(val, campaignSize.base);
    setCampaignSize(newCampaignSize);
  };

  return (
    <>
      <p>Campaign Size (impressions): {campaignSize.toString()}</p>
      <input
        type="range"
        min="4"
        max="8"
        value={campaignSize.exponent}
        onChange={handleSliderChange}
        className="w-full"
      />
    </>
  );
}

export function ConversionRateSlider({
  conversionRate,
  onChange,
}: {
  conversionRate: number;
  onChange: (value: number) => void;
}) {
  const sliderValue = (conversionRate * 10000) / 5;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    let conversionRate = (5 / 10000) * val;
    onChange(conversionRate);
  };

  const displayValue = ((5 / 100) * sliderValue).toFixed(2);
  return (
    <>
      <p>Average Conversion Rate: {displayValue}%</p>
      <input
        type="range"
        min="1"
        max="1999"
        value={sliderValue}
        onChange={handleSliderChange}
        className="w-full"
      />
    </>
  );
}
