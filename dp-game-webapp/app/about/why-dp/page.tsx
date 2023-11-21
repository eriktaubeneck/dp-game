import React from "react";
import { AboutPageContainer, PageTitle } from "../../components";

export default function About() {
  return (
    <AboutPageContainer>
      <PageTitle className="mb-14">Why Differential Privacy</PageTitle>

      <p className="mt-2">
        There is{" "}
        <a
          href="https://github.com/patcg/docs-and-reports/blob/main/design-dimensions/Dimensions-with-General-Agreement.md#privacy-defined-at-least-by-differential-privacy"
          className="underline"
        >
          initial consensus
        </a>{" "}
        in the Private Advertising Technology Working Group (PATCG) that
        differential privacy will be part of the solution.
      </p>

      <p className="mt-2">
        The short answer to "Why Differential Privacy?" is that it us an
        important tool for assuring that the API we design does not enable
        user-level cross-site tracking. Aggregation, it turns out, it simply
        insufficient to provide this guarantee, at least without so many
        restrictions the API would be rendered usless.
      </p>
    </AboutPageContainer>
  );
}
