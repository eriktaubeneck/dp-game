"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { adjustedVariance, simulatedPercentiles } from "../simulate";
import { CampaignStats } from "../campaignStats";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";

export default function Validate() {
  const [isContinueClicked, setIsContinueClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [percentiles, setPercentiles] = useState<number[]>([]);
  const [loadingPercent, setLoadingPercent] = useState(0);
  // hack to deal with React 18 strict mode
  // const percentilesCalculated = useRef(false);

  const conversionRate = parseFloat(
    sessionStorage.getItem("conversionRate") || "",
  );
  const savedVariance = parseFloat(
    sessionStorage.getItem("conversionRateVariance") || "",
  );
  const campaignSizeExp = parseInt(
    sessionStorage.getItem("campaignSizeExp") || "",
  );
  const impressions: number = Math.pow(10, campaignSizeExp);
  const totalConversions: number = impressions * conversionRate;
  const conversionPerThousand: number = 1000 * conversionRate;

  if (isNaN(conversionRate) || isNaN(impressions)) {
    redirect("/game/configure");
  }

  const variance: number = !isNaN(savedVariance)
    ? savedVariance
    : adjustedVariance(conversionRate);

  useEffect(() => {
    const getPercentiles = async () => {
      // this is a hack.
      // we use a tdigest to estimate the percentiles,
      // which uses binary trees to track those estimates.
      // at extreme values of conversionRate, those trees get
      // unbalanced, slowing down our estimation.
      // so we settle for less accurate percentiles there
      const rounds =
        conversionRate < 0.025 || conversionRate > 0.975 ? 10_000 : 1_000_000;

      const percentiles: number[] = await simulatedPercentiles(
        impressions,
        conversionRate,
        variance,
        rounds,
        1613149041,
        [0.01, 0.1, 0.5, 0.9, 0.99],
        setLoadingPercent,
      );
      setPercentiles(percentiles);
      setIsLoading(false);
    };

    getPercentiles();
  }, [variance]);

  const handleContinueButtonClick = () => {
    setIsContinueClicked(!isContinueClicked);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
      <h1 className="max-w-2xl text-xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
        Variance Validation
      </h1>
      <section className="py-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[510px]">
          <div className="bg-white/60 px-6 py-6 text-gray-600 shadow sm:rounded-lg sm:px-12">
            <CampaignStats
              impressions={impressions}
              totalConversions={totalConversions}
              conversionsPerThousand={conversionPerThousand}
              className="mt-6"
            />

            <div className="mb-6 flex-col items-center justify-between text-lg font-semibold underline underline-offset-auto">
              Expected Range of Results
            </div>

            {isLoading ? (
              <div className="spinner">
                {" "}
                Loading...
                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                    style={{
                      width: `${Math.max(5, loadingPercent).toFixed(0)}` + "%",
                    }}
                  >
                    {" "}
                    {loadingPercent}%
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-6 mb-6 flex-col items-center justify-between">
                  <b> Very bad campaign</b> (1 out of a 100)
                  <br />
                  {Math.round(percentiles[0]).toLocaleString()} Conversions
                </div>

                <div className="mt-6 mb-6 flex-col items-center justify-between">
                  <b> Bad campaign</b> (1 out of a 10)
                  <br />
                  {Math.round(percentiles[1]).toLocaleString()} Conversions
                </div>

                <div className="mt-6 mb-6 flex-col items-center justify-between">
                  <b> Average campaign</b> (5 out of a 10)
                  <br />
                  {Math.round(percentiles[2]).toLocaleString()} Conversions
                </div>

                <div className="mt-6 mb-6 flex-col items-center justify-between">
                  <b> Good campaign</b> (1 out of a 10)
                  <br />
                  {Math.round(percentiles[3]).toLocaleString()} Conversions
                </div>

                <div className="mt-6 mb-6 flex-col items-center justify-between">
                  <b> Very good campaign</b> (1 out of a 100)
                  <br />
                  {Math.round(percentiles[4]).toLocaleString()} Conversions
                </div>

                <div className="flex justify-between items-center mt-10">
                  <Link href="/game/configure">
                    <button className="mt-10 h-12 w-40 bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between">
                      <ArrowLeftCircleIcon className="h-8 w-auto" />
                      Back
                    </button>
                  </Link>
                  <Link href="/game/play">
                    <button
                      className="mt-10 h-12 w-40 bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
                      onClick={handleContinueButtonClick}
                    >
                      Continue <ArrowRightCircleIcon className="h-8 w-auto" />
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}