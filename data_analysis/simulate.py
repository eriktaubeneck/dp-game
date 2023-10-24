from itertools import cycle
from collections import Counter
from enum import Enum
from scipy.stats import betabinom, laplace
import matplotlib.pyplot as plt
from tqdm import tqdm


def simulate(N, α, β, E, s, size, decision_fn):
    c = Counter()
    X = betabinom.rvs(N, α, β, size=size)
    noises = {ε: laplace.rvs(scale=s/ε, size=size) for ε in E}
    noise_bounds = {
        ε: (laplace.ppf(0.975, scale=s/ε))
        for ε in E
    }
    for ε in tqdm(E, desc="epsilons", leave=True):
        for x, noise in zip(X, noises[ε]):
            c[ε] += int(
                decision_fn(x, x, x) ==
                decision_fn(x+noise, x+noise-noise_bounds[ε], x+noise+noise_bounds[ε])
            )
    return c


Decisions = Enum('Decisions', ['INCREASE', 'DECREASE', 'MAINTAIN'])


def p_decision_fn(p, N, α, β):
    p = betabinom.ppf(p, N, α, β)

    def decision_fn(x, _, __):
        if x > p:
            return Decisions.INCREASE
        else:
            return Decisions.DECREASE

    return decision_fn


def p_lower_upper_decision_fn(p, N, α, β):
    p_lower, p_upper = p
    p_lower = betabinom.ppf(p_lower, N, α, β)
    p_upper = betabinom.ppf(p_upper, N, α, β)

    def decision_fn(x, x_lower, x_upper):
        if x_lower > p_upper:
            return Decisions.INCREASE
        elif x_upper < p_lower:
            return Decisions.DECREASE
        else:
            return Decisions.MAINTAIN

    return decision_fn


def plot_decisions(
        α,
        β,
        s,
        E,
        size,
        N_exp_start,
        N_exp_end,
        decision_meta_fn,
        decisions_args,
        title,
        linestyles=None,
):
    if linestyles is None:
        linestyles = ['-', '--', ':', '-.']

    plt.figure(figsize=(8, 4.8))
    plt.subplots_adjust(right=0.7)

    N_exp_range = tqdm(range(N_exp_start, N_exp_end), desc="N", leave=True)
    for x, linestyle in zip(N_exp_range, cycle(linestyles)):
        N = 10**x

        for decision_name, decision_p in tqdm(decision_args, desc="decisions", leave=True):
            decision_fn = decision_meta_fn(decision_p, N, α, β)
            c = simulate(N, α, β, E, s, size, decision_fn)
            # Create a log-scaled plot
            label = f'N = 10^{x}, {decision_name} decision'
            plt.semilogx(E, [c[ε]/size for ε in E], label=label, linestyle=linestyle)

    # Add labels and a title
    plt.xlabel('ε (log scale)')
    plt.ylabel('P(same decision)')
    plt.title(title)

    # Show the plot
    plt.gca().spines['top'].set_visible(False)
    plt.gca().spines['right'].set_visible(False)

    plt.legend(loc="upper left", bbox_to_anchor=(1, 1))
    plt.show()


if __name__ == "__main__":
    α, β = 2.0, 198.0
    s = 1
    E = [2**x for x in range(-23, 4)]
    size = 100_000
    N_exp_start, N_exp_end = 4, 8
    plt.rcParams['font.family'] = 'Helvetica Neue'

    decision_args = [
        ('p1', 0.01),
        ('p10', 0.1),
        ('median', 0.5),
        ('p90', 0.9),
        ('p99', 0.99),
    ]

    version = 'maintain, various rules'

    match version:
        case 'median':
            decision_args = [
                ('median', 0.5)
            ]
            title = 'DP Effect on Median Decision Rule'
            linestyles = ['-']
            plot_decisions(
                α, β, s, E, size, N_exp_start, N_exp_end, p_decision_fn, decision_args,
                title, linestyles
            )
        case 'various rules':
            title = 'DP Effect on Various Decision Rules'
            plot_decisions(
                α, β, s, E, size, N_exp_start, N_exp_end, p_decision_fn, decision_args,
                title
            )
        case 'various rules, limited N':
            title = 'DP Effect on Various Decision Rules'
            N_exp_start, N_exp_end = 4, 5
            plot_decisions(
                α, β, s, E, size, N_exp_start, N_exp_end, p_decision_fn, decision_args,
                title
            )
        case 'maintain':
            decision_args = [
                ('P50/P60', (0.5, 0.6)),
            ]
            title = 'DP Effect on Decision Rules'
            N_exp_start, N_exp_end = 4, 8
            linestyles = ['-']
            plot_decisions(
                α, β, s, E, size, N_exp_start, N_exp_end, p_lower_upper_decision_fn,
                decision_args, title, linestyles
            )

        case 'maintain, various rules':
            decision_args = [
                ('P50/P60', (0.5, 0.6)),
                ('P40/P60', (0.4, 0.6)),
                ('P30/P50', (0.3, 0.5)),
                ('P80/P90', (0.8, 0.9)),
            ]
            title = 'DP Effect on Decision Rules'
            N_exp_start, N_exp_end = 4, 5
            linestyles = ['-']
            plot_decisions(
                α, β, s, E, size, N_exp_start, N_exp_end, p_lower_upper_decision_fn,
                decision_args, title, linestyles
            )
