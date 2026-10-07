import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import { setCartOpen } from "@/store/slices/uiSlice";
import { useToast } from "@/components/ui/use-toast";

// One place for add-to-bag: stock check, API call, cart refresh, feedback.
export function useAddToCart() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  return async function add(productId, totalStock, quantity = 1) {
    if (!productId) return false;

    const inBag = (cartItems?.items || []).find((i) => i.productId === productId)?.quantity || 0;
    if (totalStock !== undefined && inBag + quantity > totalStock) {
      toast({ title: `Only ${totalStock} in stock, and ${inBag} already in your bag.`, variant: "destructive" });
      return false;
    }

    const result = await dispatch(addToCart({ userId: user?.id, productId, quantity }));
    if (result?.payload?.success) {
      await dispatch(fetchCartItems(user?.id));
      dispatch(setCartOpen(true));
      return true;
    }
    toast({ title: "Couldn't add to bag. Please try again.", variant: "destructive" });
    return false;
  };
}
