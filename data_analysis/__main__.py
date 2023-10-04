from .get_dataset import get_dataframe
from .analysis import (
    campaign_observed_beta_dist_parameters,
    plot_implied_beta_distributions,
)


if __name__ == "__main__":
    dataframe = get_dataframe()

    α_fit, β_fit = campaign_observed_beta_dist_parameters(dataframe)
    plot_implied_beta_distributions(
        α_fit,
        β_fit,
        [0.01, 0.02, 0.05, 0.1]
    )
