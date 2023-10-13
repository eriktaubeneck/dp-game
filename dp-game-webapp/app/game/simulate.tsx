var binomial_dist = require("@stdlib/random-base-binomial");
var beta_dist = require("@stdlib/random-base-beta");
var laplace_dist = require("@stdlib/random-base-laplace");
var TDigest = require("tdigest").TDigest;

export function* generateSimulatedConversions(
  impressions: number,
  conversionRate: number,
  variance: number,
  rounds: number,
  seed: number = 1613149041,
): Generator<number> {
  const conversionRates: Generator<number> = generateSimulatedConversionRates(
    conversionRate,
    variance,
    rounds,
    seed,
  );

  var rand = binomial_dist.factory({
    seed: seed,
  });

  for (const conversionRate of conversionRates) {
    yield rand(impressions, conversionRate);
  }
}

export function* generateSimulatedConversionRates(
  mean: number,
  variance: number,
  rounds: number,
  seed: number = 1613149041,
): Generator<number> {
  const [alpha, beta] = betaAlphaBeta(mean, variance);
  var rand = beta_dist.factory(alpha, beta, {
    seed: seed,
  });

  for (let i = 0; i < rounds; i++) {
    yield rand();
  }
}

export function adjustedVariance(mean: number): number {
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

export function simulatedPercentiles(
  impressions: number,
  conversionRate: number,
  variance: number,
  rounds: number,
  seed: number = 1613149041,
  percentiles: number[] = [0.01, 0.1, 0.5, 0.9, 0.99],
): number[] {
  var td = new TDigest();
  const conversionCounts: Generator<number> = generateSimulatedConversions(
    impressions,
    conversionRate,
    variance,
    rounds,
    seed,
  );

  for (const conversionCount of conversionCounts) {
    td.push(conversionCount);
  }
  
  td.compress();

  const percentileValues: number[] = [];
  for (const percentile of percentiles) {
    percentileValues.push(td.percentile(percentile));
  }

  return percentileValues;
}

export function laplaceNoise(
  value: number,
  sensitivity: number,
  epsilon: number,
): number {
  const noise: number = laplace_dist(0.0, sensitivity / epsilon);
  return value + noise;
}
