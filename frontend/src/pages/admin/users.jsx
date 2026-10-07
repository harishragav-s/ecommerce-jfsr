import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Trash2 } from "lucide-react";
import { fetchAllUsers, deleteUser } from "@/store/slices/adminUsersSlice";
import { getAllOrdersForAdmin } from "@/store/slices/adminOrdersSlice";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice, getId } from "@/lib/format";

function AdminUsers() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { userList, isLoading } = useSelector((s) => s.adminUsers);
  const { orderList } = useSelector((s) => s.adminOrder);
  const [q, setQ] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const rows = useMemo(() => {
    const orders = orderList || [];
    return (userList || [])
      .filter((u) => !q || `${u.userName} ${u.email}`.toLowerCase().includes(q.toLowerCase()))
      .map((u) => {
        const mine = orders.filter((o) => o.userId === getId(u));
        return { ...u, orders: mine.length, spent: mine.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.totalAmount, 0) };
      });
  }, [userList, orderList, q]);

  function remove(u) {
    if (u.role === "ADMIN") {
      toast({ title: "Admin accounts can't be deleted here.", variant: "destructive" });
      return;
    }
    if (!window.confirm(`Delete ${u.userName}'s account?`)) return;
    dispatch(deleteUser(getId(u))).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchAllUsers());
        toast({ title: "User deleted" });
      }
    });
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-gray-500">{(userList || []).length} registered accounts</p>
        </div>
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" className="h-10 w-full rounded-md border bg-white pl-9 pr-3 text-sm outline-none focus:border-gray-900" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Spent</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading && rows.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-gray-500">Loading...</td></tr>}
            {!isLoading && rows.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-gray-500">No users found.</td></tr>}
            {rows.map((u) => (
              <tr key={getId(u)} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">{u.userName?.charAt(0).toUpperCase()}</div>
                    <div>
                      <p className="font-medium">{u.userName}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.role === "ADMIN" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3">{u.orders}</td>
                <td className="px-4 py-3">{formatPrice(u.spent)}</td>
                <td className="px-4 py-3 text-right">
                  {u.role !== "ADMIN" && (
                    <button onClick={() => remove(u)} className="rounded p-2 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4 text-red-500" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
