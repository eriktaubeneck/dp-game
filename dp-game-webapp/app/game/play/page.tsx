"use client";

import React, { useEffect, useState } from "react";
import { adjustedVariance, simulatedPercentiles } from "../simulate";

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export default function Play() {
  const MAX_COUNT = 1_000_000;
  const NUM_QUESTIONS = 10;

  const [percentiles, setPercentiles] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<any[]>([]);

  const addItem = (item: any) => {
    // Use the spread operator to create a new array with the added item
    setData((prevArray) => [...prevArray, item]);
  };


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

  const variance: number = !isNaN(savedVariance)
    ? savedVariance
    : adjustedVariance(conversionRate);

  const preloadInputs = () => {
    let mixedArray = [];

    for (let i = 0; i < NUM_QUESTIONS; i++) {
      let percentile = Math.floor(Math.random() * MAX_COUNT);
      let value = percentiles[percentile];
      mixedArray = [...mixedArray, { "p": percentile, "v": value }];
    }

    let noised_array = mixedArray;
    //TODO: add dp to noised_array

    // merge them
    for (let row in mixedArray) {
      addItem({ "p": row.percentile, "v": row.value, "n": false });
    }

    for (let row in noised_array) {
      addItem({ "p": row.percentile, "v": row.value, "n": true });
    }

    //shuffle items
    shuffleArray(data);
    console.log("Data is as follows", data);
  }

useEffect(() => {
  const getPercentilesAndPreLoad = () => {
    const percentiles: number[] = simulatedPercentiles(
      impressions,
      conversionRate,
      variance,
      MAX_COUNT,
    );
    setPercentiles(percentiles);
    setIsLoading(false);
    preloadInputs();
  };

  getPercentilesAndPreLoad();
}, []);

const handleDecreaseSpend = () => {
  // setNextValue();
};

const handleIncreaseSpend = () => {
  // setNextValue();
};

return (

  <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
    <h1 className="max-w-2xl text-xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
      <div className="max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        {isLoading ? (
          <div className="spinner"> Loading...</div>
        ) : (<>
          <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-500 dark:text-white">With these many conversions, would you increase spend or decrease spend?</h5>
          <p className="mb-2 text-5xl text-grey-700 dark:text-grey-400 justify-end text-center dark:text-white">{Math.floor(percentiles[4])}</p>
          <div className="flex mt-5 justify-between space-x-3 md:mt-6">
            <button className="px-3 py-2 text-base font-medium text-white bg-red-700 rounded-lg onClick={handleDecreaseSpend}">
              Decrease Spend
            </button>
            <button className="px-3 py-2 text-base font-medium text-white bg-green-700 rounded-lg onClick={handleIncreaseSpend}">
              Increase Spend
            </button>
          </div>
        </>)}
      </div>
    </h1>
  </div>
);
}
