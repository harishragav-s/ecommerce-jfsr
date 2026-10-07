import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Package } from "lucide-react";
import { Button } from "../ui/button";
import ProductImage from "../common/product-image";
import { StatusBadge, OrderTimeline } from "./order-status";
import { getAllOrdersByUserId } from "@/store/slices/ordersSlice";
import { formatPrice, formatDate, getId } from "@/lib/format";

const payLabel = { card: "Card", upi: "UPI", cod: "Cash on delivery", paypal: "PayPal" };

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const items = order.cartItems || [];
  const id = getId(order);

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 bg-gray-50 px-5 py-3 text-xs text-gray-600">
        <div><p className="uppercase">Order placed</p><p className="font-semibold text-gray-900">{formatDate(order.orderDate)}</p></div>
        <div><p className="uppercase">Total</p><p className="font-semibold text-gray-900">{formatPrice(order.totalAmount)}</p></div>
        <div><p className="uppercase">Payment</p><p className="font-semibold text-gray-900">{payLabel[order.paymentMethod] || order.paymentMethod} · {order.paymentStatus}</p></div>
        <div className="ml-auto text-right"><p className="uppercase">Order #</p><p className="font-mono font-semibold text-gray-900">{id?.slice(-10)}</p></div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <StatusBadge status={order.orderStatus} />
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 text-sm font-semibold hover:underline">
            {open ? "Hide details" : "Track & details"}
            <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {items.map((item, i) => (
            <div key={i} className="flex w-full items-center gap-3 sm:w-[calc(50%-0.375rem)]">
              <ProductImage src={item.image} alt={item.title} className="h-16 w-14 shrink-0 rounded-md" />
              <div className="text-sm">
                <p className="line-clamp-1 font-medium">{item.title}</p>
                <p className="text-gray-500">Qty {item.quantity} · {formatPrice(item.price)}</p>
              </div>
            </div>
          ))}
        </div>

        {open && (
          <div className="mt-6 space-y-6 border-t pt-6">
            <OrderTimeline status={order.orderStatus} />
            <div className="grid gap-6 text-sm sm:grid-cols-2">
              <div>
                <p className="mb-1 font-semibold">Delivery address</p>
                <p className="text-gray-600">{order.addressInfo?.address}</p>
                <p className="text-gray-600">{order.addressInfo?.city} - {order.addressInfo?.pincode}</p>
                <p className="text-gray-600">Phone: {order.addressInfo?.phone}</p>
              </div>
              <div>
                <p className="mb-1 font-semibold">Price details</p>
                {items.map((item, i) => (
                  <p key={i} className="flex justify-between text-gray-600">
                    <span className="line-clamp-1 pr-4">{item.title} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </p>
                ))}
                <p className="mt-2 flex justify-between border-t pt-2 font-semibold"><span>Total paid</span><span>{formatPrice(order.totalAmount)}</span></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShoppingOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { orderList, isLoading } = useSelector((s) => s.shopOrder);

  useEffect(() => {
    if (user?.id) dispatch(getAllOrdersByUserId(user.id));
  }, [dispatch, user?.id]);

  const orders = [...(orderList || [])].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  if (isLoading && orders.length === 0) {
    return <div className="space-y-4">{[1, 2].map((i) => <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-100" />)}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <Package className="mb-4 h-14 w-14 text-gray-300" />
        <p className="font-semibold">No orders yet</p>
        <p className="mb-6 text-sm text-gray-500">When you place an order, it will show up here.</p>
        <Button onClick={() => navigate("/shop/listing")}>Start shopping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => <OrderCard key={getId(order)} order={order} />)}
    </div>
  );
}

export default ShoppingOrders;
