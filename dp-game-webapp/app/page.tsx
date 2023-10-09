import Image from 'next/image'
import Header from '@/app/nav'
import Link from 'next/link';

export default function Example() {

  return (
    <div className="bg-white">
      {/* Header */}
      <Header />

      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate -z-10 overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
          <div className="mx-auto max-w-10xl px-6 py-32 sm:py-40 lg:px-8">
              <h1 className="max-w-xl text-xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
                Welcome to the Differential Privacy Game!
              </h1>
              <br />
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <p className="text-lg leading-8 text-gray-600">
                We are doing a research to understand effect of adding DP to your conversion results.
                We will ask you a bunch of questions and that would help in determining the utility
                of DP.
                </p>
              </div>
          </div>
        </div>
        <br />
        <div className="hidden lg:flex lg:flex-1 lg:justify-center">
          <Link href="/game" className="text-2xl font-semibold leading-6 text-blue-600">
            Let's Play! <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <br /><br /><br />
      </main>
    </div>
  )
}