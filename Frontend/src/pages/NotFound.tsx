import { Link } from 'react-router'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-black text-indigo-100 select-none">404</p>
      <h1 className="text-2xl font-bold text-gray-800 mt-2 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or was moved.</p>
      <Link to="/" className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 font-medium">
        <Home size={16} /> Back to Home
      </Link>
    </div>
  )
}
