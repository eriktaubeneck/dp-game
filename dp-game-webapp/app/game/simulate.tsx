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

export function defaultVariance(mean: number): number {
  // default to something very small comparied to mean
  // and adjust from there.
  // for extreme values of mean, larger values of variance
  // cause percentile Monte Carlo to go very slow.
  return mean / 1000;
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
  seed: number = 1613149041,
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
