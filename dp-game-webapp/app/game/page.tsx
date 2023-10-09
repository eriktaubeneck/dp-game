"use client";
import Link from 'next/link';
import React, { useState } from 'react';


export default function Game() {
  const [inputValue, setInputValue] = useState('');
  const [conversionRate, setConversionRate] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value; // Get the text from the input's value
    setInputValue(text); // Update the state with the text
  };

  const handleConversionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value; // Get the text from the input's value
    setConversionRate(text); // Update the state with the text
  };

  return (
    <div className="bg-white">
      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate -z-10 overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
          <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
            <h1 className="max-w-2xl text-xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
              How to play?
            </h1>
            <br />
            <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
              <p className="text-lg leading-8 text-gray-600">
                In the first step, we will ask about your number of impression counts and average conversion rate.
                We would model your data on the Criteo dataset to see if it fits your use-case.
              </p>
            </div>
            <h2>
              <br />
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1 text-gray-900">
                Number of impressions &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input
                    type="text"
                    placeholder=""
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                </div>
                <br /><br />
                <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1 text-gray-900">Average Conversion Rate expected &nbsp;
                  <input
                    type="text"
                    placeholder=""
                    value={conversionRate}
                    onChange={handleConversionRateChange}
                  />
                </div>
                <br /><br /><br />
                <Link className="max-w-xs text-gray-900" href="/">Back to home</Link>
            </h2>
          </div>
        </div>
      </main>
    </div>
  )
}