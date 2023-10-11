# Differential Privacy Game
This game is designed to demonstrate the effect of decision making for advertising professionals with differentially private results. 

Through this research, we are trying to understand if advertising practitioners are presented with noisy results, how likely are they to make the same decision?
We plan to experiment with a set of epsilon values to research on utility of adding noise to the results.

# How to play the game?

## Step 0: Download the code and run it.
1. We used [Next.js](https://nextjs.org/) to build this simple game. You would need to download it if not already there.
2. `git clone https://github.com/eriktaubeneck/dp-game`
3. `cd dp-game-webapp`
4. If npm is not installed, install npm
5. Run the following command `npm run dev`
6. Install the required dependencies
   
## Step 1: Setup your initial configuration
1. We would ask you to configure your typical usage i.e. number of impressions and average conversion rate observed in your campaigns
2. Using this configuration, we would show you some simulated campaign results. We use Beta Distribution and publicly available [Criteo dataset](https://ailab.criteo.com/criteo-attribution-modeling-bidding-dataset/) to make some initial assumptions. You can find the detailed analysis [here](https://github.com/eriktaubeneck/dp-game/tree/main/data_analysis).
3. You can fine-tune the observed results by choosing the options shown

## Step 2: Play the game!
1 .We would generate a set of randomized results (e.g., 20 results). We’d then duplicate each, and add DP noise, generated with an epsilon randomly chosen from possible preset values.
2. Each of these results (both with and without noise), will be presented to you in random order, and the you will be asked to determine if the result would cause them to increase spend or decrease spend.

And.. that's it! We plan to run this game across several practitioners and collect data points. Based on this exercise, we hope to get a better understanding of effect of DP on the results.



