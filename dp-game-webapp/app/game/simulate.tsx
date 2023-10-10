var binomial_dist = require("@stdlib/random-base-binomial");
var beta_dist = require("@stdlib/random-base-beta");

export function simulateConversions(
  impressions: number,
  conversionRate: number,
  rounds: number,
  seed: number = 1613149041,
): number[] {
  const variance = adjustedVariance(conversionRate);

  const conversionRates: number[] = simulateConversionRates(
    conversionRate,
    variance,
    rounds,
    seed,
  );

  var rand = binomial_dist.factory({
    seed: seed,
  });

  const conversionCounts: number[] = [];

  for (let i = 0; i < rounds; i++) {
    conversionCounts.push(rand(impressions, conversionRates[i]));
  }

  return conversionCounts;
}

export function simulateConversionRates(
  mean: number,
  variance: number,
  rounds: number,
  seed: number = 1613149041,
): number[] {
  const [alpha, beta] = betaAlphaBeta(mean, variance);
  var rand = beta_dist.factory(alpha, beta, {
    seed: seed,
  });
  const conversionRates: number[] = [];

  for (let i = 0; i < rounds; i++) {
    conversionRates.push(rand());
  }

  return conversionRates;
}

function adjustedVariance(mean: number): number {
  // this comes from the data_analysis/ subproject
  // see: https://github.com/eriktaubeneck/dp-game/tree/main/data_analysis
  const defaultMean = 0.0451045288285979;
  const defaultVariance = 0.001477718655290317;

  // this scales the variance used for simulation
  // to the mean provided by the user.
  // it assumes that, because our underlying process
  // is Bernoulli, the variance ~ p(1-p)
  const k = mean / defaultMean;
  const j = (k * (1 - k * defaultMean)) / (1 - defaultMean);

  return j * defaultVariance;
}

function betaAlphaBeta(mean: number, variance: number): [number, number] {
  let alpha = mean * mean * ((1 - mean) / variance - 1 / mean);
  return [alpha, alpha * (1 / mean - 1)];
}
