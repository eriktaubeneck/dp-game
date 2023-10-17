import React from "react";

interface CampaignStatsProps {
  impressions: number;
  totalConversions: number;
  conversionsPerThousand: number;
  className: string;
}

export function CampaignStats({
  impressions,
  totalConversions,
  conversionsPerThousand,
  className,
}: CampaignStatsProps) {
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
