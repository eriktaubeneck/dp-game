"use client";

import React, { useEffect, useState } from "react";
import {
  simulatedPercentiles,
  increaseVariance,
  decreaseVariance,
} from "./simulate";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";

import AdjustVariance from "./adjustVariance";
import { ExponentialNumber } from "../exponentialNumber";
import {
  GameContainer,
  PageContainer,
  PageDescription,
  PageTitle,
} from "./components";

export default function Validate({
  conversionRate,
  variance,
  setVariance,
  campaignSize,
  setGameStateConfigure,
  setGameStateStart,
}: {
  conversionRate: number;
  variance: number;
  setVariance: (value: number) => void;
  campaignSize: ExponentialNumber;
  setGameStateConfigure: () => void;
  setGameStateStart: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [percentiles, setPercentiles] = useState<number[]>([]);
  const [loadingPercent, setLoadingPercent] = useState<number>(0);

  useEffect(() => {
    const getPercentiles = async () => {
      const rounds = 1_000_000;
      setIsLoading(true);
      const percentiles: number[] = await simulatedPercentiles(
        campaignSize.value,
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

  const handleDecreaseButtonClick = () => {
    const new_variance = decreaseVariance(conversionRate, variance);
    setVariance(new_variance);
  };

  const handleIncreaseButtonClick = () => {
    const new_variance = increaseVariance(conversionRate, variance);
    setVariance(new_variance);
  };

  return (
    <PageContainer>
      <PageTitle>Variance Validation</PageTitle>
      <PageDescription>TODO</PageDescription>
      <GameContainer>
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
              impressions={campaignSize.value}
              className=""
            />
            <AdjustVariance
              handleIncreaseButtonClick={handleIncreaseButtonClick}
              handleDecreaseButtonClick={handleDecreaseButtonClick}
              className="pt-6 space-x-4"
            />
            <hr className="h-px mt-4 mb-4 bg-gray-200 border-0" />

            <Navigation
              setGameStateConfigure={setGameStateConfigure}
              setGameStateStart={setGameStateStart}
              className="pt-6 space-x-4"
            />
          </>
        )}
      </GameContainer>
    </PageContainer>
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
  setGameStateConfigure,
  setGameStateStart,
  className,
}: {
  setGameStateConfigure: () => void;
  setGameStateStart: () => void;
  className: string;
}) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <button
          className="h-12 w-32 md:w-40 bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
          onClick={setGameStateConfigure}
        >
          <ArrowLeftCircleIcon className="h-8 w-auto" />
          Back
        </button>
        <button
          className="h-12 w-32 md:w-40 bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
          onClick={setGameStateStart}
        >
          Continue <ArrowRightCircleIcon className="h-8 w-auto" />
        </button>
      </div>
    </div>
  );
}
