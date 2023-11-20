"use client";

import React, { useState } from "react";
import { LaplacePlot } from "../../plots";
import { AboutPageContainer, PageTitle } from "../../components";
import { ExponentialNumber } from "../../exponentialNumber";
import { Toggle } from "../components";
import Link from "next/link";
var cdf = require("@stdlib/stats-base-dists-laplace-cdf");

export default function AboutAggregation() {
  const [scale, setScale] = useState<ExponentialNumber>(
    // variance = 2b^2 , 1.189... = 2^(-1/4) so that b=(1.189^-2) -> variance=1
    new ExponentialNumber(-2, 1.189207115),
  );
  const [taliHasCondition, setTaliHasCondition] = useState<boolean>(true);
  const countTrue = 7;
  const countTrueWithTali = taliHasCondition ? countTrue + 1 : countTrue;

  return (
    <AboutPageContainer>
      <PageTitle className="mb-14">Adding Noise</PageTitle>

      <p className="mt-2">
        We just saw how{" "}
        <Link href="/about/aggregation">aggregation can fail</Link>, so let's
        now talk about how we can fix it. We considered a database which only
        allows aggregations of 100 or more items, and our output was the count
        of people with a certain health condition. By constructing two queries,
        one with Tali and one without, we we're able to observer her value
        exactly and violate our goal of aggregation.
      </p>

      <p className="mt-2">
        Now, let's make this process differentially private! The most common way
        to accomplish this is to add noise to the count, sampled from a{" "}
        <a
          href="https://en.wikipedia.org/wiki/Laplace_distribution"
          className="underline"
        >
          Laplace distribution
        </a>
        . The plot below shows the probability distribution of the count with
        noise added. For an actual query, we'd get a random value sampled from
        this distribution.
      </p>

      <p className="mt-2">
        In our example, we're trying to differential between a count of{" "}
        {countTrue} and {countTrue + 1}. A simple rule for this would be to
        assume that if we see a value less than {countTrue}.5, the true value is{" "}
        {countTrue}, and if we see a value greater than {countTrue}.5, the true
        value is {countTrue + 1}. But because this noise is random, this rule
        will be wrong sometimes.
      </p>

      <div className="px-4 sm:px-6 lg:px-8 my-6 py-4 bg-slate-200 dark:bg-slate-700 rounded-md shadow-lg">
        <div className="mt-4 sm:mt-0 flex">
          <h1 className="text-md mr-4 leading-6 text-gray-900 dark:text-gray-100">
            Tali's status
          </h1>

          <Toggle enabled={taliHasCondition} setEnabled={setTaliHasCondition} />
        </div>

        <LaplacePlot
          mean={countTrueWithTali}
          scale={scale.value}
          className="md:hidden w-full aspect-[3/1] mt-4 bg-slate-100 dark:bg-slate-900 rounded-lg"
          lowerXBound={-2}
          upperXBound={18}
          width={300}
          height={100}
        />

        <LaplacePlot
          mean={countTrueWithTali}
          scale={scale.value}
          className="hidden md:flex w-full aspect-[3/1] mt-4 bg-slate-100 dark:bg-slate-900 rounded-lg"
          lowerXBound={-2}
          upperXBound={18}
          width={600}
          height={200}
        />

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            Laplace Variance: {(2 * scale.value * scale.value).toFixed(3)}
          </div>
          <div>
            {"\u03b5"}: {(1 / scale.value).toFixed(3)}
          </div>
        </div>
        <ScaleSlider scale={scale} onChange={setScale} />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            Probability(Count {"<"} {countTrue}.5) ={" "}
            {cdf(countTrue + 0.5, countTrueWithTali, scale.value).toFixed(3)}
          </div>
          <div>
            Probability(Count {">"} {countTrue}.5) ={" "}
            {(1 - cdf(countTrue + 0.5, countTrueWithTali, scale.value)).toFixed(
              3,
            )}
          </div>
        </div>
      </div>
      <p className="mt-2">
        Playing around with this tool, you'll noice as the variance decreases
        (and {"\u03b5"} increases), the probabily of making the correct
        inference converges towards 1. Similarly, as variance increases (and{" "}
        {"\u03b5"} decreases), that probability converges towards 0.5, e.g.,
        random chance.
      </p>
      <p className="mt-2">
        This is the core nature of differential privacy being a measure and not
        a binary attribute. There is no magic {"\u03b5"} where things become
        private. (Except, one may argue, at {"\u03b5=0"}, which is purely random
        noise. Such a system is certainly private, but it also would provide no
        utility in an scenario.)
      </p>
    </AboutPageContainer>
  );
}

function ScaleSlider({
  scale,
  onChange,
}: {
  scale: ExponentialNumber;
  onChange: (value: ExponentialNumber) => void;
}) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const newScale = new ExponentialNumber(val, scale.base);
    onChange(newScale);
  };

  return (
    <input
      type="range"
      min="-20"
      max="30"
      value={scale.exponent}
      onChange={handleSliderChange}
      className="w-full"
    />
  );
}
