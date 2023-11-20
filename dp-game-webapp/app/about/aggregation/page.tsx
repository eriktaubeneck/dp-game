"use client";

import React, { ReactNode, useState } from "react";
import { AboutPageContainer, PageTitle } from "../../components";
import { Toggle } from "../components";

interface Person {
  name: string;
  has_condition: boolean;
}

export default function AboutAggregation() {
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
      <PageTitle className="mb-14">Aggregation</PageTitle>
      <h1 className="my-2 text-lg md:text-4xl font-bold tracking-tight">
        Motivating Example
      </h1>

      <p className="mt-2">
        Suppose we had access to a <b>database</b> that stores information
        potentially sensitive data about people, such as if they have a certain
        health condition. The database is operated by some trusted source such
        as a health care provider, and it only allows <b>aggregate</b> queries,
        e.g., for the purpose of tracking prevalence among the general
        population.
      </p>
      <p className="mt-2">
        Now, let's say that <b>aggregation requirement</b> enforced by the
        database results in an error if it includes less than 100 people in the
        query. For a single query, this is a pretty reasonable solution: for
        example, a query of 100 people could tell us that {countTrue} people
        have the condition. For everyone in that query, we'd uniformly learn
        they all have a {countTrue}% chance of having the condition.
      </p>
      <DataTable people={people.slice(0, -1)} total={100} countTrue={countTrue}>
        <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
          Example Query Dataset 1
        </h2>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          An example of a query of 100 rows of data with people and their health
          condition status.
        </p>
      </DataTable>

      <p className="mt-2">
        Now, suppose we wanted to figure out if another person, Tali, has this
        condition. Let's rerun the above query, but with one more person, Tali.
        For demonstration, the following toggle controls value in the database.
        Notice how the count changes exactly with her value.
      </p>

      <DataTable people={people} total={101} countTrue={countTrueWithTali}>
        <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
          Example Query Dataset 2
        </h2>
        <p className="my-2 text-sm text-gray-700 dark:text-gray-300">
          An example of a query of 101 rows of data with people and their health
          condition status.
        </p>
        <div className="mt-4 sm:ml-16 sm:mt-0 flex">
          <h1 className="text-md mr-4 leading-6 text-gray-900 dark:text-gray-100">
            Tali's status
          </h1>

          <Toggle enabled={taliHasCondition} setEnabled={setTaliHasCondition} />
        </div>
      </DataTable>

      <p className="mt-2">
        This tells us, <b>definitively</b> Tali's status with respect to the
        health condition. With just two queries, albeit carefully constructed,
        we've violated the <b>aggregation requirement</b>.
      </p>

      <p className="mt-2">
        This is called a <b>differencing attack</b>, where differential privacy
        gets its namesake. And because we were able to exactly infer Tali's
        value in the database, we would say that this querying algorithm offers
        no differential privacy, or {"\u03b5\u003D\u221e"}. More on {"\u03b5"}{" "}
        coming up.
      </p>
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
                    <Row
                      key={index}
                      index={index}
                      total={total}
                      people={people}
                      person={person}
                      showHiddenValues={showHiddenValues}
                      countTrue={countTrue}
                      ellipseRow={5}
                    />
                  ))}
                </tbody>
                <tfoot>
                  <tr key="tfoot">
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

function Row({
  index,
  total,
  people,
  person,
  showHiddenValues,
  countTrue,
  ellipseRow,
}: {
  index: number;
  total: number;
  people: Person[];
  person: Person;
  showHiddenValues: boolean;
  countTrue: number;
  ellipseRow: number;
}) {
  return (
    <>
      {index === ellipseRow && (
        <tr key="ellipse" className="even:bg-gray-50 dark:even:bg-slate-700">
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
      <tr key={index} className="even:bg-gray-50 dark:even:bg-slate-700">
        <td className="whitespace-nowrap py-2 md:py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-3">
          {index < ellipseRow ? index + 1 : total - people.length + index + 1}
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
  );
}
