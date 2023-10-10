"use client";
import { redirect } from "next/navigation";

export default function BaseGame() {
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
}
