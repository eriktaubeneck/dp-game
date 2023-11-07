import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React, { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-7xl px-6 py-6 md:px-8">{children}</div>;
}

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="max-w-2xl text-xl font-bold tracking-tight text-gray-900 sm:text-6xl md:col-span-2 xl:col-auto">
      {children}
    </h1>
  );
}

export function PageDescription({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 max-w-xl md:mt-0 xl:col-end-1 xl:row-start-1">
      <p className="text-lg leading-8 text-gray-600">{children}</p>
    </div>
  );
}

export function GameContainer({ children }: { children: ReactNode }) {
  return (
    <div className="sm:mx-auto w-full max-w-2xl">
      <div className="max-w-full mt-6 px-2 md:px-6 py-6 bg-white/60 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        {children}
      </div>
    </div>
  );
}

/**
 * Making this abstact in case we want to use ToolTip with a button or other icon in the future.
 */
function Tooltip({
  children,
  tooltipChildren,
  className,
}: {
  children: ReactNode;
  tooltipChildren: ReactNode;
  className: string;
}) {
  return (
    <div className="relative group">
      <div
        className={`${className} absolute mb-1 h-auto bottom-full py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-opacity hover:ease-in group-hover:opacity-100 opacity-0 ease-out duration-150 dark:bg-gray-700 dark:text-white`}
      >
        {tooltipChildren}
      </div>
      <div className="group">{children}</div>
    </div>
  );
}

export function InfoCircleTooltip({
  children,
  tooltipClassName,
  infoCircleClassName,
}: {
  children: ReactNode;
  tooltipClassName: string;
  infoCircleClassName: string;
}) {
  return (
    <Tooltip tooltipChildren={children} className={tooltipClassName}>
      <InformationCircleIcon className={infoCircleClassName} />
    </Tooltip>
  );
}
