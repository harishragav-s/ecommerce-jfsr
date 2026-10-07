import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

function UnauthPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <ShieldAlert className="mb-4 h-16 w-16 text-red-500" />
      <h1 className="mb-2 text-2xl font-bold">You don't have access to this page</h1>
      <p className="mb-8 text-gray-500">This area is for store administrators only.</p>
      <Link to="/shop/home" className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">Go to the store</Link>
    </div>
  );
}

export default UnauthPage;
