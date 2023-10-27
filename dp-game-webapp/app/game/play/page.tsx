"use client";
import React, { useEffect, useState } from "react";

import { redirect } from "next/navigation";

import { ExponentialNumber } from "../../exponentialNumber";
import { CampaignStats } from "../campaignStats";
import StartGame from "./start";
import QuestionsGame, { Question } from "./questions";
import Results from "./results";

enum GameState {
  Start,
  Playing,
  Finished,
}

export default function Play() {
  const NUM_QUESTIONS = 1;
  const SENSITIVITY = 1;
  const STARTING_EPSILON_POWER_OF_TEN = 0;

  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [conversionRate, setConversionRate] = useState<number>(0.01);
  const [campaignSizeExp, setCampaignSizeExp] = useState<number>(6);
  const [variance, setVariance] = useState<number>(0.00001);
  const [currentEpsilon, setCurrentEpsilon] = useState<ExponentialNumber>(
    new ExponentialNumber(STARTING_EPSILON_POWER_OF_TEN, 10),
  );

  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);

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

  const setGameStatePlaying = () => {
    setGameState(GameState.Playing);
  };

  const setGameStateFinished = () => {
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
                      clickStart={setGameStatePlaying}
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
                        setAnsweredQuestions={setAnsweredQuestions}
                        impressions={impressions}
                        conversionRate={conversionRate}
                        variance={variance}
                        sensitivity={SENSITIVITY}
                        num_questions={NUM_QUESTIONS}
                        currentEpsilon={currentEpsilon}
                        setGameStateFinished={setGameStateFinished}
                      />
                    </>
                  );
                case GameState.Finished:
                  return (
                    <Results
                      answeredQuestions={answeredQuestions}
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
