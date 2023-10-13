"use client";

import React, { useEffect, useState } from "react";
import {
  adjustedVariance,
  generateSimulatedConversions,
  laplaceNoise,
} from "../simulate";
import Link from "next/link";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import { CampaignStats } from "../campaignStats";

export default function Play() {
  const NUM_QUESTIONS = 10;
  const SENSITIVITY = 1;
  const EPSILON = 1;

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
    noised: bool;
  }

  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionOrder, setQuestionOrder] = useState<QuestionIndex[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

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
  const totalConversions: number = impressions * conversionRate;
  const conversionPerThousand: number = 1000 * conversionRate;

  const variance: number = !isNaN(savedVariance)
    ? savedVariance
    : adjustedVariance(conversionRate);

  useEffect(() => {
    const getConversionsAndPreLoad = () => {
      const simulatedConversions: Generator<number> =
        generateSimulatedConversions(
          impressions,
          conversionRate,
          variance,
          NUM_QUESTIONS,
        );

      const questions: Question[] = [];

      for (const conversions of simulatedConversions) {
        const question: Question = {
          conversions: conversions,
          noise: laplaceNoise(0, SENSITIVITY, EPSILON),
        };
        questions.push(question);
      }
      setQuestions(questions);
    };

    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    const shuffleQuestionOrder = () => {
      const questionOrder: QuestionIndex[] = [];
      for (let i = 0; i < NUM_QUESTIONS; i++) {
        questionOrder.push({ index: i, noised: false });
        questionOrder.push({ index: i, noised: true });
      }
      shuffleArray(questionOrder);
      setQuestionOrder(questionOrder);
    };

    getConversionsAndPreLoad();
    shuffleQuestionOrder();
  }, []);

  const getCurrentQuestion = () => {
    const questionIndex: QuestionIndex = questionOrder[currentQuestionIndex];
    const question: Question = questions[questionIndex.index];
    if (!questionIndex.noised) {
      return question.conversions;
    } else {
      return question.conversions + Math.round(question.noise);
    }
  };

  const numCorrect = questions.reduce(
    (count, question) =>
      question.actualResult === question.noisedResult ? count + 1 : count,
    0,
  );

  const incrementQuestion = () => {
    if (currentQuestionIndex < NUM_QUESTIONS * 2 - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleAnswer = (answer: Answer) => {
    const questionsCopy = [...questions];
    const questionIndex: QuestionIndex = questionOrder[currentQuestionIndex];
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

  const handleDecreaseSpend = () => {
    handleAnswer(Answer.DecreaseSpend);
    incrementQuestion();
  };

  const handleIncreaseSpend = () => {
    handleAnswer(Answer.IncreaseSpend);
    incrementQuestion();
  };

  const handleStartButtonClick = () => {
    setIsStarted(true);
  };
  return (
    <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
      <section className="py-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[510px]">
          <div className="max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            {!isFinished ? (
              <>
                {!isStarted ? (
                  <>
                    <h1 className="max-w-2xl text-xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
                      Get ready!
                    </h1>

                    <p className="text-lg leading-8 text-gray-600">
                      Before starting the game, we need to configure it to your
                      typical usage. As a reminder, below is your current
                      configuration.
                    </p>

                    <CampaignStats
                      impressions={impressions}
                      totalConversions={totalConversions}
                      conversionsPerThousand={conversionPerThousand}
                      className="mt-6"
                    />

                    <div className="flex justify-between items-center mt-10">
                      <Link href="/game/validate">
                        <button className="mt-10 h-12 w-32 bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between">
                          <ArrowLeftCircleIcon className="h-8 w-auto" />
                          Back
                        </button>
                      </Link>

                      <button
                        className="mt-10 h-12 w-56 bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded flex items-center justify-between"
                        onClick={handleStartButtonClick}
                      >
                        Start <ArrowRightCircleIcon className="h-8 w-auto" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-500 dark:text-white">
                      Round {currentQuestionIndex + 1}
                    </h5>
                    <div className="mb-6 flex-col items-center justify-between text-lg font-semibold underline underline-offset-auto">
                      Hypothetical Results
                    </div>

                    <p className="mb-2 text-4xl text-grey-700 dark:text-grey-400 justify-end text-center dark:text-white">
                      {getCurrentQuestion().toLocaleString()} conversions
                    </p>
                    <CampaignStats
                      impressions={impressions}
                      totalConversions={totalConversions}
                      conversionsPerThousand={conversionPerThousand}
                      className="mt-6"
                    />

                    <div className="mb-6 flex-col items-center justify-between text-lg font-semibold">
                      Given this result, would you increase or decrease spend?
                    </div>

                    <div className="flex mt-5 justify-between space-x-3 md:mt-6">
                      <button
                        className="px-3 py-2 text-base font-medium text-white bg-red-700 rounded-lg"
                        onClick={handleDecreaseSpend}
                      >
                        Decrease Spend
                      </button>
                      <button
                        className="px-3 py-2 text-base font-medium text-white bg-green-700 rounded-lg"
                        onClick={handleIncreaseSpend}
                      >
                        Increase Spend
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                // TODO: format and results
                <div> finished! </div>
                <div>
                  {" "}
                  accuracy: {((100 * numCorrect) / NUM_QUESTIONS).toFixed(0)}%
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
