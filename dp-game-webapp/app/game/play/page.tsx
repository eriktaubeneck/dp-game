"use client";
import React, { useEffect, useState } from "react";

import { ExponentialNumber } from "../../exponentialNumber";
import { defaultVariance } from "../simulate";
import Configure from "./configure";
import Validate from "./validate";
import StartGame from "./start";
import QuestionsGame, { Question } from "./questions";
import Results from "./results";

enum GameState {
  Configure,
  Validate,
  Start,
  Playing,
  Finished,
}

export default function Play() {
  const NUM_QUESTIONS = 1;
  const SENSITIVITY = 1;
  const STARTING_EPSILON_POWER_OF_TEN = 0;
  const STARTING_CAMPAIGN_SIZE_POWER_OF_TEN = 6;

  const [gameState, setGameState] = useState<GameState>(GameState.Configure);
  const [conversionRate, setConversionRate] = useState<number>(0.01);
  const [variance, setVariance] = useState<number>(
    defaultVariance(conversionRate),
  );
  const [campaignSize, setCampaignSize] = useState<ExponentialNumber>(
    new ExponentialNumber(STARTING_CAMPAIGN_SIZE_POWER_OF_TEN, 10),
  );
  const [currentEpsilon, setCurrentEpsilon] = useState<ExponentialNumber>(
    new ExponentialNumber(STARTING_EPSILON_POWER_OF_TEN, 10),
  );
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setVariance(defaultVariance(conversionRate));
  }, [conversionRate]);

  const nextEpsilon = new ExponentialNumber(
    currentEpsilon.exponent - 1,
    currentEpsilon.base,
  );

  const setGameStateConfigure = () => {
    setGameState(GameState.Configure);
  };

  const setGameStateValidate = () => {
    setGameState(GameState.Validate);
  };

  const setGameStateStart = () => {
    setGameState(GameState.Start);
  };

  const setGameStatePlaying = () => {
    setGameState(GameState.Playing);
  };

  const setGameStateFinished = () => {
    setGameState(GameState.Finished);
  };

  return (
    <div className="mx-auto max-w-7xl px-2 lg:px-6 py-32 sm:py-40 lg:px-8">
      <section className="">
        <div className="sm:mx-auto sm:w-full sm:max-w-[510px]">
          <div className="max-w-full px-2 lg:px-6 py-6 bg-white/60 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            {(() => {
              switch (gameState) {
                case GameState.Configure:
                  return (
                    <Configure
                      conversionRate={conversionRate}
                      setConversionRate={setConversionRate}
                      campaignSize={campaignSize}
                      setCampaignSize={setCampaignSize}
                      setGameStateValidate={setGameStateValidate}
                    />
                  );
                case GameState.Validate:
                  return (
                    <Validate
                      conversionRate={conversionRate}
                      variance={variance}
                      setVariance={setVariance}
                      campaignSize={campaignSize}
                      setGameStateConfigure={setGameStateConfigure}
                      setGameStateStart={setGameStateStart}
                    />
                  );

                case GameState.Start:
                  return (
                    <StartGame
                      impressions={campaignSize.value}
                      conversionRate={conversionRate}
                      setGameStatePlaying={setGameStatePlaying}
                      setGameStateValidate={setGameStateValidate}
                    />
                  );
                case GameState.Playing:
                  return (
                    <>
                      <QuestionsGame
                        setAnsweredQuestions={setAnsweredQuestions}
                        impressions={campaignSize.value}
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
                      setCurrentEpsilon={setCurrentEpsilon}
                      setGameStatePlaying={setGameStatePlaying}
                      setGameStateConfigure={setGameStateConfigure}
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
