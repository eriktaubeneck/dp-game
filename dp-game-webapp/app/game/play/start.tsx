"use client";

import React from "react";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import { CampaignStats } from "../campaignStats";
import {
  GameContainer,
  PageContainer,
  PageDescription,
  PageTitle,
} from "./components";

export default function StartGame({
  impressions,
  conversionRate,
  setGameStatePlaying,
  setGameStateValidate,
}: {
  impressions: number;
  conversionRate: number;
  setGameStatePlaying: () => void;
  setGameStateValidate: () => void;
}) {
  return (
    <PageContainer>
      <PageTitle>Get ready!</PageTitle>
      <PageDescription>
        Before starting the game, we need to configure it to your typical usage.
        As a reminder, below is your current configuration.
      </PageDescription>

      <GameContainer>
        <CampaignStats
          impressions={impressions}
          conversionRate={conversionRate}
          className=""
        />

        <div className="flex justify-between items-center mt-10 space-x-4">
          <button
            className="mt-10 h-12 w-32 lg:w-40 bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
            onClick={setGameStateValidate}
          >
            <ArrowLeftCircleIcon className="h-8 w-auto" />
            Back
          </button>

          <button
            className="mt-10 h-12 w-32 lg:w-40 bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
            onClick={setGameStatePlaying}
          >
            Start <ArrowRightCircleIcon className="h-8 w-auto" />
          </button>
        </div>
      </GameContainer>
    </PageContainer>
  );
}
