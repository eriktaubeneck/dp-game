import React from "react";
import {
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/outline";

export default function adjustVariance({
  handleIncreaseButtonClick,
  handleDecreaseButtonClick,
  className,
}: {
  handleIncreaseButtonClick: () => void;
  handleDecreaseButtonClick: () => void;
  className: string;
}) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <button
          className="h-12 w-32 lg:w-40 bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-2 rounded flex items-center justify-between"
          onClick={handleDecreaseButtonClick}
        >
          <ArrowDownCircleIcon className="h-8 w-auto" />
          Decrease Variance
        </button>
        <button
          className="h-12 w-32 lg:w-40 bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-2 rounded flex items-center justify-between"
          onClick={handleIncreaseButtonClick}
        >
          <ArrowUpCircleIcon className="h-8 w-auto" />
          Increase Variance
        </button>
      </div>
    </div>
  );
}
