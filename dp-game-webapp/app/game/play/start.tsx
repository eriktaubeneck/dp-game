"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { CampaignStats } from "../campaignStats";

export default function StartGame({
  impressions,
  totalConversions,
  conversionsPerThousand,
  clickStart,
}: {
  impressions: number;
  totalConversions: number;
  conversionsPerThousand: number;
  clickStart: () => void;
}) {
  return (
    <>
      <h1 className="max-w-2xl py-3 text-xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto dark:text-white">
        Get ready!
      </h1>

      <p className="text-lg leading-8 text-gray-600 dark:text-white">
        Before starting the game, we need to configure it to your typical usage.
        As a reminder, below is your current configuration.
      </p>

      <CampaignStats
        impressions={impressions}
        totalConversions={totalConversions}
        conversionsPerThousand={conversionsPerThousand}
        className="mt-6"
      />

      <div className="flex justify-between items-center mt-10 space-x-4">
        <Link href="/game/validate">
          <button className="mt-10 h-12 w-32 lg:w-40 bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between">
            <ArrowLeftCircleIcon className="h-8 w-auto" />
            Back
          </button>
        </Link>

        <button
          className="mt-10 h-12 w-32 lg:w-40 bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
          onClick={clickStart}
        >
          Start <ArrowRightCircleIcon className="h-8 w-auto" />
        </button>
      </div>
    </>
  );
}
