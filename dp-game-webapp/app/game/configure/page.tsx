"use client";
import React, { useState } from "react";
import Link from "next/link";
import { CampaignSizeSlider, ConversionRateSlider } from "./slider";
import { CampaignStats } from "../campaignStats";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { defaultVariance } from "../simulate";

export default function Configure() {
  const savedConversionRate = parseFloat(
    sessionStorage.getItem("conversionRate") || "0.01",
  );
  const [conversionRate, setConversionRate] = useState(savedConversionRate);
  const savedCampaignSizeExp = parseInt(
    sessionStorage.getItem("campaignSizeExp") || "6",
  );
  const [campaignSizeExp, setCampaignSizeExp] = useState(savedCampaignSizeExp);
  const impressions: number = Math.pow(10, campaignSizeExp);
  const totalConversions: number = impressions * conversionRate;
  const conversionPerThousand: number = 1000 * conversionRate;

  const handleButtonClick = () => {
    sessionStorage.setItem("conversionRate", conversionRate.toString());
    sessionStorage.setItem("campaignSizeExp", campaignSizeExp.toString());
    sessionStorage.setItem(
      "conversionRateVariance",
      defaultVariance(conversionRate).toString(),
    );
  };

  const handleConversionRateChange = (value: number) => {
    setConversionRate(value);
  };

  const handleCampaignSizeChange = (value: number) => {
    setCampaignSizeExp(value);
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
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[510px]">
          <div className="bg-white/60 px-6 py-6 text-gray-600 shadow sm:rounded-lg sm:px-12">
            <div className="mb-6 text-xl font-semibold leading-6 text-blue-600">
              Configuration
            </div>

            <div className="flex-col items-center justify-between">
              <CampaignSizeSlider
                value={campaignSizeExp}
                onChange={handleCampaignSizeChange}
              />
            </div>
            <div className="mt-6 flex-col items-center justify-between">
              <ConversionRateSlider
                value={conversionRate}
                onChange={handleConversionRateChange}
              />
            </div>

            <hr className="h-px mt-4 mb-4 bg-gray-200 border-0 dark:bg-gray-700" />

            <CampaignStats
              impressions={impressions}
              totalConversions={totalConversions}
              conversionsPerThousand={conversionPerThousand}
              className="mt-6"
            />

            <div className="flex justify-end mt-10">
              <Link href="/game/validate">
                <button
                  className="mt-10 h-12 w-56 bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
                  onClick={handleButtonClick}
                >
                  Continue <ArrowRightCircleIcon className="h-8 w-auto" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
