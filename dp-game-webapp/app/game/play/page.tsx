"use client";

// @ts-nocheck

import React, { useEffect, useState } from "react";
import { generateSimulatedConversions, laplaceNoise } from "../simulate";
import { ExponentialNumber } from "../../exponentialNumber";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/outline";

import { CampaignStats } from "../campaignStats";

import Link from "next/link";
import { redirect } from "next/navigation";

enum GameState {
  Start,
  Playing,
  Finished,
}

enum Answer {
  IncreaseSpend,
  DecreaseSpend,
}

interface Question {
  conversions: number;
  noise: number;
  actualResult?: Answer;
  noisedResult?: Answer;
}

interface QuestionIndex {
  index: number;
  noised: boolean;
}

export default function Play() {
  const NUM_QUESTIONS = 5;
  const SENSITIVITY = 1;
  const STARTING_EPSILON_POWER_OF_TEN = 0;

  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [conversionRate, setConversionRate] = useState<number>(0.01);
  const [campaignSizeExp, setCampaignSizeExp] = useState<number>(6);
  const [variance, setVariance] = useState<number>(0.00001);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionOrder, setQuestionOrder] = useState<QuestionIndex[]>([]);
  const [currentEpsilon, setCurrentEpsilon] = useState<ExponentialNumber>(
    new ExponentialNumber(STARTING_EPSILON_POWER_OF_TEN, 10),
  );

  const nextEpsilon = new ExponentialNumber(
    currentEpsilon.exponent - 1,
    currentEpsilon.base,
  );

  useEffect(() => {
    const savedConversionRate = parseFloat(
      sessionStorage.getItem("conversionRate") || "0.01",
    );

    const savedCampaignSizeExp = parseInt(
      sessionStorage.getItem("campaignSizeExp") || "6",
    );
    const savedVariance = parseFloat(
      sessionStorage.getItem("conversionRateVariance") || "",
    );

    setConversionRate(savedConversionRate);
    setCampaignSizeExp(savedCampaignSizeExp);
    setVariance(savedVariance);
  }, []);

  // redirect in case where values aren't saved (perhaps by directly navigating)
  if (Number.isNaN(conversionRate) || Number.isNaN(campaignSizeExp)) {
    redirect("/game/configure");
  } else if (Number.isNaN(variance)) {
    redirect("/game/validate");
  }

  const impressions: number = Math.pow(10, campaignSizeExp);
  const totalConversions: number = impressions * conversionRate;
  const conversionsPerThousand: number = 1000 * conversionRate;

  const shuffleQuestionOrder = () => {
    const questionOrder: QuestionIndex[] = [];
    for (let i = 0; i < NUM_QUESTIONS; i++) {
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
        NUM_QUESTIONS,
        undefined,
      );

    const questions: Question[] = [];

    for (const conversions of simulatedConversions) {
      const question: Question = {
        conversions: conversions,
        noise: laplaceNoise(0, SENSITIVITY, currentEpsilon.value),
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

  const setGameStatePlaying = () => {
    setGameState(GameState.Playing);
  };

  const handleSubmit = () => {
    setGameState(GameState.Finished);
  };

  const handleNextRound = () => {
    setCurrentEpsilon(nextEpsilon);
    setGameState(GameState.Playing);
  };

  return (
    <div className="mx-auto max-w-7xl px-2 lg:px-6 py-32 sm:py-40 lg:px-8">
      <section className="">
        <div className="sm:mx-auto sm:w-full sm:max-w-[510px]">
          <div className="max-w-full px-2 lg:px-6 py-6 bg-white/60 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            {(() => {
              switch (gameState) {
                case GameState.Start:
                  return (
                    <StartGame
                      impressions={impressions}
                      totalConversions={totalConversions}
                      conversionsPerThousand={conversionsPerThousand}
                      onChange={setGameStatePlaying}
                    />
                  );
                case GameState.Playing:
                  return (
                    <>
                      <CampaignStats
                        impressions={impressions}
                        totalConversions={totalConversions}
                        conversionsPerThousand={conversionsPerThousand}
                        className=""
                      />

                      <QuestionsGame
                        questions={questions}
                        questionOrder={questionOrder}
                        handleAnswer={handleAnswer}
                        handleSubmit={handleSubmit}
                      />
                    </>
                  );
                case GameState.Finished:
                  return (
                    <EndGame
                      questions={questions}
                      num_questions={NUM_QUESTIONS}
                      currentEpsilon={currentEpsilon}
                      nextEpsilon={nextEpsilon}
                      handleNextRound={handleNextRound}
                    />
                  );
              }
            })()}
          </div>
        </div>
      </section>
    </div>
  );
}

function StartGame({
  impressions,
  totalConversions,
  conversionsPerThousand,
  onChange,
}: {
  impressions: number;
  totalConversions: number;
  conversionsPerThousand: number;
  onChange: () => void;
}) {
  return (
    <>
      <h1 className="max-w-2xl py-3 text-xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto dark:text-white">
        Get ready!
      </h1>

      <p className="text-lg leading-8 text-gray-600 dark:text-white">
        Before starting the game, we need to configure it to your typical usage.
        As a reminder, below is your current configuration.
      </p>

      <CampaignStats
        impressions={impressions}
        totalConversions={totalConversions}
        conversionsPerThousand={conversionsPerThousand}
        className="mt-6"
      />

      <div className="flex justify-between items-center mt-10 space-x-4">
        <Link href="/game/validate">
          <button className="mt-10 h-12 w-32 lg:w-40 bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between">
            <ArrowLeftCircleIcon className="h-8 w-auto" />
            Back
          </button>
        </Link>

        <button
          className="mt-10 h-12 w-32 lg:w-40 bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
          onClick={onChange}
        >
          Start <ArrowRightCircleIcon className="h-8 w-auto" />
        </button>
      </div>
    </>
  );
}

function QuestionsGame({
  questions,
  questionOrder,
  handleAnswer,
  handleSubmit,
}: {
  questions: Question[];
  questionOrder: QuestionIndex[];
  handleAnswer: any;
  handleSubmit: any;
}) {
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
    <>
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
                      className={`h-8 lg:h-12 lg:py-2 px-1 lg:px-4 text-base text-sm lg:text-lg font-medium text-white hover:bg-cyan-700 rounded-lg flex items-center justify-between ${
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
    </>
  );
}

function EndGame({
  questions,
  num_questions,
  currentEpsilon,
  nextEpsilon,
  handleNextRound,
}: {
  questions: Question[];
  num_questions: number;
  currentEpsilon: ExponentialNumber;
  nextEpsilon: ExponentialNumber;
  handleNextRound: any;
}) {
  const numCorrect = questions.reduce(
    (count, question) =>
      question.actualResult === question.noisedResult ? count + 1 : count,
    0,
  );

  return (
    <>
      <div className="justify-center text-center py-3">
        <div className="text-xl font-semibold leading-6 text-blue-600">
          Finished!
        </div>
        <div className="text-l font-medium leading-6 text-gray-900 dark:text-white">
          Accuracy of results vs noise added ({"\u03B5"}=
          {currentEpsilon.toString()})
        </div>
        <div className="py-3 text-xl font-bold leading-6 text-gray-900 dark:text-white">
          {((100 * numCorrect) / num_questions).toFixed(0)}%
        </div>
        <h2>Results Table</h2>
        <div className="flex justify-center">
          <table className="min-w-fit divide-y divide-gray-200">
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
              {questions.map((item, index) => (
                <tr
                  key={index}
                  className={
                    item.actualResult == item.noisedResult
                      ? "bg-emerald-50 hover:bg-emerald-200"
                      : "bg-rose-50 hover:bg-rose-200"
                  }
                >
                  <td className="px-1 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    {item.conversions.toLocaleString()}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    {item.actualResult ? (
                      <ArrowDownCircleIcon className="h-8 w-auto" />
                    ) : (
                      <ArrowUpCircleIcon className="h-8 w-auto" />
                    )}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    {(
                      Math.round(item.noise) + item.conversions
                    ).toLocaleString()}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    {item.noisedResult ? (
                      <ArrowDownCircleIcon className="h-8 w-auto" />
                    ) : (
                      <ArrowUpCircleIcon className="h-8 w-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-10 space-x-4">
          <Link href="/game/configure">
            <button className="bg-emerald-400 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded justify-center text-center">
              Start Over
            </button>
          </Link>
          <button
            className="bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded justify-center text-center"
            onClick={handleNextRound}
          >
            Continue to Next Level ({"\u03B5"}={nextEpsilon.toString()})
          </button>
        </div>
      </div>
    </>
  );
}
