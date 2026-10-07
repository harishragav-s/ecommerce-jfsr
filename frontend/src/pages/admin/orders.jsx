import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import { getAllOrdersForAdmin, updateOrderStatus } from "@/store/slices/adminOrdersSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import ProductImage from "@/components/common/product-image";
import { StatusBadge, OrderTimeline, statusMeta } from "@/components/shop/order-status";
import { formatPrice, formatDate, getId } from "@/lib/format";

const statuses = ["pending", "confirmed", "inShipping", "delivered", "rejected"];

function AdminOrders() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { orderList, isLoading } = useSelector((s) => s.adminOrder);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const orders = useMemo(
    () =>
      [...(orderList || [])]
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .filter((o) => (filter === "all" || o.orderStatus === filter) && (!q || getId(o)?.toLowerCase().includes(q.toLowerCase()))),
    [orderList, filter, q]
  );

  function changeStatus(order, orderStatus) {
    dispatch(updateOrderStatus({ id: getId(order), orderStatus })).then((res) => {
      if (res?.payload?.success) {
        dispatch(getAllOrdersForAdmin());
        if (selected && getId(selected) === getId(order)) setSelected({ ...selected, orderStatus });
        toast({ title: `Order marked ${statusMeta[orderStatus].label.toLowerCase()}` });
      } else {
        toast({ title: "Couldn't update the order.", variant: "destructive" });
      }
    });
  }

  const count = (s) => (orderList || []).filter((o) => s === "all" || o.orderStatus === s).length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>
      <p className="mb-6 text-sm text-gray-500">Update status as orders move through fulfilment.</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {["all", ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${filter === s ? "border-gray-900 bg-gray-900 text-white" : "bg-white hover:border-gray-900"}`}
          >
            {s === "all" ? "All" : statusMeta[s].label} ({count(s)})
          </button>
        ))}
        <div className="relative ml-auto min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order ID" className="h-9 w-full rounded-md border bg-white pl-9 pr-3 text-sm outline-none focus:border-gray-900" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading && orders.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-gray-500">Loading...</td></tr>}
            {!isLoading && orders.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-gray-500">No orders here.</td></tr>}
            {orders.map((o) => (
              <tr key={getId(o)} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelected(o)}>
                <td className="px-4 py-3 font-mono text-xs">#{getId(o)?.slice(-10)}</td>
                <td className="px-4 py-3">{formatDate(o.orderDate)}</td>
                <td className="px-4 py-3">{o.cartItems?.length || 0}</td>
                <td className="px-4 py-3 uppercase">{o.paymentMethod} · <span className="lowercase">{o.paymentStatus}</span></td>
                <td className="px-4 py-3 font-semibold">{formatPrice(o.totalAmount)}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <select value={o.orderStatus} onChange={(e) => changeStatus(o, e.target.value)} className="rounded-md border bg-white px-2 py-1 text-xs font-semibold">
                    {statuses.map((s) => <option key={s} value={s}>{statusMeta[s].label}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>Order #{getId(selected)?.slice(-10)}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-6 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={selected.orderStatus} />
                <span className="text-gray-500">Placed {formatDate(selected.orderDate)}</span>
                <span className="text-gray-500">· {selected.paymentMethod?.toUpperCase()} ({selected.paymentStatus})</span>
              </div>
              <OrderTimeline status={selected.orderStatus} />
              <div className="space-y-3">
                {(selected.cartItems || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <ProductImage src={item.image} alt={item.title} className="h-14 w-12 rounded" />
                    <p className="flex-1">{item.title} × {item.quantity}</p>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
                <p className="flex justify-between border-t pt-3 text-base font-bold"><span>Total</span><span>{formatPrice(selected.totalAmount)}</span></p>
              </div>
              <div>
                <p className="mb-1 font-semibold">Ship to</p>
                <p className="text-gray-600">{selected.addressInfo?.address}, {selected.addressInfo?.city} - {selected.addressInfo?.pincode}</p>
                <p className="text-gray-600">Phone: {selected.addressInfo?.phone}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                  <button key={s} disabled={selected.orderStatus === s} onClick={() => changeStatus(selected, s)}
                    className="rounded-md border px-3 py-1.5 text-xs font-semibold hover:border-gray-900 disabled:bg-gray-900 disabled:text-white">
                    {statusMeta[s].label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminOrders;
