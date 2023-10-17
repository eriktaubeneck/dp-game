"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import {
  generateSimulatedConversions,
  laplaceNoise,
} from "../simulate";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";

import { CampaignStats } from "../campaignStats";

import Link from "next/link";
import { EndGame, StartGame } from "../play/page";
import { AdjustVariance } from "../validate/page";

export default function Play() {
  const NUM_QUESTIONS = 10;
  const NUM_QUESTIONS_PER_PAGE = 10;
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
    : AdjustVariance(conversionRate);

  const shuffleQuestionOrder = () => {
    const questionOrder: QuestionIndex[] = [];
    for (let i = 0; i < NUM_QUESTIONS; i++) {
      questionOrder.push({ index: i, noised: false });
      questionOrder.push({ index: i, noised: true });
    }

    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    shuffleArray(questionOrder);
    setQuestionOrder(questionOrder);
  };

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
      shuffleQuestionOrder();
    };

    getConversionsAndPreLoad();

  }, []);

  const getCurrentQuestion = (index: number) => {
    const questionIndex: QuestionIndex = questionOrder[currentQuestionIndex + index];
    const question: Question = questions[questionIndex.index];
    if (questionIndex.noised) {
      return question.conversions + Math.round(question.noise);
    } else {
      return question.conversions;
    }
  };

  const incrementQuestion = () => {
    if (currentQuestionIndex + NUM_QUESTIONS_PER_PAGE < NUM_QUESTIONS * 2 - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + NUM_QUESTIONS_PER_PAGE);
    } else {
      setIsFinished(true);
    }
  };

  const handleAnswer = (answer: Answer, index: number) => {
    const questionsCopy = [...questions];
    const questionIndex: QuestionIndex = questionOrder[currentQuestionIndex + index];
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

  const handleDecreaseSpend = (index: number) => {
    handleAnswer(Answer.DecreaseSpend, index);
  };

  const handleIncreaseSpend = (index: number) => {
    handleAnswer(Answer.IncreaseSpend, index);
  };

  const handleStartButtonClick = () => {
    setIsStarted(true);
  };

  return (
    <div>
      <section className="py-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[510px]">
          <div className="max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            {!isFinished ? (
              <>
                {!isStarted ? (
                  <StartGame
                    impressions={impressions}
                    totalConversions={totalConversions}
                    conversionsPerThousand={conversionPerThousand}
                    onChange={handleStartButtonClick}
                  />
                ) : (
                  <>
                    <div className="justify-center text-center py-3">
                      <div>
                        <CampaignStats
                          impressions={impressions}
                          totalConversions={totalConversions}
                          conversionsPerThousand={conversionPerThousand}
                          className="mt-6"
                        />
                        <h2>Given this result, would you increase or decrease spend?</h2>
                        <table className="min-w-fit divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col"
                                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                              <th scope="col"
                                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Increase/Decrease Spend?</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {Array.from({ length: NUM_QUESTIONS_PER_PAGE }, (_, index) => (
                              <tr key={index}>
                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getCurrentQuestion(index).toLocaleString()}</td>
                                <td className="flex items-center mb-4 text-gray-900">
                                  <div className="flex mt-5 justify-between space-x-4 md:mt-6">
                                    <button
                                      className="px-4 py-2 text-base font-medium text-white bg-red-700 rounded-lg"
                                      onClick={() => handleDecreaseSpend(index)}
                                    >
                                      Decrease Spend
                                    </button>
                                    <button
                                      className="px-4 py-2 text-base font-medium text-white bg-green-700 rounded-lg"
                                      onClick={() => handleIncreaseSpend(index)}
                                    >
                                      Increase Spend
                                    </button>
                                  </div>

                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="py-4">
                          <button
                            className="px-3 py-2 text-base font-medium text-white bg-sky-400 hover:bg-sky-600 rounded-lg justify-center text-center"
                            onClick={() => incrementQuestion()}
                          >
                            Keep playing
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <EndGame questions={questions} num_questions={NUM_QUESTIONS} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
