from itertools import cycle
from collections import Counter
from scipy.stats import betabinom, laplace
import matplotlib.pyplot as plt
from tqdm import tqdm


def simulate(N, α, β, E, s, size, decision_fn):
    c = Counter()
    X = betabinom.rvs(N, α, β, size=size)
    noises = {ε: laplace.rvs(scale=s/ε, size=size) for ε in E}
    for ε in tqdm(E, desc="epsilons", leave=True):
        for x, noise in zip(X, noises[ε]):
            c[ε] += int(
                decision_fn(x) == decision_fn(x+noise)
            )
    return c


def p_decision_fn(p, N, α, β):
    p = betabinom.ppf(p, N, α, β)

    def decision_fn(x):
        return x > p

    return decision_fn


def plot_decisions(
        α,
        β,
        s,
        E,
        size,
        N_exp_start,
        N_exp_end,
        decisions,
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

        for decision_name, decision_p in tqdm(decisions, desc="decisions", leave=True):
            decision_fn = p_decision_fn(decision_p, N, α, β)
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

    decisions = [
        ('p1', 0.01),
        ('p10', 0.1),
        ('median', 0.5),
        ('p90', 0.9),
        ('p99', 0.99),
    ]

    version = 'median'

    match version:
        case 'median':
            decisions = [
                ('median', 0.5)
            ]
            title = 'DP Effect on Median Decision Rule'
            linestyles = ['-']
            plot_decisions(
                α, β, s, E, size, N_exp_start, N_exp_end, decisions, title, linestyles
            )
        case 'various rules':
            title = 'DP Effect on Various Decision Rules'
            plot_decisions(
                α, β, s, E, size, N_exp_start, N_exp_end, decisions, title
            )
        case 'various rules, limited N':
            title = 'DP Effect on Various Decision Rules'
            N_exp_start, N_exp_end = 4, 5
            plot_decisions(
                α, β, s, E, size, N_exp_start, N_exp_end, decisions, title
            )
