import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight text-center text-white">GYMie Member App</h1>
        <p className="mt-3 text-center text-sm text-slate-300">
          Welcome back! Track workouts, manage classes, and stay motivated with your personal dashboard.
        </p>
        <div className="mt-8 flex justify-center">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-base font-medium text-emerald-950 transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
            onClick={() => setCount((prev) => prev + 1)}
            type="button"
          >
            <span>Increase</span>
            <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
              {count}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
