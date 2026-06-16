import { Link } from 'react-router'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="text-9xl font-black text-indigo-100 select-none leading-none">404</div>
      <h1 className="text-2xl font-bold text-gray-800 mt-2 mb-3">Page not found</h1>
      <p className="text-gray-400 mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3">
        <button onClick={() => history.back()}
          className="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl hover:bg-gray-50 font-medium text-sm transition">
          <ArrowLeft size={15} /> Go Back
        </button>
        <Link to="/"
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-medium text-sm transition">
          <Home size={15} /> Home
        </Link>
      </div>
    </div>
  )
}
