// "use client"

import Link from "next/link"

export default function Home() {
  return (
    <main>
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="mb-7">if you are a new user, please continue with sign-up Option</p>
        <div className="flex space-x-4">
          <Link href="./sign-up">
            <p className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Sign Up
            </p>
          </Link>
          <Link href="./login">
            <p className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Login
            </p>
          </Link>
        </div>
      </div>

    </main>
  )
}
