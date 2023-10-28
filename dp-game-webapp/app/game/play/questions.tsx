import React, { useEffect, useState } from "react";

import {
  ArrowRightCircleIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/outline";

import { generateSimulatedConversions, laplaceNoise } from "../simulate";
import { ExponentialNumber } from "../../exponentialNumber";
import { CampaignStats } from "../campaignStats";
import { GameContainer, PageContainer } from "./components";

export enum Answer {
  IncreaseSpend,
  DecreaseSpend,
}

export interface Question {
  conversions: number;
  noise: number;
  actualResult?: Answer;
  noisedResult?: Answer;
}

export interface QuestionIndex {
  index: number;
  noised: boolean;
}

export default function QuestionsGame({
  setAnsweredQuestions,
  impressions,
  conversionRate,
  variance,
  sensitivity,
  num_questions,
  currentEpsilon,
  setGameStateFinished,
}: {
  setAnsweredQuestions: (value: Question[]) => void;
  impressions: number;
  conversionRate: number;
  variance: number;
  sensitivity: number;
  num_questions: number;
  currentEpsilon: ExponentialNumber;
  setGameStateFinished: () => void;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionOrder, setQuestionOrder] = useState<QuestionIndex[]>([]);

  const shuffleQuestionOrder = () => {
    const questionOrder: QuestionIndex[] = [];
    for (let i = 0; i < num_questions; i++) {
      questionOrder.push({ index: i, noised: false });
      questionOrder.push({ index: i, noised: true });
    }

    function shuffleArray(arr: QuestionIndex[]) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    shuffleArray(questionOrder);
    setQuestionOrder(questionOrder);
  };

  const reloadQuestions = () => {
    const simulatedConversions: Generator<number> =
      generateSimulatedConversions(
        impressions,
        conversionRate,
        variance,
        num_questions,
        undefined,
      );

    const questions: Question[] = [];

    for (const conversions of simulatedConversions) {
      const question: Question = {
        conversions: conversions,
        noise: laplaceNoise(0, sensitivity, currentEpsilon.value),
      };
      questions.push(question);
    }
    setQuestions(questions);
    shuffleQuestionOrder();
  };

  useEffect(() => {
    reloadQuestions();
  }, [currentEpsilon]);

  const handleAnswer = (answer: Answer, questionIndex: QuestionIndex) => {
    const questionsCopy = [...questions];
    const question: Question = questions[questionIndex.index];
    const updatedQuestion: Question = {
      conversions: question.conversions,
      noise: question.noise,
      actualResult: questionIndex.noised ? question.actualResult : answer,
      noisedResult: questionIndex.noised ? answer : question.noisedResult,
    };

    questionsCopy[questionIndex.index] = updatedQuestion;
    setQuestions(questionsCopy);
  };

  const handleSubmit = () => {
    setAnsweredQuestions(questions);
    setGameStateFinished();
  };

  const allAnswered: boolean = !questions.some(
    (question: Question) =>
      question.actualResult === undefined ||
      question.noisedResult === undefined,
  );

  const getQuestionConversions = (questionIndex: QuestionIndex) => {
    const question: Question = questions[questionIndex.index];
    if (questionIndex.noised) {
      return question.conversions + Math.round(question.noise);
    } else {
      return question.conversions;
    }
  };

  const getQuestionAnswer = (questionIndex: QuestionIndex) => {
    const question: Question = questions[questionIndex.index];
    if (questionIndex.noised) {
      return question.noisedResult;
    } else {
      return question.actualResult;
    }
  };

  const handleDecreaseSpend = (questionIndex: QuestionIndex) => {
    handleAnswer(Answer.DecreaseSpend, questionIndex);
  };

  const handleIncreaseSpend = (questionIndex: QuestionIndex) => {
    handleAnswer(Answer.IncreaseSpend, questionIndex);
  };

  return (
    <PageContainer>
      <GameContainer>
        <CampaignStats
          impressions={impressions}
          conversionRate={conversionRate}
          className=""
        />

        <div className="mb-6 flex-col items-center justify-between text-lg font-semibold">
          For each of these results, would you increase or decrease spend?
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Conversions
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Increase/Decrease Spend?
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questionOrder.map((questionIndex, index) => {
              const answer = getQuestionAnswer(questionIndex);
              const conversions = getQuestionConversions(questionIndex);
              return (
                <tr key={index}>
                  <td className="whitespace-nowrap text-sm text-center font-medium text-gray-900">
                    {conversions.toLocaleString()}
                  </td>
                  <td className="flex items-center justify-around mt-2 mb-2 text-gray-900">
                    <div className="flex justify-between space-x-1 lg:space-x-4">
                      <button
                        className={`h-8 lg:h-12 lg:py-2 px-1 lg:px-4 text-base text-sm lg:text-lg font-medium text-white hover:bg-cyan-700 rounded-lg flex items-center justify-between ${
                          answer === Answer.DecreaseSpend
                            ? "bg-cyan-700"
                            : "bg-cyan-400"
                        }`}
                        onClick={() => handleDecreaseSpend(questionIndex)}
                      >
                        Decrease{" "}
                        <ArrowDownCircleIcon className="h-4 lg:h-8 w-auto ml-2" />
                      </button>
                      <button
                        className={`h-8 lg:h-12 lg:py-2 px-1 lg:px-4 text-base text-sm lg:text-lg font-medium text-white hover:bg-emerald-700 rounded-lg flex items-center justify-between ${
                          answer === Answer.IncreaseSpend
                            ? "bg-emerald-700"
                            : "bg-emerald-400"
                        }`}
                        onClick={() => handleIncreaseSpend(questionIndex)}
                      >
                        Increase{" "}
                        <ArrowUpCircleIcon className="h-4 lg:h-8 w-auto ml-2" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end items-center">
          <button
            className={`mt-10 h-12 w-40 text-white font-bold py-2 px-4 rounded flex items-center justify-between ${
              allAnswered ? "bg-sky-400 hover:sky-600" : "bg-sky-200"
            }`}
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Submit <ArrowRightCircleIcon className="h-8 w-auto" />
          </button>
        </div>
      </GameContainer>
    </PageContainer>
  );
}
