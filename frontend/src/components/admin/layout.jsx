import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Package, Users, ShoppingBag, LogOut, LayoutDashboard, Store, Menu, X } from "lucide-react";
import { logoutUser } from "@/store/slices/authSlice";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/users", label: "Customers", icon: Users },
];

function Sidebar({ onNavigate }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col bg-gray-900 p-4 text-gray-300">
      <div className="mb-8 px-2">
        <p className="text-xl font-black text-white">STYLE<span className="text-red-500">KART</span></p>
        <p className="text-xs text-gray-500">Admin console</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-white text-gray-900" : "hover:bg-gray-800 hover:text-white"}`
            }
          >
            <Icon className="h-4 w-4" /> {label}
          </NavLink>
        ))}
      </nav>
      <button onClick={() => navigate("/shop/home")} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-gray-800 hover:text-white">
        <Store className="h-4 w-4" /> View store
      </button>
      <button onClick={() => dispatch(logoutUser())} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-gray-800">
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </div>
  );
}

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 lg:block">
        <Sidebar />
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-64"><Sidebar onNavigate={() => setOpen(false)} /></div>
          <button className="flex-1 bg-black/40" onClick={() => setOpen(false)} aria-label="Close menu" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white px-4 md:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right text-sm">
              <p className="font-semibold">{user?.userName}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 font-bold text-white">
              {(user?.userName || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
