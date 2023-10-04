from scipy.stats import beta
import matplotlib.pyplot as plt
import numpy


def observed_beta_dist_parameters(dataframe):
    """
    This function takes a pandas dataframe with impression level data. It expects each
    row to be an individual impression, and to include the columns `campaign` that
    uniquely identifies the campaign and `conversion` which is 0 or 1, depending on
    if there is an attributed conversion.

    This is based on the dataset loaded in get_dataset.py, however it should work
    with any other in this form.
    """
    campaign_dataframe = dataframe.groupby('campaign').agg(
        {'conversion': ['sum'], 'campaign': ['count']}
    )
    campaign_dataframe.columns = ["num_conversions", "num_impressions"]
    campaign_dataframe["conversion_rate"] = (
        campaign_dataframe["num_conversions"]/campaign_dataframe["num_impressions"]
    )
    # fit a Beta distribution to the data
    # Beta is bounded in [0,1], so we bound the fit with floc=0 and fscale=1
    α_fit, β_fit, _, __ = beta.fit(
        campaign_dataframe['conversion_rate'], floc=0, fscale=1
    )

    return (α_fit, β_fit)


def plot_implied_beta_distributions(α, β, induced_means):
    x = numpy.linspace(0, 1, 1000)
    pdf_fit = beta.pdf(x, α, β)
    plt.plot(x, pdf_fit, lw=1, label=f"Beta({α:.3g}, {β:.3g}) fit from data.")
    variance = beta_variance(α, β)
    for mean in induced_means:
        implied_α, implied_β = beta_α_β(mean, variance)
        if implied_α < 0 or implied_β < 0:
            print(
                f"Invalid implied parameters {implied_α, implied_β} "
                f"for mean: {mean}. Skipping"
            )
            continue
        pdf = beta.pdf(x, implied_α, implied_β)
        label = f"Implied Beta({implied_α:.3g}, {implied_β:.3g}) with mean {mean}."
        plt.plot(x, pdf, lw=1, label=label)

    plt.rcParams['font.family'] = 'Helvetica Neue'
    plt.ylabel('PDF')
    plt.title('Implied Beta Distributions')
    plt.legend()
    plt.show()


def beta_mean(α, β):
    return α / (α + β)


def beta_variance(α, β):
    return α*β / ((α + β)*(α + β)*(α + β + 1))


def beta_α_β(mean, variance):
    α = (mean*mean)*(((1-mean)/variance) - (1/mean))
    return α, α * (1/mean - 1)
