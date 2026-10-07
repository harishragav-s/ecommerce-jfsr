import { Link, Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="relative hidden w-1/2 lg:block">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute bottom-0 p-12 text-white">
          <p className="mb-4 text-3xl font-black">STYLE<span className="text-red-500">KART</span></p>
          <h1 className="mb-3 text-4xl font-bold leading-tight">Your favourite brands, all in one place.</h1>
          <p className="text-white/80">Nike, Adidas, Puma, Levi's, Zara and H&M, delivered free above ₹999.</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-4 py-12">
        <Link to="/" className="mb-8 text-3xl font-black lg:hidden">STYLE<span className="text-red-500">KART</span></Link>
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
