import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import laplace, norm
from tqdm import tqdm


def plot_repeated_laplace(μ, ε, N, rounds):
    """
    Demonstration of taking the mean of N repeated values
    with Laplace noise added, which converges to N(μ, 1/(ε *sqrt(N))).
    """

    fig, ax1 = plt.subplots()

    values = []
    for r in tqdm(range(rounds)):
        values.append(np.mean(laplace.rvs(μ, 1/ε, size=N)))
    hist_title = (
        f"Histogram of simulated average of N values"
        f" drawn from Laplace({μ}, {1/ε})"
        )
    ax1.hist(values, bins=100, color='blue', alpha=0.7, label=hist_title)
    x = np.linspace(μ - 1/ε, μ + 1/ε, 1000)
    laplace_pdf = laplace.pdf(x, loc=μ, scale=1/ε)
    ax2 = ax1.twinx()
    norm_pdf = norm.pdf(x, loc=μ, scale=1/(ε * np.sqrt(N)))
    ax2.plot(x, laplace_pdf, label=f"Laplace({μ}, {1/ε})")
    ax2.plot(x, norm_pdf, label=f"Normal({μ}, {1/(ε * np.sqrt(N))})")
    plt.ylim(0, plt.ylim()[1])
    plt.xlim(μ - 1/ε, μ + 1/ε)
    plt.title(f'Distribution of averaging {N} repeated draws from a Laplace')


def plot_laplace_curves(mu, eps):
    x = np.linspace(min(mu)-2, max(mu)+2, 1000)
    pdf1 = laplace.pdf(x, loc=mu[0], scale=1/eps)
    pdf2 = laplace.pdf(x, loc=mu[1], scale=1/eps)
    min_pdf = np.minimum(pdf1, pdf2)
    auc = laplace.cdf((max(mu)+min(mu))/2, loc=mu[1], scale=1/eps)
    plt.plot(x, pdf1, label=f'Laplace PDF (μ={mu[0]}, ε={eps:.2f})')
    plt.plot(x, pdf2, label=f'Laplace PDF (μ={mu[1]}, ε={eps:.2f})')
    plt.axvline(x=0.5, color='black', linestyle='--', alpha=0.5)
    plt.fill_between(
        x, min_pdf, color='lightgray', alpha=0.5, label=f'Prob Incorrect: {auc:.2f}'
    )
    plt.xlim(min(mu)-2, max(mu)+2)
    plt.ylim(0, plt.ylim()[1])
    plt.ylabel('Probability Density')
    plt.title('Laplace Distribution')
    plt.legend()
    plt.grid()


def plot_prob_by_eps(mu, E, linestyle=None):
    if not linestyle:
        linestyle = '-'
    auc = [1-laplace.cdf((max(mu)+min(mu))/2, loc=mu[1], scale=1/eps) for eps in E]
    plt.semilogx(
        E, auc, label='Prob of correct \nindividual decision', linestyle=linestyle
    )
    plt.xlabel('ε (log scale)')


if __name__ == "__main__":
    version = 'average laplace'

    mu = (0, 1)
    match version:
        case 'laplace curves':
            eps = 3
            plot_laplace_curves(mu, eps)
        case 'prob correct decision':
            E = [2**x for x in range(-18, 10)]
            plot_prob_by_eps(mu, E)
            plt.title('Prob of correct individual decision')
        case 'average laplace':
            plot_repeated_laplace(0, .1, 1_000, 100_000)

    plt.show()
