var binomial_dist = require("@stdlib/random-base-binomial");
var beta_dist = require("@stdlib/random-base-beta");
var laplace_dist = require("@stdlib/random-base-laplace");
var TDigest = require("tdigest").TDigest;

export function* generateSimulatedConversions(
  impressions: number,
  conversionRate: number,
  variance: number,
  rounds: number,
  seed: number | undefined,
): Generator<number> {
  const conversionRates: Generator<number> = generateSimulatedConversionRates(
    conversionRate,
    variance,
    rounds,
    seed,
  );

  if (seed !== undefined) {
    var rand = binomial_dist.factory({
      seed: seed,
    });
  } else {
    var rand = binomial_dist.factory();
  }

  for (const conversionRate of conversionRates) {
    yield rand(impressions, conversionRate);
  }
}

export function* generateSimulatedConversionRates(
  mean: number,
  variance: number,
  rounds: number,
  seed: number | undefined,
): Generator<number> {
  const [alpha, beta] = betaAlphaBeta(mean, variance);

  if (seed !== undefined) {
    var rand = beta_dist.factory(alpha, beta, {
      seed: seed,
    });
  } else {
    var rand = beta_dist.factory(alpha, beta);
  }
  for (let i = 0; i < rounds; i++) {
    yield rand();
  }
}

function betaDistributionVariance(alpha: number, beta: number): number {
  return (
    (alpha * beta) / ((alpha + beta) * (alpha + beta) * (alpha + beta + 1))
  );
}

export function defaultVariance(mean: number): number {
  // we start with (alpha, beta) = (1.2695280130777336, 26.876825491735)
  // which is from the dp-game/data-analysis work.
  // we then use the provied mean to update (alpha, beta) while maintaining variance
  // we then constrain (alpha, beta) to both be > 2.
  // we want (alpha, beta) both > 1 for approriate distirbution shape
  // (e.g. no concentration at 0 or 1)
  // we use 2 so that we have room to either increase or decrease from the default

  const alphaFit = 1.2695280130777336;
  const betaFit = 26.876825491735;
  const fitVariance = betaDistributionVariance(alphaFit, betaFit);
  const variance = Math.min(mean * (1 - mean) * 0.999, fitVariance);
  const [alpha, beta] = betaAlphaBeta(mean, variance);
  const x = Math.max(2, Math.min(alpha, beta));
  const k = alpha < beta ? x / alpha : x / beta;
  const adjustedAlpha = k * alpha;
  const adjustedBeta = k * beta;
  const adjustedVariance = betaDistributionVariance(
    adjustedAlpha,
    adjustedBeta,
  );
  return adjustedVariance;
}

export function increaseVariance(mean: number, variance: number): number {
  const [alpha, beta] = betaAlphaBeta(mean, variance);
  const k =
    alpha < beta ? ((alpha - 1) / 2 + 1) / alpha : ((beta - 1) / 2 + 1) / beta;
  return betaDistributionVariance(k * alpha, k * beta);
}

export function decreaseVariance(mean: number, variance: number): number {
  const [alpha, beta] = betaAlphaBeta(mean, variance);
  const k =
    alpha < beta ? ((alpha - 1) * 2 + 1) / alpha : ((beta - 1) * 2 + 1) / beta;
  return betaDistributionVariance(k * alpha, k * beta);
}

function betaAlphaBeta(mean: number, variance: number): [number, number] {
  let alpha = mean * mean * ((1 - mean) / variance - 1 / mean);
  return [alpha, alpha * (1 / mean - 1)];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function* enumerate<T>(iterable: Iterable<T>): Generator<[T, number]> {
  let index = 0;
  for (const item of iterable) {
    yield [item, index];
    index++;
  }
}

export async function simulatedPercentiles(
  impressions: number,
  conversionRate: number,
  variance: number,
  rounds: number,
  seed: number | undefined,
  percentiles: number[] = [0.01, 0.1, 0.5, 0.9, 0.99],
  handleLoadingPercentChange: (value: number) => void = () => {},
): Promise<number[]> {
  var td = new TDigest();
  const conversionCounts: Generator<number> = generateSimulatedConversions(
    impressions,
    conversionRate,
    variance,
    rounds,
    seed,
  );
  const oneHundredth = Math.floor(rounds / 100);
  for (const [conversionCount, i] of enumerate(conversionCounts)) {
    td.push(conversionCount / impressions);
    if (i % oneHundredth === 0) {
      // need the sleep here to allow the loading bar to render
      // only happens 100 times, so only an additional 100ms
      await sleep(1);
      handleLoadingPercentChange(Math.floor((i * 100) / rounds));
    }
  }

  td.compress();

  const percentileValues: number[] = [];
  for (const percentile of percentiles) {
    percentileValues.push(td.percentile(percentile) * impressions);
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
