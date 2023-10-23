"use client";
// @ts-nocheck

import React, { useEffect, useState } from "react";
import {
  defaultVariance,
  simulatedPercentiles,
  increaseVariance,
  decreaseVariance,
} from "../simulate";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";

import AdjustVariance from "../validate/adjustVariance";

export default function Validate() {
  const [isContinueClicked, setIsContinueClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [percentiles, setPercentiles] = useState<number[]>([]);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [conversionRate, setConversionRate] = useState<number>(0.01);
  const [campaignSizeExp, setCampaignSizeExp] = useState<number>(6);
  const [variance, setVariance] = useState<number>(10);

  useEffect(() => {
    const savedConversionRate = parseFloat(
      sessionStorage.getItem("conversionRate") || "0.01",
    );

    const savedCampaignSizeExp = parseInt(
      sessionStorage.getItem("campaignSizeExp") || "6",
    );
    const savedVariance = parseFloat(
      sessionStorage.getItem("conversionRateVariance") || "",
    );

    const savedOrDefaultVariance: number = !isNaN(savedVariance)
      ? savedVariance
      : defaultVariance(conversionRate);

    setConversionRate(savedConversionRate);
    setCampaignSizeExp(savedCampaignSizeExp);
    setVariance(savedOrDefaultVariance);
  }, []);

  const impressions: number = Math.pow(10, campaignSizeExp);

  if (isNaN(conversionRate) || isNaN(impressions)) {
    redirect("/game/configure");
  }

  useEffect(() => {
    const getPercentiles = async () => {
      // this is a bad hack so that this runs only after
      // variance is updated from the default given to useState
      if (variance < 10) {
        const rounds = 1_000_000;
        setIsLoading(true);
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
        setLoadingPercent(0);
      }
    };

    getPercentiles();
  }, [variance]);

  const handleContinueButtonClick = () => {
    setIsContinueClicked(!isContinueClicked);
  };

  const handleDecreaseButtonClick = () => {
    const new_variance = decreaseVariance(conversionRate, variance);
    setVariance(new_variance);
    sessionStorage.setItem("conversionRateVariance", new_variance.toString());
  };

  const handleIncreaseButtonClick = () => {
    const new_variance = increaseVariance(conversionRate, variance);
    setVariance(new_variance);
    sessionStorage.setItem("conversionRateVariance", new_variance.toString());
  };

  return (
    <div className="mx-auto max-w-7xl px-2 lg:px-6 py-32 sm:py-40 lg:px-8">
      <h1 className="max-w-2xl text-xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
        Variance Validation
      </h1>
      <section className="py-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[510px]">
          <div className="bg-white/60 px-2 lg:px-6 py-6 text-gray-600 shadow sm:rounded-lg sm:px-12">
            {isLoading ? (
              <div className="spinner">
                {" "}
                Loading Expected Range of Results ...
                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                    style={{
                      width: `${Math.max(5, loadingPercent).toFixed(0)}` + "%",
                    }}
                  >
                    {loadingPercent}%
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Percentiles
                  percentiles={percentiles}
                  impressions={impressions}
                  className=""
                />
                <AdjustVariance
                  handleIncreaseButtonClick={handleIncreaseButtonClick}
                  handleDecreaseButtonClick={handleDecreaseButtonClick}
                  className="pt-6 space-x-4"
                />
                <hr className="h-px mt-4 mb-4 bg-gray-200 border-0" />

                <Navigation
                  handleContinueButtonClick={handleContinueButtonClick}
                  className="pt-6 space-x-4"
                />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Percentiles({
  percentiles,
  impressions,
  className,
}: {
  percentiles: number[];
  impressions: number;
  className: string;
}) {
  return (
    <div className={className}>
      <div className="mb-6 text-xl font-semibold leading-6 text-blue-600">
        Expected Range of Results
      </div>

      <div>
        <table className="min-w-fit divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs text-center font-medium text-gray-500 uppercase tracking-wider"
              >
                Percentile
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs text-center font-medium text-gray-500 uppercase tracking-wider"
              >
                Number of Conversions
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs text-center font-medium text-gray-500 uppercase tracking-wider"
              >
                Conversion Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr key="p01">
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                <b>Very bad</b>
                <br />
                (1 out of a 100)
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                {Math.round(percentiles[0]).toLocaleString()}
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                {((percentiles[0] / impressions) * 100).toFixed(1)}%
              </td>
            </tr>
            <tr key="p10">
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                <b>Bad</b>
                <br />
                (1 out of a 10)
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                {Math.round(percentiles[1]).toLocaleString()}
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                {((percentiles[1] / impressions) * 100).toFixed(1)}%
              </td>
            </tr>
            <tr key="p50">
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                <b>Median</b>
                <br />
                (5 out of a 10)
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                {Math.round(percentiles[2]).toLocaleString()}
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                {((percentiles[2] / impressions) * 100).toFixed(1)}%
              </td>
            </tr>
            <tr key="p90">
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                <b>Good</b>
                <br />
                (1 out of a 10)
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                {Math.round(percentiles[3]).toLocaleString()}
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                {((percentiles[3] / impressions) * 100).toFixed(1)}%
              </td>
            </tr>
            <tr key="p99">
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                <b>Very good</b>
                <br />
                (1 out of a 100)
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                {Math.round(percentiles[4]).toLocaleString()}
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-600">
                {((percentiles[4] / impressions) * 100).toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Navigation({
  handleContinueButtonClick,
  className,
}: {
  handleContinueButtonClick: () => void;
  className: string;
}) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <Link href="/game/configure">
          <button className="h-12 w-32 lg:w-40 bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between">
            <ArrowLeftCircleIcon className="h-8 w-auto" />
            Back
          </button>
        </Link>
        <Link href="/game/play">
          <button
            className="h-12 w-32 lg:w-40 bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
            onClick={handleContinueButtonClick}
          >
            Continue <ArrowRightCircleIcon className="h-8 w-auto" />
          </button>
        </Link>
      </div>
    </div>
  );
}
