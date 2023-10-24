import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import laplace


def plot_laplace_curves(mu, eps):
    x = np.linspace(min(mu)-2, max(mu)+2, 1000)
    pdf1 = laplace.pdf(x, loc=mu[0], scale=1/eps)
    pdf2 = laplace.pdf(x, loc=mu[1], scale=1/eps)
    min_pdf = np.minimum(pdf1, pdf2)
    aoc = laplace.cdf((max(mu)+min(mu))/2, loc=mu[1], scale=1/eps)
    plt.plot(x, pdf1, label=f'Laplace PDF (μ={mu[0]}, ε={eps:.2f})')
    plt.plot(x, pdf2, label=f'Laplace PDF (μ={mu[1]}, ε={eps:.2f})')
    plt.axvline(x=0.5, color='black', linestyle='--', alpha=0.5)
    plt.fill_between(
        x, min_pdf, color='lightgray', alpha=0.5, label=f'Prob Incorrect: {aoc:.2f}'
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
    aoc = [1-laplace.cdf((max(mu)+min(mu))/2, loc=mu[1], scale=1/eps) for eps in E]
    plt.semilogx(
        E, aoc, label='Prob of correct \nindividual decision', linestyle=linestyle
    )
    plt.xlabel('ε (log scale)')


if __name__ == "__main__":
    version = 'laplace curves'

    mu = (0, 1)
    match version:
        case 'laplace curves':
            eps = 3
            plot_laplace_curves(mu, eps)
        case 'prob correct decision':
            E = [2**x for x in range(-18, 10)]
            plot_prob_by_eps(mu, E)
            plt.title('Prob of correct individual decision')
            plt.show()
