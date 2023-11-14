import React, { ReactNode } from "react";

import {
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";

import { Answer, AnsweredQuestion } from "./questions";
import { ExponentialNumber } from "../exponentialNumber";
import { GameContainer, PageContainer, PageTitle } from "./components";

const answerIcons: Record<Answer, ReactNode> = {
  [Answer.DecreaseSpend]: (
    <ArrowDownCircleIcon className="h-4 md:h-8 w-auto ml-2" />
  ),
  [Answer.MaintainSpend]: (
    <MinusCircleIcon className="h-4 md:h-8 w-autho ml-2" />
  ),

  [Answer.IncreaseSpend]: (
    <ArrowUpCircleIcon className="h-4 md:h-8 w-auto ml-2" />
  ),
};

export default function Results({
  answeredQuestions,
  num_questions,
  currentEpsilon,
  nextEpsilon,
  setCurrentEpsilon,
  setGameStatePlaying,
  setGameStateConfigure,
}: {
  answeredQuestions: AnsweredQuestion[];
  num_questions: number;
  currentEpsilon: ExponentialNumber;
  nextEpsilon: ExponentialNumber;
  setCurrentEpsilon: (value: ExponentialNumber) => void;
  setGameStatePlaying: () => void;
  setGameStateConfigure: () => void;
}) {
  const numCorrect = answeredQuestions.reduce(
    (count, question) =>
      question.unnoisedAnswer === question.noisedAnswer ? count + 1 : count,
    0,
  );

  const handleNextRound = () => {
    setCurrentEpsilon(nextEpsilon);
    setGameStatePlaying();
  };

  return (
    <PageContainer>
      <PageTitle>Finished!</PageTitle>
      <GameContainer>
        <div className="text-l font-medium leading-6 text-gray-900 dark:text-white">
          Accuracy of results vs noise added ({"\u03B5"}=
          {currentEpsilon.toString()})
        </div>
        <div className="py-3 text-xl font-bold leading-6 text-gray-900 dark:text-white">
          {((100 * numCorrect) / num_questions).toFixed(0)}%
        </div>
        <h2>Results Table</h2>
        <div className="flex justify-center">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Conversions
                </th>
                <th
                  scope="col"
                  className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Decision
                </th>
                <th
                  scope="col"
                  className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Noised <br />
                  Conversions
                </th>
                <th
                  scope="col"
                  className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Decision
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-white">
              {answeredQuestions.map((item, index) => (
                <tr
                  key={index}
                  className={
                    item.unnoisedAnswer == item.noisedAnswer
                      ? "bg-emerald-50 hover:bg-emerald-200"
                      : "bg-rose-50 hover:bg-rose-200"
                  }
                >
                  <td className="px-1 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-700">
                    {item.conversions.toLocaleString()}
                  </td>
                  <td className="px-1 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-700">
                    {answerIcons[item.unnoisedAnswer]}
                  </td>
                  <td className="px-1 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-700">
                    {(
                      Math.round(item.noise) + item.conversions
                    ).toLocaleString()}
                  </td>
                  <td className="px-1 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-700">
                    {answerIcons[item.noisedAnswer]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-10 space-x-4">
          <button
            className="bg-emerald-400 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded justify-center text-center"
            onClick={setGameStateConfigure}
          >
            Start Over
          </button>
          <button
            className="bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded justify-center text-center"
            onClick={handleNextRound}
          >
            Continue to Next Level ({"\u03B5"}={nextEpsilon.toString()})
          </button>
        </div>
      </GameContainer>
    </PageContainer>
  );
}
