import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Smartphone, Banknote, Lock, ShoppingBag } from "lucide-react";
import Address from "@/components/shop/address";
import ProductImage from "@/components/common/product-image";
import { Button } from "@/components/ui/button";
import Field from "@/components/auth/field";
import { createNewOrder, capturePayment } from "@/store/slices/ordersSlice";
import { fetchCartItems } from "@/store/slices/cartSlice";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice, effectivePrice, getId } from "@/lib/format";

const methods = [
  { id: "card", label: "Credit / Debit card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "cod", label: "Cash on delivery", icon: Banknote },
];
const FREE_FROM = 999;
const SHIPPING_FEE = 79;

function Step({ n, title, children }) {
  return (
    <section className="rounded-xl border bg-white p-6">
      <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-sm text-white">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function ShoppingCheckout() {
  const { cartItems } = useSelector((s) => s.shopCart);
  const { user } = useSelector((s) => s.auth);
  const [address, setAddress] = useState(null);
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upi, setUpi] = useState("");
  const [placing, setPlacing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const items = cartItems?.items || [];
  const subtotal = items.reduce((s, i) => s + effectivePrice(i) * i.quantity, 0);
  const mrp = items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_FROM ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (items.length === 0 && !placing) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
        <ShoppingBag className="mb-4 h-14 w-14 text-gray-300" />
        <p className="font-semibold">Your bag is empty</p>
        <p className="mb-6 text-sm text-gray-500">Add something before checking out.</p>
        <Button onClick={() => navigate("/shop/listing")}>Continue shopping</Button>
      </div>
    );
  }

  function paymentError() {
    if (method === "card") {
      if (card.number.replace(/\s/g, "").length !== 16) return "Enter a 16-digit card number.";
      if (!card.name.trim()) return "Enter the name on the card.";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) return "Enter expiry as MM/YY.";
      if (card.cvv.length < 3) return "Enter the 3-digit CVV.";
    }
    if (method === "upi" && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upi)) return "Enter a valid UPI ID, e.g. name@okaxis.";
    return null;
  }

  async function placeOrder() {
    if (!address) return toast({ title: "Please add or select a delivery address.", variant: "destructive" });
    const err = paymentError();
    if (err) return toast({ title: err, variant: "destructive" });

    setPlacing(true);
    const created = await dispatch(
      createNewOrder({
        userId: user?.id,
        cartId: cartItems?._id,
        cartItems: items.map((i) => ({ productId: i.productId, title: i.title, image: i.image, price: effectivePrice(i), quantity: i.quantity })),
        addressInfo: {
          addressId: getId(address),
          address: address.address,
          city: address.city,
          pincode: address.pincode,
          phone: address.phone,
          notes: address.notes,
        },
        orderStatus: "pending",
        paymentMethod: method,
        paymentStatus: "pending",
        totalAmount: total,
        orderDate: new Date(),
        orderUpdateDate: new Date(),
        paymentId: "",
        payerId: "",
      })
    );
    const orderId = created?.payload?.orderId;
    if (!orderId) {
      setPlacing(false);
      return toast({ title: "Couldn't create your order. Please try again.", variant: "destructive" });
    }

    // Demo gateway: no real money moves. Capture confirms the order, reduces stock and empties the bag.
    const captured = await dispatch(capturePayment({ paymentId: `DEMO-${method.toUpperCase()}-${Date.now()}`, payerId: user?.id, orderId }));
    if (captured?.payload?.success) {
      await dispatch(fetchCartItems(user?.id));
      navigate(`/shop/payment-success?orderId=${orderId}&method=${method}`);
    } else {
      setPlacing(false);
      toast({ title: "Payment failed. An item may have gone out of stock.", variant: "destructive" });
    }
  }

  return (
    <div className="flex-1 bg-gray-50 py-10">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="mb-8 text-2xl font-bold">Checkout</h1>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <Step n={1} title="Delivery address">
              <Address selectedId={address} setCurrentSelectedAddress={setAddress} />
            </Step>

            <Step n={2} title="Payment">
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                {methods.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMethod(id)}
                    className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left text-sm font-medium transition ${method === id ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}
                  >
                    <Icon className="h-5 w-5" /> {label}
                  </button>
                ))}
              </div>

              {method === "card" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Card number" placeholder="4111 1111 1111 1111" value={card.number}
                      onChange={(v) => setCard({ ...card, number: v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim() })} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Name on card" value={card.name} onChange={(v) => setCard({ ...card, name: v })} />
                  </div>
                  <Field label="Expiry (MM/YY)" placeholder="12/28" value={card.expiry}
                    onChange={(v) => { const d = v.replace(/\D/g, "").slice(0, 4); setCard({ ...card, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }); }} />
                  <Field label="CVV" type="password" value={card.cvv} onChange={(v) => setCard({ ...card, cvv: v.replace(/\D/g, "").slice(0, 3) })} />
                </div>
              )}
              {method === "upi" && (
                <div className="max-w-sm">
                  <Field label="UPI ID" placeholder="yourname@okaxis" value={upi} onChange={setUpi} />
                </div>
              )}
              {method === "cod" && (
                <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">Pay in cash when your order is delivered.</p>
              )}
              <p className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <Lock className="h-3.5 w-3.5" /> Demo checkout: no real payment is taken. Any valid-looking details work.
              </p>
            </Step>
          </div>

          <aside className="h-fit rounded-xl border bg-white p-6 lg:sticky lg:top-32">
            <h2 className="mb-4 text-lg font-semibold">Order summary ({items.length})</h2>
            <div className="mb-4 max-h-72 space-y-4 overflow-y-auto">
              {items.map((i) => (
                <div key={i.productId} className="flex gap-3">
                  <ProductImage src={i.image} alt={i.title} className="h-16 w-14 shrink-0 rounded-md" />
                  <div className="flex-1 text-sm">
                    <p className="line-clamp-2 font-medium">{i.title}</p>
                    <p className="text-gray-500">Qty {i.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(effectivePrice(i) * i.quantity)}</p>
                </div>
              ))}
            </div>
            <dl className="space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Total MRP</dt><dd>{formatPrice(mrp)}</dd></div>
              {mrp > subtotal && <div className="flex justify-between text-green-700"><dt>Discount on MRP</dt><dd>-{formatPrice(mrp - subtotal)}</dd></div>}
              <div className="flex justify-between"><dt className="text-gray-500">Delivery</dt><dd>{shipping === 0 ? <span className="text-green-700">FREE</span> : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between border-t pt-3 text-base font-bold"><dt>Total amount</dt><dd>{formatPrice(total)}</dd></div>
            </dl>
            {mrp > subtotal && <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-xs font-semibold text-green-800">You save {formatPrice(mrp - subtotal)} on this order</p>}
            <Button className="mt-5 h-12 w-full text-base" disabled={placing} onClick={placeOrder}>
              {placing ? "Processing..." : method === "cod" ? `Place order · ${formatPrice(total)}` : `Pay ${formatPrice(total)}`}
            </Button>
            <Link to="/shop/listing" className="mt-3 block text-center text-sm text-gray-500 hover:underline">Continue shopping</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
