import React from "react";
import Link from "next/link";
import { PageContainer, PageDescription, PageTitle } from "./components";

export default function Index() {
  return (
    <PageContainer>
      <PageTitle>Welcome to the Differential Privacy Game!</PageTitle>
      <PageDescription>
        This game is designed to demonstrate the effect of decision making for
        advertising professionals with differentially private results. After
        some initial configuration, you'll be prompted with simulated campaign
        results. The game will challange your ability to make the same decisions
        with and without DP.
      </PageDescription>
      <div className="flex flex-1 justify-center">
        <Link
          href="/game"
          className="text-2xl font-semibold leading-6 text-blue-600"
        >
          Let's Play! <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </PageContainer>
  );
}
