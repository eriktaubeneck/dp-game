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
      <div className="flex-col items-center justify-between text-lg font-semibold underline underline-offset-auto">
        Campaign Stats
      </div>
      <div className="mb-6 flex-col items-center justify-between">
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
