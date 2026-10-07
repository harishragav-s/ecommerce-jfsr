import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, Package, MapPin, LogOut, Heart, Mail, Shield, ShoppingBag, IndianRupee } from "lucide-react";
import Address from "@/components/shop/address";
import ShoppingOrders from "@/components/shop/orders";
import { logoutUser } from "@/store/slices/authSlice";
import { getAllOrdersByUserId } from "@/store/slices/ordersSlice";
import { formatPrice } from "@/lib/format";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

function ProfilePanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { orderList } = useSelector((s) => s.shopOrder);
  const { addressList } = useSelector((s) => s.shopAddress);
  const wishCount = useSelector((s) => s.shopWishlist.items.length);

  useEffect(() => {
    if (user?.id) dispatch(getAllOrdersByUserId(user.id));
  }, [dispatch, user?.id]);

  const orders = orderList || [];
  const spent = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + (o.totalAmount || 0), 0);

  const stats = [
    { label: "Orders", value: orders.length, icon: ShoppingBag, to: "/shop/account?tab=orders" },
    { label: "Total spent", value: formatPrice(spent), icon: IndianRupee, to: "/shop/account?tab=orders" },
    { label: "Wishlist", value: wishCount, icon: Heart, to: "/shop/wishlist" },
    { label: "Addresses", value: (addressList || []).length, icon: MapPin, to: "/shop/account?tab=addresses" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-3xl font-bold text-white">
          {(user?.userName || "?").charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.userName}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <button key={label} onClick={() => navigate(to)} className="rounded-xl border p-5 text-left transition hover:shadow-md">
            <Icon className="mb-3 h-5 w-5 text-gray-500" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </button>
        ))}
      </div>

      <div className="rounded-xl border">
        <div className="border-b px-6 py-4 font-semibold">Personal details</div>
        <dl className="divide-y">
          {[
            { icon: User, label: "Username", value: user?.userName },
            { icon: Mail, label: "Email", value: user?.email },
            { icon: Shield, label: "Account type", value: user?.role === "ADMIN" ? "Administrator" : "Customer" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-4">
              <Icon className="h-4 w-4 text-gray-400" />
              <dt className="w-32 text-sm text-gray-500">{label}</dt>
              <dd className="text-sm font-medium">{value || "-"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function ShoppingAccount() {
  const [params, setParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const active = tabs.some((t) => t.id === params.get("tab")) ? params.get("tab") : "profile";

  return (
    <div className="flex-1 bg-gray-50 py-10">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-2xl font-bold">My account</h1>
        <p className="mb-8 text-sm text-gray-500">Hi {user?.userName}, manage your orders and details here.</p>
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-xl border bg-white p-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setParams({ tab: id })}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  active === id ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
            <button onClick={() => navigate("/shop/wishlist")} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
              <Heart className="h-4 w-4" /> Wishlist
            </button>
            <button onClick={() => dispatch(logoutUser())} className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </aside>
          <section className="rounded-xl border bg-white p-6">
            {active === "profile" && <ProfilePanel />}
            {active === "orders" && (<><h2 className="mb-4 text-lg font-semibold">My orders</h2><ShoppingOrders /></>)}
            {active === "addresses" && (<><h2 className="mb-4 text-lg font-semibold">Saved addresses</h2><Address /></>)}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
