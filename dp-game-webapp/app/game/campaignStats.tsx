import React from "react";

interface CampaignStatsProps {
  impressions: number;
  conversionRate: number;
  className: string;
}

export function CampaignStats({
  impressions,
  conversionRate,
  className,
}: CampaignStatsProps) {
  const totalConversions: number = impressions * conversionRate;
  const conversionsPerThousand: number = 1000 * conversionRate;

  return (
    <div className={className}>
      <div className="mb-6 text-xl font-semibold leading-6 text-blue-600">
        Campaign Stats (as configured)
      </div>
      <div className="mb-6 flex-col items-center justify-between text-gray-600">
        Number of Impressions: {impressions.toLocaleString()}
        <br />
        Expected Number of Conversions (Total):{" "}
        {totalConversions.toLocaleString()}
        <br />
        Expected Conversions per 1000 Impressions:{" "}
        {conversionsPerThousand.toLocaleString()}
      </div>
    </div>
  );
}
