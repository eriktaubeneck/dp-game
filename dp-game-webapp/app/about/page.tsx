import React from "react";
import { AboutPageContainer, PageTitle } from "../components";

export default function About() {
  return (
    <AboutPageContainer>
      <PageTitle className="mb-14">
        Learn more about the Differential Privacy Game.
      </PageTitle>
      <p className="mt-2">
        This is a game designed to better understand the effect of differential
        privacy on ads measurement. The{" "}
        <a href="https://www.w3.org/community/patcg/" className="underline">
          <i>Private Ads Technology Community Group</i> (PATCG)
        </a>{" "}
        in the World Wide Web Consortium (W3C) is actively working on a new web
        standard for <i>private ads measurement</i> that can enable aggregate
        measurement of ad effectiveness based on cross site activity while
        preventing user tracking.
      </p>
      <p className="mt-2">
        This effort attempts to better understand the effect of that noise on
        the utility of ads measurement.
      </p>
    </AboutPageContainer>
  );
}
