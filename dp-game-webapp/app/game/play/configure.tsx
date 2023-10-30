"use client";
import React from "react";
import { CampaignSizeSlider, ConversionRateSlider } from "./slider";
import { CampaignStats } from "../campaignStats";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { ExponentialNumber } from "../../exponentialNumber";
import {
  GameContainer,
  PageContainer,
  PageDescription,
  PageTitle,
} from "./components";

export default function Configure({
  conversionRate,
  setConversionRate,
  campaignSize,
  setCampaignSize,
  setGameStateValidate,
}: {
  conversionRate: number;
  setConversionRate: (value: number) => void;
  campaignSize: ExponentialNumber;
  setCampaignSize: (value: ExponentialNumber) => void;
  setGameStateValidate: () => void;
}) {
  const handleConversionRateChange = (value: number) => {
    setConversionRate(value);
  };

  return (
    <PageContainer>
      <PageTitle>Configuration</PageTitle>
      <PageDescription>
        Before starting the game, we need to configure it to your typical usage.
      </PageDescription>
      <GameContainer>
        <div className="mb-6 text-xl font-semibold leading-6 text-blue-600">
          Configuration
        </div>

        <div className="flex-col items-center justify-between">
          <CampaignSizeSlider
            campaignSize={campaignSize}
            setCampaignSize={setCampaignSize}
          />
        </div>
        <div className="mt-6 flex-col items-center justify-between">
          <ConversionRateSlider
            conversionRate={conversionRate}
            onChange={handleConversionRateChange}
          />
        </div>

        <hr className="h-px mt-4 mb-4 bg-gray-200 border-0 dark:bg-gray-700" />

        <CampaignStats
          impressions={campaignSize.value}
          conversionRate={conversionRate}
          className="mt-6"
        />

        <div className="flex justify-end mt-10">
          <button
            className="mt-10 h-12 w-56 bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
            onClick={setGameStateValidate}
          >
            Continue <ArrowRightCircleIcon className="h-8 w-auto" />
          </button>
        </div>
      </GameContainer>
    </PageContainer>
  );
}
