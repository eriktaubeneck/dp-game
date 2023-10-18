import React from "react";
import Link from "next/link";

export default function Example() {
  return (
    <>
      <div className="lg:flex lg:flex-1 lg:justify-center max-w-10xl px-6 py-12 lg:py-20 lg:px-8 lg:space-x-8">
        <h1 className="max-w-xl text-xl font-bold tracking-tight text-gray-900 lg:text-6xl lg:col-span-2 xl:col-auto">
          Welcome to the Differential Privacy Game!
        </h1>
        <br />
        <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
          <p className="text-lg leading-8 text-gray-600">
            This game is designed to demonstrate the effect of decision making
            for advertising professionals with differentially private results.
            After some initial configuration, you'll be prompted with simulated
            campaign results. The game will challange your ability to make the
            same decisions with and without DP.
          </p>
        </div>
      </div>
      <div className="flex flex-1 justify-center">
        <Link
          href="/game"
          className="text-2xl font-semibold leading-6 text-blue-600"
        >
          Let's Play! <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </>
  );
}
