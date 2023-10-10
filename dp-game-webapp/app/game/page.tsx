"use client";
import React, { useState } from "react";
import { CampaignSizeSlider, ConversionRateSlider } from "./slider";
import { simulateConversions, simulateConversionRates } from "./simulate";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

export default function Game() {
  const [isClicked, setIsClicked] = useState(false);

  const handleButtonClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
      <h1 className="max-w-2xl text-xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
        Configuration
      </h1>
      <section className="py-8">
        <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
          <p className="text-lg leading-8 text-gray-600">
            Before starting the game, we need to configure it to your typical
            usage.
          </p>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white/60 px-6 py-6 text-gray-600 shadow sm:rounded-lg sm:px-12">
            <div className="flex-col items-center justify-between">
              <CampaignSizeSlider />
            </div>
            <div className="mt-6 flex-col items-center justify-between">
              <ConversionRateSlider />
            </div>
            <button
              className="mt-10 h-12 w-56 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
              onClick={handleButtonClick}
            >
              Continue <ArrowRightCircleIcon className="h-8 w-auto" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
