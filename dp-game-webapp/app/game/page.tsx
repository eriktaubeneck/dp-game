"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function BaseGame() {
  useEffect(() => {
    const conversionRate = sessionStorage.getItem("conversionRate");
    const conversionRateVariance = sessionStorage.getItem(
      "conversionRateVariance",
    );

    if (conversionRate !== null && conversionRateVariance !== null) {
      redirect("/game/play");
    } else if (conversionRate !== null) {
      redirect("/game/validate");
    } else {
      redirect("/game/configure");
    }
  }, []);
}
