import React, { useEffect, useState } from "react";

import {
  ArrowRightCircleIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";

import {
  generateSimulatedConversions,
  laplaceNoise,
  laplacePPF,
} from "../simulate";
import { ExponentialNumber } from "../../exponentialNumber";
import { CampaignStats } from "../campaignStats";
import { GameContainer, InfoCircleToolTip, PageContainer } from "./components";

export enum Answer {
  IncreaseSpend,
  MaintainSpend,
  DecreaseSpend,
}

export interface Question {
  conversions: number;
  noise: number;
  unnoisedAnswer?: Answer;
  noisedAnswer?: Answer;
}

export interface AnsweredQuestion {
  conversions: number;
  noise: number;
  unnoisedAnswer: Answer;
  noisedAnswer: Answer;
}

export interface QuestionIndex {
  index: number;
  noised: boolean;
}

enum QuestionPageState {
  Unnoised,
  Noised,
}

function randomIndexOrder(arraySize: number): number[] {
  const indexOrder = Array.from({ length: arraySize }, (_, index) => index);
  for (let i = indexOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexOrder[i], indexOrder[j]] = [indexOrder[j], indexOrder[i]];
  }
  return indexOrder;
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
  setAnsweredQuestions: (value: AnsweredQuestion[]) => void;
  impressions: number;
  conversionRate: number;
  variance: number;
  sensitivity: number;
  num_questions: number;
  currentEpsilon: ExponentialNumber;
  setGameStateFinished: () => void;
}) {
  const [questionPageState, setQuestionPageState] = useState<QuestionPageState>(
    QuestionPageState.Unnoised,
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [unnoisedQuestionOrder, setUnnoisedQuestionOrder] = useState<number[]>(
    [],
  );
  const [noisedQuestionOrder, setNoisedQuestionOrder] = useState<number[]>([]);

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
    setUnnoisedQuestionOrder(randomIndexOrder(num_questions));
    setNoisedQuestionOrder(randomIndexOrder(num_questions));
  };

  useEffect(() => {
    reloadQuestions();
  }, [currentEpsilon]);

  const handleAnswer = (answer: Answer, questionIndex: number) => {
    const questionsCopy = [...questions];
    const question: Question = questions[questionIndex];
    const updatedQuestion: Question = {
      conversions: question.conversions,
      noise: question.noise,
      unnoisedAnswer:
        questionPageState === QuestionPageState.Unnoised
          ? answer
          : question.unnoisedAnswer,
      noisedAnswer:
        questionPageState === QuestionPageState.Noised
          ? answer
          : question.noisedAnswer,
    };

    questionsCopy[questionIndex] = updatedQuestion;
    setQuestions(questionsCopy);
  };

  const handleContinue = () => {
    setQuestionPageState(QuestionPageState.Noised);
  };

  const handleSubmit = () => {
    const answeredQuestions: AnsweredQuestion[] = questions.map((question) => {
      if (
        question.unnoisedAnswer === undefined ||
        question.noisedAnswer === undefined
      ) {
        throw new Error("Unexpected unanswered question");
      }
      return {
        conversions: question.conversions,
        noise: question.noise,
        unnoisedAnswer: question.unnoisedAnswer,
        noisedAnswer: question.noisedAnswer,
      };
    });
    setAnsweredQuestions(answeredQuestions);
    setGameStateFinished();
  };

  const allUnnoisedAnswered: boolean = !questions.some(
    (question: Question) => question.unnoisedAnswer === undefined,
  );
  const allNoisedAnswered: boolean = !questions.some(
    (question: Question) => question.noisedAnswer === undefined,
  );

  const getQuestionConversions = (questionIndex: number) => {
    const question: Question = questions[questionIndex];
    if (questionPageState == QuestionPageState.Unnoised) {
      return question.conversions;
    } else {
      return question.conversions + Math.round(question.noise);
    }
  };

  const getQuestionAnswer = (questionIndex: number): Answer | undefined => {
    const question: Question = questions[questionIndex];
    if (questionPageState == QuestionPageState.Unnoised) {
      return question.unnoisedAnswer;
    } else {
      return question.noisedAnswer;
    }
  };

  function AnswerRow(value: number, index: number) {
    const answer = getQuestionAnswer(value);
    const conversions = getQuestionConversions(value);
    return (
      <tr key={index}>
        <td className="whitespace-nowrap text-sm text-center font-medium text-gray-900">
          {questionPageState === QuestionPageState.Unnoised ? (
            conversions.toLocaleString()
          ) : (
            <span>
              {conversions.toLocaleString()}
              <br />(
              {Math.round(
                conversions +
                  laplacePPF(0.025, sensitivity, currentEpsilon.value),
              ).toLocaleString()}{" "}
              -{" "}
              {Math.round(
                conversions +
                  laplacePPF(0.975, sensitivity, currentEpsilon.value),
              ).toLocaleString()}
              )
            </span>
          )}
        </td>
        <td className="flex items-center justify-around mt-2 mb-2 text-gray-900">
          <AnswerButtons
            questionIndex={value}
            answer={answer}
            handleAnswer={handleAnswer}
          />
        </td>
      </tr>
    );
  }

  return (
    <PageContainer>
      <GameContainer>
        <CampaignStats
          impressions={impressions}
          conversionRate={conversionRate}
          className=""
        />

        <div className="-mt-6 mb-6 flex-col items-center justify-between text-gray-600">
          {questionPageState === QuestionPageState.Unnoised ? (
            <span>No noised added</span>
          ) : (
            <span>
              Current noise from Laplace(0,{" "}
              {(1 / currentEpsilon.value).toLocaleString()}).
              <br />
              95% of the time, this will range from (
              {laplacePPF(
                0.025,
                sensitivity,
                currentEpsilon.value,
              ).toFixed()},{" "}
              {laplacePPF(0.975, sensitivity, currentEpsilon.value).toFixed()})
            </span>
          )}
        </div>

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
                {questionPageState === QuestionPageState.Unnoised ? (
                  <span>Conversions</span>
                ) : (
                  <span className="flex items-center">
                    <span className="mr-2">Conversions</span>
                    <InfoCircleToolTip
                      className="h-5 w-auto -mt-1 -mx-1"
                      tooltipChildren={
                        <div className="font-light normal-case">
                          The true observed falls within the provided range 95%
                          of the time.
                          <br />
                          <b>Note:</b> This is not a confidence interval on the
                          true conversion rate.
                        </div>
                      }
                    />
                  </span>
                )}
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
            {questionPageState === QuestionPageState.Unnoised
              ? unnoisedQuestionOrder.map(AnswerRow)
              : noisedQuestionOrder.map(AnswerRow)}
          </tbody>
        </table>
        <div className="flex justify-end items-center">
          {questionPageState === QuestionPageState.Unnoised ? (
            <button
              className={`mt-10 h-12 w-40 text-white font-bold py-2 px-4 rounded flex items-center justify-between ${
                allUnnoisedAnswered ? "bg-sky-400 hover:sky-600" : "bg-sky-200"
              }`}
              onClick={handleContinue}
              disabled={!allUnnoisedAnswered}
            >
              Continue to Noised Round{" "}
              <ArrowRightCircleIcon className="h-8 w-auto" />
            </button>
          ) : (
            <button
              className={`mt-10 h-12 w-40 text-white font-bold py-2 px-4 rounded flex items-center justify-between ${
                allNoisedAnswered ? "bg-sky-400 hover:sky-600" : "bg-sky-200"
              }`}
              onClick={handleSubmit}
              disabled={!allNoisedAnswered}
            >
              Submit <ArrowRightCircleIcon className="h-8 w-auto" />
            </button>
          )}
        </div>
      </GameContainer>
    </PageContainer>
  );
}

function AnswerButtons({
  questionIndex,
  answer,
  handleAnswer,
}: {
  questionIndex: number;
  answer: Answer | undefined;
  handleAnswer: (answer: Answer, questionIndex: number) => void;
}) {
  const handleDecreaseSpend = (questionIndex: number) => {
    handleAnswer(Answer.DecreaseSpend, questionIndex);
  };

  const handleMaintainSpend = (questionIndex: number) => {
    handleAnswer(Answer.MaintainSpend, questionIndex);
  };

  const handleIncreaseSpend = (questionIndex: number) => {
    handleAnswer(Answer.IncreaseSpend, questionIndex);
  };

  return (
    <div className="flex justify-between space-x-1 lg:space-x-4">
      <button
        className={`h-8 lg:h-12 lg:py-2 px-1 lg:px-4 text-base text-sm lg:text-lg font-medium text-white hover:bg-cyan-700 rounded-lg flex items-center justify-between ${
          answer === Answer.DecreaseSpend ? "bg-cyan-700" : "bg-cyan-400"
        }`}
        onClick={() => handleDecreaseSpend(questionIndex)}
      >
        Decrease <ArrowDownCircleIcon className="h-4 lg:h-8 w-auto ml-2" />
      </button>

      <button
        className={`h-8 lg:h-12 lg:py-2 px-1 lg:px-4 text-base text-sm lg:text-lg font-medium text-white hover:bg-teal-700 rounded-lg flex items-center justify-between ${
          answer === Answer.MaintainSpend ? "bg-teal-700" : "bg-teal-400"
        }`}
        onClick={() => handleMaintainSpend(questionIndex)}
      >
        Maintain <MinusCircleIcon className="h-4 lg:h-8 w-autho ml-2" />
      </button>

      <button
        className={`h-8 lg:h-12 lg:py-2 px-1 lg:px-4 text-base text-sm lg:text-lg font-medium text-white hover:bg-emerald-700 rounded-lg flex items-center justify-between ${
          answer === Answer.IncreaseSpend ? "bg-emerald-700" : "bg-emerald-400"
        }`}
        onClick={() => handleIncreaseSpend(questionIndex)}
      >
        Increase <ArrowUpCircleIcon className="h-4 lg:h-8 w-auto ml-2" />
      </button>
    </div>
  );
}
