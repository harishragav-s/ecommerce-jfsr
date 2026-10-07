import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-black text-gray-200">404</p>
      <h1 className="mb-2 text-2xl font-bold">Page not found</h1>
      <p className="mb-8 text-gray-500">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">Back to home</Link>
    </div>
  );
}

export default NotFound;
