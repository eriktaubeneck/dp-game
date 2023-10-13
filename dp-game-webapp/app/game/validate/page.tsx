"use client";
import React, { useEffect, useState } from "react";
import { defaultVariance, simulatedPercentiles } from "../simulate";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/outline";

export default function Validate() {
  const [isContinueClicked, setIsContinueClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [percentiles, setPercentiles] = useState<number[]>([]);
  const [loadingPercent, setLoadingPercent] = useState(0);

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

  if (isNaN(conversionRate) || isNaN(impressions)) {
    redirect("/game/configure");
  }

  const default_variance: number = !isNaN(savedVariance)
    ? savedVariance
    : defaultVariance(conversionRate);

  const [variance, setVariance] = useState<number>(default_variance);

  useEffect(() => {
    const getPercentiles = async () => {
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
    };

    getPercentiles();
  }, [variance]);

  const handleContinueButtonClick = () => {
    setIsContinueClicked(!isContinueClicked);
  };

  const handleDecreaseButtonClick = () => {
    const new_variance = variance / 2;
    setVariance(new_variance);
    sessionStorage.setItem("conversionRateVariance", new_variance.toString());
  };

  const handleIncreaseButtonClick = () => {
    const new_variance = variance * 2;
    setVariance(new_variance);
    sessionStorage.setItem("conversionRateVariance", new_variance.toString());
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
      <h1 className="max-w-2xl text-xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
        Variance Validation
      </h1>
      <section className="py-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[510px]">
          <div className="bg-white/60 px-6 py-6 text-gray-600 shadow sm:rounded-lg sm:px-12">
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
                    {" "}
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
                  className=""
                />
                <hr className="h-px mt-4 mb-4 bg-gray-200 border-0 dark:bg-gray-700" />

                <Navigation
                  handleContinueButtonClick={handleContinueButtonClick}
                  className="mt-6"
                />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Percentiles({ percentiles, impressions, className }) {
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
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Percentile
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Num Conversions
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Conversion Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr key="p01">
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                <b> Very bad campaign</b>
                <br />
                (1 out of a 100)
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                {Math.round(percentiles[0]).toLocaleString()}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                {(percentiles[0] / impressions).toFixed(3)}
              </td>
            </tr>
            <tr key="p10">
              {" "}
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                <b> Bad campaign</b>
                <br />
                (1 out of a 10)
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                {Math.round(percentiles[1]).toLocaleString()}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                {(percentiles[1] / impressions).toFixed(3)}
              </td>
            </tr>
            <tr key="p50">
              {" "}
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                <b> Median campaign</b>
                <br />
                (5 out of a 10)
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                {Math.round(percentiles[2]).toLocaleString()}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                {(percentiles[2] / impressions).toFixed(3)}
              </td>
            </tr>
            <tr key="p90">
              {" "}
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                <b> Good campaign</b>
                <br />
                (1 out of a 10)
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                {Math.round(percentiles[3]).toLocaleString()}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                {(percentiles[3] / impressions).toFixed(3)}
              </td>
            </tr>
            <tr key="p99">
              {" "}
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                <b> Very good campaign</b>
                <br />
                (1 out of a 100)
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                {Math.round(percentiles[4]).toLocaleString()}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                {(percentiles[4] / impressions).toFixed(3)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Navigation({ handleContinueButtonClick, className }) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <Link href="/game/configure">
          <button className="h-12 w-40 bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between">
            <ArrowLeftCircleIcon className="h-8 w-auto" />
            Back
          </button>
        </Link>
        <Link href="/game/play">
          <button
            className="h-12 w-40 bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
            onClick={handleContinueButtonClick}
          >
            Continue <ArrowRightCircleIcon className="h-8 w-auto" />
          </button>
        </Link>
      </div>
    </div>
  );
}

function AdjustVariance({
  handleIncreaseButtonClick,
  handleDecreaseButtonClick,
  className,
}) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <button
          className="h-12 w-40 bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
          onClick={handleDecreaseButtonClick}
        >
          <ArrowDownCircleIcon className="h-8 w-auto" />
          Decrease Variance
        </button>
        <button
          className="h-12 w-40 bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
          onClick={handleIncreaseButtonClick}
        >
          <ArrowUpCircleIcon className="h-8 w-auto" />
          Increase Variance
        </button>
      </div>
    </div>
  );
}
