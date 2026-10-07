import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IndianRupee, ShoppingBag, Package, Users, AlertTriangle } from "lucide-react";
import { fetchAllProducts } from "@/store/slices/adminProductsSlice";
import { getAllOrdersForAdmin } from "@/store/slices/adminOrdersSlice";
import { fetchAllUsers } from "@/store/slices/adminUsersSlice";
import ProductImage from "@/components/common/product-image";
import { StatusBadge, statusMeta } from "@/components/shop/order-status";
import { formatPrice, formatDate, getId } from "@/lib/format";

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList } = useSelector((s) => s.adminProducts);
  const { orderList } = useSelector((s) => s.adminOrder);
  const { userList } = useSelector((s) => s.adminUsers);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(getAllOrdersForAdmin());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const products = productList || [];
  const orders = orderList || [];
  const customers = (userList || []).filter((u) => u.role !== "ADMIN");
  const revenue = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + (o.totalAmount || 0), 0);
  const lowStock = products.filter((p) => (p.totalStock ?? 0) < 10).sort((a, b) => a.totalStock - b.totalStock);
  const recent = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 6);
  const byStatus = Object.keys(statusMeta)
    .map((k) => ({ k, count: orders.filter((o) => o.orderStatus === k).length }))
    .filter((s) => s.count > 0);

  const cards = [
    { label: "Revenue (paid)", value: formatPrice(revenue), icon: IndianRupee, to: "/admin/orders" },
    { label: "Orders", value: orders.length, icon: ShoppingBag, to: "/admin/orders" },
    { label: "Products", value: products.length, icon: Package, to: "/admin/products" },
    { label: "Customers", value: customers.length, icon: Users, to: "/admin/users" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mb-6 text-sm text-gray-500">How your store is doing.</p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <button key={label} onClick={() => navigate(to)} className="rounded-xl border bg-white p-5 text-left transition hover:shadow-md">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white"><Icon className="h-5 w-5" /></div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </button>
        ))}
      </div>

      <div className="mb-6 rounded-xl border bg-white p-5">
        <h2 className="mb-4 font-semibold">Orders by status</h2>
        {byStatus.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {byStatus.map(({ k, count }) => (
              <div key={k} className="flex items-center gap-3 text-sm">
                <span className="w-24">{statusMeta[k].label}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-gray-900" style={{ width: `${(count / orders.length) * 100}%` }} />
                </div>
                <span className="w-8 text-right font-semibold">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="font-semibold">Recent orders</h2>
            <button onClick={() => navigate("/admin/orders")} className="text-sm font-medium text-gray-600 hover:underline">View all</button>
          </div>
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="divide-y">
              {recent.map((o) => (
                <div key={getId(o)} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-gray-500">#{getId(o)?.slice(-8)}</p>
                    <p className="text-gray-700">{formatDate(o.orderDate)} · {o.cartItems?.length || 0} items</p>
                  </div>
                  <StatusBadge status={o.orderStatus} />
                  <span className="font-semibold">{formatPrice(o.totalAmount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-white">
          <div className="flex items-center gap-2 border-b px-5 py-4">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="font-semibold">Low stock</h2>
          </div>
          {lowStock.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">Everything is well stocked.</p>
          ) : (
            <div className="divide-y">
              {lowStock.slice(0, 6).map((p) => (
                <button key={getId(p)} onClick={() => navigate("/admin/products")} className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-gray-50">
                  <ProductImage src={p.image} alt={p.title} className="h-10 w-10 rounded" />
                  <p className="flex-1 truncate text-sm">{p.title}</p>
                  <span className={`text-sm font-bold ${p.totalStock === 0 ? "text-red-600" : "text-amber-600"}`}>{p.totalStock} left</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
