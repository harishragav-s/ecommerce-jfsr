import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ShoppingBag, Truck } from "lucide-react";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { setCartOpen } from "@/store/slices/uiSlice";
import { formatPrice, effectivePrice } from "@/lib/format";

const FREE_FROM = 999;

function UserCartWrapper({ cartItems }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = cartItems || [];
  const total = items.reduce((sum, i) => sum + effectivePrice(i) * (i.quantity || 0), 0);
  const remaining = Math.max(0, FREE_FROM - total);

  function go(path) {
    dispatch(setCartOpen(false));
    navigate(path);
  }

  return (
    <SheetContent className="flex w-full flex-col sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your bag ({items.length})</SheetTitle>
      </SheetHeader>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <ShoppingBag className="mb-4 h-14 w-14 text-gray-300" />
          <p className="mb-1 font-semibold">Your bag is empty</p>
          <p className="mb-6 text-sm text-gray-500">There's nothing in here yet.</p>
          <Button onClick={() => go("/shop/listing")}>Start shopping</Button>
        </div>
      ) : (
        <>
          <div className={`mt-4 rounded-md px-3 py-2 text-xs font-medium ${remaining > 0 ? "bg-amber-50 text-amber-800" : "bg-green-50 text-green-800"}`}>
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              {remaining > 0 ? `Add ${formatPrice(remaining)} more for free delivery` : "You've unlocked free delivery!"}
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white">
              <div className="h-full bg-current transition-all" style={{ width: `${Math.min(100, (total / FREE_FROM) * 100)}%` }} />
            </div>
          </div>
          <div className="mt-4 flex-1 space-y-5 overflow-y-auto pr-1">
            {items.map((item) => (
              <UserCartItemsContent key={item.productId} cartItem={item} />
            ))}
          </div>
          <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between text-base font-bold">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-gray-500">Delivery calculated at checkout.</p>
            <Button className="w-full" size="lg" onClick={() => go("/shop/checkout")}>Checkout</Button>
            <Button variant="outline" className="w-full" onClick={() => dispatch(setCartOpen(false))}>Continue shopping</Button>
          </div>
        </>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
