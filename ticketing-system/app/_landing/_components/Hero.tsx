import Link from "next/link";

export default async function Hero() {
  return (
    <div className="flex flex-col justify-center items-center mt-17">
      <div className="flex items-center justify-center space-x-2 bg-blue-100 px-4 py-1 rounded-4xl text-blue-600">
        <div className="bg-blue-500 w-2 h-2 rounded-full animate-pulse"></div>
        <span className="">Real-time availability</span>
      </div>

      <div className="flex flex-col justify-center items-center text-8xl mt-15 font-bold">
        <span className="">
          Book Tickets
        </span>
        <span className="text-blue-600">
          Before They're Gone.
        </span>
      </div>

      <div className="mt-10 text-xl text-gray-500">
        <span className="">
          Real-time availability. No overselling. No surprises at checkout.
        </span>
      </div>

      <div className="flex justify-center items-center space-x-5 mt-15">
        <Link 
        href={'/events'}
        className="bg-blue-600 text-xl px-8 py-5 rounded-2xl text-white font-semibold">
          Browse Events
        </Link>

        <button className="bg-gray-100 text-xl px-8 py-5 rounded-2xl text-gray-600 font-semibold">
          How it works →
        </button>
      </div>
    </div>
  )
}