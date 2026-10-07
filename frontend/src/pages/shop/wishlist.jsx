import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShoppingProductTile from "@/components/shop/product-tile";

function ShoppingWishlist() {
  const navigate = useNavigate();
  const items = useSelector((s) => s.shopWishlist.items);

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <h1 className="mb-1 text-2xl font-bold">My wishlist</h1>
      <p className="mb-8 text-sm text-gray-500">{items.length} items</p>
      {items.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed py-20 text-center">
          <Heart className="mb-4 h-14 w-14 text-gray-300" />
          <p className="font-semibold">Your wishlist is empty</p>
          <p className="mb-6 text-sm text-gray-500">Tap the heart on any product to save it here.</p>
          <Button onClick={() => navigate("/shop/listing")}>Explore products</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
          {items.map((p) => <ShoppingProductTile key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export default ShoppingWishlist;
