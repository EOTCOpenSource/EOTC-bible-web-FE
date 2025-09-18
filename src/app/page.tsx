
export default function Home() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-start gap-5 p-24">
        <h1 className="text-2xl font-semibold text-center">Hello👋 EOTC-OPEN-SOURCE members</h1>
        <p>Here is the front-end landing-page part of our bible app project</p>
        <div className="mt-8 space-x-4">
          <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Login
          </a>
          <a
            href="/register"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Register
          </a>
        </div>
      </div>
    </>
  )
}
