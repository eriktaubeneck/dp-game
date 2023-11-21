import React from "react";
import { AboutPageContainer, PageTitle } from "../../components";

export default function AboutAggregation() {
  return (
    <AboutPageContainer>
      <PageTitle>
        Understanding {"\u03b5"} and {"\u03b4"}
      </PageTitle>
      <p className="mt-2">
        We often think of privacy as a <i>binary</i> attribute: either a system
        is private or it is not. Contrary to this idea, differential privacy
        does not tell us if a system is private or not.
      </p>
      <p className="mt-2">
        Instead, it's <b>measure of a system</b> that tells us how much
        information is revealed about individual data points within that system.
      </p>
      <p className="mt-2">
        If you interested in the mathematical details,{" "}
        <a
          href="https://en.wikipedia.org/wiki/Differential_privacy#Definition_of_%CE%B5-differential_privacy"
          className="underline"
        >
          check out Wikipedia
        </a>
        . Here, we'll continue to do our best to motivate with examples.
      </p>
    </AboutPageContainer>
  );
}
