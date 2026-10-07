import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, Trash2 } from "lucide-react";
import { deleteCartItem, updateCartQuantity } from "@/store/slices/cartSlice";
import { setCartOpen } from "@/store/slices/uiSlice";
import { useToast } from "../ui/use-toast";
import ProductImage from "../common/product-image";
import { formatPrice, effectivePrice, getId } from "@/lib/format";

function UserCartItemsContent({ cartItem, compact }) {
  const { user } = useSelector((s) => s.auth);
  const { productList, productDetails } = useSelector((s) => s.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Stock is known only if the product was loaded on this page; the backend re-checks at payment anyway.
  const known = [...(productList || []), productDetails].find((p) => p && getId(p) === cartItem.productId);
  const stock = known?.totalStock;

  function changeQty(delta) {
    const quantity = cartItem.quantity + delta;
    if (quantity < 1) return;
    if (delta > 0 && stock !== undefined && quantity > stock) {
      toast({ title: `Only ${stock} in stock.`, variant: "destructive" });
      return;
    }
    dispatch(updateCartQuantity({ userId: user?.id, productId: cartItem.productId, quantity }));
  }

  function remove() {
    dispatch(deleteCartItem({ userId: user?.id, productId: cartItem.productId })).then((res) => {
      if (res?.payload?.success) toast({ title: "Removed from bag" });
    });
  }

  const unit = effectivePrice(cartItem);

  return (
    <div className="flex gap-4">
      <Link to={`/shop/product/${cartItem.productId}`} onClick={() => dispatch(setCartOpen(false))} className="shrink-0">
        <ProductImage src={cartItem.image} alt={cartItem.title} className="h-24 w-20 rounded-md" />
      </Link>
      <div className="flex flex-1 flex-col">
        <p className="line-clamp-2 text-sm font-medium">{cartItem.title}</p>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="font-bold">{formatPrice(unit)}</span>
          {cartItem.salePrice > 0 && cartItem.salePrice < cartItem.price && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(cartItem.price)}</span>
          )}
        </div>
        {!compact && (
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex items-center rounded-md border">
              <button className="p-1.5 disabled:opacity-40" disabled={cartItem.quantity <= 1} onClick={() => changeQty(-1)} aria-label="Decrease">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{cartItem.quantity}</span>
              <button className="p-1.5" onClick={() => changeQty(1)} aria-label="Increase">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button onClick={remove} className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-600">
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCartItemsContent;
