import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React, { ReactNode } from "react";
import clsx from "clsx";
import { AboutNavigation, PrevNextLinks } from "./about/navigation";

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "mx-auto max-w-7xl px-6 py-6 md:px-8 text-gray-900 dark:text-gray-100",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AboutPageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "relative mx-auto flex w-full max-w-8xl flex-auto justify-center sm:px-8 xl:px-12",
        className,
      )}
    >
      <div className="hidden md:relative md:block md:flex-none">
        <div className="sticky top-[4.75rem] -ml-0.5 h-[calc(100vh-4.75rem)] w-64 overflow-y-auto overflow-x-hidden py-16 pl-0.5 pr-8 xl:w-72 xl:pr-16">
          <AboutNavigation />
        </div>
      </div>
      <PageContainer>
        {children}
        <PrevNextLinks />
      </PageContainer>
    </div>
  );
}

export function PageTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={clsx(
        "text-xl font-bold tracking-tight md:text-6xl md:col-span-2 xl:col-auto",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function PageDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mt-6 xl:col-end-1 xl:row-start-1", className)}>
      <p className="text-lg leading-8 text-gray-600 dark:text-gray-400">
        {children}
      </p>
    </div>
  );
}

export function GameContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("sm:mx-auto w-full max-w-2xl", className)}>
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
        className={clsx(
          "absolute mb-1 h-auto bottom-full py-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-opacity hover:ease-in group-hover:opacity-100 opacity-0 ease-out duration-150 dark:bg-gray-700 dark:text-white",
          className,
        )}
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
