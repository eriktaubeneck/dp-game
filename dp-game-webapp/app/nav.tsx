"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "About", href: "/about" },
    { name: "Play", href: "/game" },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 md:px-8"
        aria-label="Global"
      >
        <div className="flex md:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Differential Privacy Game</span>
            <PuzzlePieceIcon className="h-8 w-auto" />
          </Link>
        </div>
        <div className="flex md:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden md:flex md:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden md:flex md:flex-1 md:justify-end">
          {/* Commenting out until we add login functionality. */}
          {/*   <a href="#" className="text-sm font-semibold leading-6"> */}
          {/*     Log in <span aria-hidden="true">&rarr;</span> */}
          {/*   </a> */}
        </div>
      </nav>
      <Dialog
        as="div"
        className="md:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-indigo-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Differential Privacy Game</span>
              <PuzzlePieceIcon className="h-8 w-auto" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                {/* Commenting out until we add login functionality. */}
                {/* <a */}
                {/*   href="#" */}
                {/*   className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-gray-800" */}
                {/* > */}
                {/*   Log in */}
                {/* </a> */}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
