import React, { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
      {children}
    </div>
  );
}

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="max-w-2xl text-xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
      {children}
    </h1>
  );
}

export function PageDescription({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
      <p className="text-lg leading-8 text-gray-600">{children}</p>
    </div>
  );
}

export function GameContainer({ children }: { children: ReactNode }) {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-[510px]">
      <div className="max-w-full mt-6 px-2 lg:px-6 py-6 bg-white/60 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        {children}
      </div>
    </div>
  );
}
