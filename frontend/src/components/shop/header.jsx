import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, LogOut, Menu, Package, ShoppingBag, User, MapPin, Search, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { logoutUser } from "@/store/slices/authSlice";
import { fetchCartItems } from "@/store/slices/cartSlice";
import { setCartOpen } from "@/store/slices/uiSlice";
import UserCartWrapper from "./cart-wrapper";

const nav = [
  { label: "Men", to: "/shop/listing?category=men" },
  { label: "Women", to: "/shop/listing?category=women" },
  { label: "Kids", to: "/shop/listing?category=kids" },
  { label: "Footwear", to: "/shop/listing?category=footwear" },
  { label: "Accessories", to: "/shop/listing?category=accessories" },
];

function NavLinks({ onNavigate, vertical }) {
  const location = useLocation();
  const current = location.pathname + location.search;
  return (
    <nav className={vertical ? "flex flex-col gap-4" : "flex items-center gap-7"}>
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={`text-sm font-semibold uppercase tracking-wide transition-colors hover:text-red-600 ${
            current === item.to ? "text-red-600" : "text-gray-800"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function SearchBox({ className = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (location.pathname === "/shop/search") setQ(new URLSearchParams(location.search).get("keyword") || "");
  }, [location]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/shop/search?keyword=${encodeURIComponent(q.trim())}`);
      }}
      className={`relative ${className}`}
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search for products, brands and more"
        className="h-10 w-full rounded-md bg-gray-100 pl-9 pr-3 text-sm outline-none ring-gray-900 focus:bg-white focus:ring-1"
      />
    </form>
  );
}

function ShoppingHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.shopCart);
  const { cartOpen } = useSelector((s) => s.ui);
  const wishCount = useSelector((s) => s.shopWishlist.items.length);

  useEffect(() => {
    if (user?.id) dispatch(fetchCartItems(user.id));
  }, [dispatch, user?.id]);

  const items = cartItems?.items || [];
  const count = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

  const iconLink = "relative flex flex-col items-center gap-0.5 px-2 text-[11px] font-semibold text-gray-800 hover:text-red-600";
  const badge = "absolute -top-1.5 right-0 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="bg-gray-900 py-1.5 text-center text-xs font-medium text-white">
        Free delivery on orders above ₹999 · Easy 30-day returns
      </div>
      <div className="container mx-auto flex h-16 items-center gap-6 px-4 md:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/shop/home" className="shrink-0 text-2xl font-black tracking-tight">
          STYLE<span className="text-red-500">KART</span>
        </Link>
        <div className="hidden lg:block">
          <NavLinks />
        </div>
        <SearchBox className="ml-auto hidden max-w-md flex-1 md:block" />

        <div className="ml-auto flex items-center md:ml-0">
          <Link to="/shop/search" className={`${iconLink} md:hidden`} aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>

          <Link to="/shop/wishlist" className={iconLink}>
            <Heart className="h-5 w-5" />
            <span className="hidden md:block">Wishlist</span>
            {wishCount > 0 && <span className={badge}>{wishCount}</span>}
          </Link>

          <button className={iconLink} onClick={() => dispatch(setCartOpen(true))}>
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden md:block">Bag</span>
            {count > 0 && <span className={badge}>{count}</span>}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={iconLink}>
                <User className="h-5 w-5" />
                <span className="hidden md:block">Profile</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <p className="text-sm font-semibold">Hello, {user?.userName}</p>
                <p className="text-xs font-normal text-gray-500">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/shop/account?tab=profile")}><User className="mr-2 h-4 w-4" /> My profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/shop/account?tab=orders")}><Package className="mr-2 h-4 w-4" /> Orders</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/shop/wishlist")}><Heart className="mr-2 h-4 w-4" /> Wishlist</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/shop/account?tab=addresses")}><MapPin className="mr-2 h-4 w-4" /> Saved addresses</DropdownMenuItem>
              {user?.role === "ADMIN" && (
                <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}><LayoutDashboard className="mr-2 h-4 w-4" /> Admin panel</DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => dispatch(logoutUser())} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>


        </div>
      </div>

      <Sheet open={cartOpen} onOpenChange={(open) => dispatch(setCartOpen(open))}>
        <UserCartWrapper cartItems={items} />
      </Sheet>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="text-left text-xl font-black">
              STYLE<span className="text-red-500">KART</span>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <NavLinks vertical onNavigate={() => setMobileOpen(false)} />
            <NavLink to="/shop/listing" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold uppercase">
              All products
            </NavLink>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export default ShoppingHeader;
