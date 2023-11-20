"use client";

import React, { ReactNode, useState } from "react";
import { AboutPageContainer, PageTitle } from "../components";
import { LaplacePlot } from "../plots";
import { ExponentialNumber } from "../exponentialNumber";
import { Switch } from "@headlessui/react";
var cdf = require("@stdlib/stats-base-dists-laplace-cdf");

interface Person {
  name: string;
  has_condition: boolean;
}

export default function About() {
  const [scale, setScale] = useState<ExponentialNumber>(
    // variance = 2b^2 , 1.189... = 2^(-1/4) so that b=(1.189^-2) -> variance=1
    new ExponentialNumber(-2, 1.189207115),
  );
  const [taliHasCondition, setTaliHasCondition] = useState<boolean>(true);
  const countTrue = 7;
  const countTrueWithTali = taliHasCondition ? countTrue + 1 : countTrue;

  const people: Person[] = [
    { name: "Garrus", has_condition: false },
    { name: "Liara", has_condition: false },
    { name: "Mordin", has_condition: false },
    { name: "Anderson", has_condition: false },
    { name: "Bailey", has_condition: true },
    { name: "Jack", has_condition: false },
    { name: "Tali", has_condition: taliHasCondition },
  ];

  return (
    <AboutPageContainer>
      <PageTitle>Learn more about the Differential Privacy Game.</PageTitle>
      <div className="mt-10">
        <p className="mt-2">
          This is a game designed to better understand the effect of
          differential privacy on ads measurement. The{" "}
          <a href="https://www.w3.org/community/patcg/" className="underline">
            <i>Private Ads Technology Community Group</i> (PATCG)
          </a>{" "}
          in the World Wide Web Consortium (W3C) is actively working on a new
          web standard for <i>private ads measurement</i> that can enable
          aggregate measurement of ad effectiveness based on cross site activity
          while preventing user tracking.
        </p>
        <p className="mt-2">
          There is{" "}
          <a
            href="https://github.com/patcg/docs-and-reports/blob/main/design-dimensions/Dimensions-with-General-Agreement.md#privacy-defined-at-least-by-differential-privacy"
            className="underline"
          >
            initial consensus in that group that differential privacy
          </a>{" "}
          will be part of the solution, and this effort attempts to better
          understand the effect of that noise on the utility of ads measurement.
        </p>

        <h1 className="my-2 text-lg md:text-4xl font-bold tracking-tight">
          Differential Privacy
        </h1>
        <p className="mt-2">
          We often think of privacy as a <i>binary</i> attribute: either a
          system is private or it is not. Contrary to this idea, differential
          privacy does not tell us if a system is private or not.
        </p>
        <p className="mt-2">
          Instead, it's <b>measure of a system</b> that tells us how much
          information is revealed about individual data points within that
          system.
        </p>
        <p className="mt-2">
          If you interested in the mathematical details,{" "}
          <a
            href="https://en.wikipedia.org/wiki/Differential_privacy#Definition_of_%CE%B5-differential_privacy"
            className="underline"
          >
            check out Wikipedia
          </a>
          . Here, we'll instead motivate with an example.
        </p>

        <h1 className="my-2 text-lg md:text-4xl font-bold tracking-tight">
          Motivating Example
        </h1>

        <p className="mt-2">
          Suppose we had access to a <b>database</b> that stores information
          potentially sensitive data about people, such as if they have a
          certain health condition. The database is operated by some trusted
          source such as a health care provider, and it only allows{" "}
          <b>aggregate</b> queries, e.g., for the purpose of tracking prevalence
          among the general population.
        </p>
        <p className="mt-2">
          Now, let's say that <b>aggregation requirement</b> enforced by the
          database results in an error if it includes less than 100 people in
          the query. For a single query, this is a pretty reasonable solution:
          for example, a query of 100 people could tell us that {countTrue}{" "}
          people have the condition. For everyone in that query, we'd uniformly
          learn they all have a {countTrue}% chance of having the condition.
        </p>
        <DataTable
          people={people.slice(0, -1)}
          total={100}
          countTrue={countTrue}
        >
          <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
            Example Query Dataset 1
          </h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            An example of a query of 100 rows of data with people and their
            health condition status.
          </p>
        </DataTable>

        <p className="mt-2">
          Now, suppose we wanted to figure out if another person, Tali, has this
          condition. Let's rerun the above query, but with one more person,
          Tali. For demonstration, the following toggle controls value in the
          database. Notice how the count changes exactly with her value.
        </p>

        <DataTable people={people} total={101} countTrue={countTrueWithTali}>
          <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
            Example Query Dataset 2
          </h2>
          <p className="my-2 text-sm text-gray-700 dark:text-gray-300">
            An example of a query of 101 rows of data with people and their
            health condition status.
          </p>
          <div className="mt-4 sm:ml-16 sm:mt-0 flex">
            <h1 className="text-md mr-4 leading-6 text-gray-900 dark:text-gray-100">
              Tali's status
            </h1>

            <Toggle
              enabled={taliHasCondition}
              setEnabled={setTaliHasCondition}
            />
          </div>
        </DataTable>

        <p className="mt-2">
          This tells us, <b>definitively</b> Tali's status with respect to the
          health condition. With just two queries, albeit carefully constructed,
          we've violated the <b>aggregation requirement</b>.
        </p>

        <p className="mt-2">
          This is called a <b>differencing attack</b>, where differential
          privacy gets its namesake. And because we were able to exactly infer
          Tali's value in the database, we would say that this querying
          algorithm offers no differential privacy, or {"\u03b5\u003D\u221e"}.
        </p>

        <h1 className="my-2 text-lg md:text-4xl font-bold tracking-tight">
          Adding Noise
        </h1>

        <p className="mt-2">
          If we want to make this function differentially private, e.g., with a
          finite {"\u03b5"}, one way is to add noise to the count, sampled from
          a{" "}
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
          assume that if we see a value less than {countTrue}.5, the true value
          is {countTrue}, and if we see a value greater than {countTrue}.5, the
          true value is {countTrue + 1}. But because this noise is random, this
          rule will be wrong sometimes.
        </p>

        <div className="px-4 sm:px-6 lg:px-8 my-6 py-4 bg-slate-200 dark:bg-slate-700 rounded-md shadow-lg">
          <div className="mt-4 sm:mt-0 flex">
            <h1 className="text-md mr-4 leading-6 text-gray-900 dark:text-gray-100">
              Tali's status
            </h1>

            <Toggle
              enabled={taliHasCondition}
              setEnabled={setTaliHasCondition}
            />
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
              {(
                1 - cdf(countTrue + 0.5, countTrueWithTali, scale.value)
              ).toFixed(3)}
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
          This is the core nature of differential privacy being a measure and
          not a binary attribute. There is no magic {"\u03b5"} where things
          become private. (Except, one may argue, at {"\u03b5=0"}, which is
          purely random noise. Such a system is certainly private, but it also
          would provide no utility in an scenario.)
        </p>
      </div>
    </AboutPageContainer>
  );
}

function DataTable({
  people,
  total,
  countTrue,
  children,
}: {
  people: Person[];
  total: number;
  countTrue: number;
  children: ReactNode;
}) {
  const [showHiddenValues, setShowHiddenValues] = useState<boolean>(false);

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 my-6 py-4 bg-slate-200 dark:bg-slate-700 rounded-md shadow-lg">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">{children}</div>
          <div className="mt-4 sm:ml-16 sm:mt-0 flex">
            <h1 className="text-md mr-4 leading-6 text-gray-900 dark:text-gray-100">
              Show hidden values
            </h1>
            <Toggle
              enabled={showHiddenValues}
              setEnabled={setShowHiddenValues}
            />
          </div>
        </div>
        <div className="mt-2 md:mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-[80%] divide-y divide-gray-300 dark:divide-gray-400 shadow-lg">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr key="thead">
                    <th
                      scope="col"
                      className="py-2 md:py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-3"
                    ></th>
                    <th
                      scope="col"
                      className="py-2 md:py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-3"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="py-2 md:py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-3"
                    >
                      Has health condition?
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-2 md:py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Inferred Odds of Condition
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-600">
                  {people.map((person, index) => (
                    <>
                      {index === 5 && (
                        <tr
                          key="ellipse"
                          className="even:bg-gray-50 dark:even:bg-slate-700"
                        >
                          <td className="whitespace-nowrap py-2 md:py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-3">
                            ...
                          </td>
                          <td className="whitespace-nowrap py-2 md:py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-3">
                            ...
                          </td>
                          <td className="whitespace-nowrap py-2 md:py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-3">
                            ...
                          </td>
                          <td className="whitespace-nowrap py-2 md:py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-3">
                            ...
                          </td>
                        </tr>
                      )}

                      <tr
                        key={index}
                        className="even:bg-gray-50 dark:even:bg-slate-700"
                      >
                        <td className="whitespace-nowrap py-2 md:py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-3">
                          {index < 5
                            ? index + 1
                            : total - people.length + index + 1}
                        </td>
                        <td className="whitespace-nowrap py-2 md:py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-3">
                          {person.name}
                        </td>
                        <td className="whitespace-nowrap py-2 md:py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-3">
                          {showHiddenValues
                            ? person.has_condition
                              ? "yes"
                              : "no"
                            : "\u2588\u2588\u2588"}
                        </td>
                        <td className="whitespace-nowrap py-2 md:py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-3">
                          {((countTrue / total) * 100).toPrecision(2)}%
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td scope="row" className=""></td>
                    <td
                      scope="row"
                      className="pl-3 py-2 md:py-4 text-lg font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Count
                    </td>
                    <td className="pl-3 pr-4 py-2 md:py-4 text-lg font-semibold text-gray-900 dark:text-gray-200">
                      {countTrue}
                    </td>

                    <td scope="row" className=""></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
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

function Toggle({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}) {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
        ${enabled ? "bg-indigo-600" : "bg-gray-200"}`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </Switch>
  );
}
