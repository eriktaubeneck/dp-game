"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import Slider from '../components/slider/slider';


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

  const [isClicked, setIsClicked] = useState(false);

  const handleButtonClick = () => {
    setIsClicked(!isClicked);
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
            <section className="bg-gray-100 py-8">
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <p className="text-lg leading-8 text-gray-600">
                  In the first step, we will ask about your number of impression counts and average conversion rate.
                  We would model your data on the Criteo dataset to see if it fits your use-case.
                </p>
              </div>
              <br />
              <div className="flex">
                <div className="w-1/2 flex-none p-4 text-gray-900">
                  <p>Number of impressions</p>
                </div>
                <div className="flex-1 bg-gray-900 p-4">
                <Slider />
                </div>
              </div>
              <div className="flex" >
                <div className="w-1/2 flex-none p-4 bg-gray-900">
                  <p>Average Conversion Rate expected</p>
                </div>
                <div className="flex-1 text-gray-900 p-4">
                <input
                  type="text"
                  placeholder=""
                  value={conversionRate}
                  onChange={handleConversionRateChange}
                /></div>
              </div>
            </section>
            <section className="bg-white py-8 lg:justify-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleButtonClick}>Show possible conversions</button>
              <br /><br /><br />
            </section>
            <Link className="max-w-xs text-gray-900" href="/">Back to home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}