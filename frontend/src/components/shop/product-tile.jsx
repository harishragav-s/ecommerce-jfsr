import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingBag, Star, Check } from "lucide-react";
import { brandOptionsMap } from "@/config";
import ProductImage from "../common/product-image";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { formatPrice, getId, discountPercent, effectivePrice } from "@/lib/format";

function ShoppingProductTile({ product }) {
  const id = getId(product);
  const dispatch = useDispatch();
  const addToCart = useAddToCart();
  const wishlisted = useSelector((s) => s.shopWishlist.items.some((p) => p.id === id));
  const [added, setAdded] = useState(false);

  const off = discountPercent(product?.price, product?.salePrice);
  const outOfStock = product?.totalStock === 0;

  async function handleAdd(e) {
    e.preventDefault();
    if (await addToCart(id, product?.totalStock)) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  }

  return (
    <Link to={`/shop/product/${id}`} className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        <ProductImage
          src={product?.image}
          alt={product?.title}
          className="h-full w-full transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {outOfStock ? (
            <span className="rounded bg-gray-900 px-2 py-0.5 text-[11px] font-semibold text-white">SOLD OUT</span>
          ) : off > 0 ? (
            <span className="rounded bg-red-600 px-2 py-0.5 text-[11px] font-semibold text-white">-{off}%</span>
          ) : null}
          {!outOfStock && product?.totalStock < 10 && (
            <span className="rounded bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
              Only {product.totalStock} left
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            dispatch(toggleWishlist(product));
          }}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
        </button>

        {!outOfStock && (
          <button
            type="button"
            onClick={handleAdd}
            className="absolute inset-x-2 bottom-2 flex translate-y-2 items-center justify-center gap-2 rounded-md bg-white/95 py-2.5 text-sm font-semibold text-gray-900 opacity-0 shadow transition-all hover:bg-gray-900 hover:text-white group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100"
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            {added ? "Added" : "Add to bag"}
          </button>
        )}
      </div>

      <div className="pt-3">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-900">
          {brandOptionsMap[product?.brand] || product?.brand}
        </p>
        <h3 className="mt-0.5 line-clamp-1 text-sm text-gray-600">{product?.title}</h3>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">{formatPrice(effectivePrice(product))}</span>
          {off > 0 && <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>}
          {off > 0 && <span className="text-xs font-semibold text-orange-600">({off}% OFF)</span>}
        </div>
        {product?.averageReview > 0 && (
          <div className="mt-1 inline-flex items-center gap-1 rounded bg-green-700 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            {Number(product.averageReview).toFixed(1)}
            <Star className="h-3 w-3 fill-white" />
          </div>
        )}
      </div>
    </Link>
  );
}

export function ProductTileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-lg bg-gray-200" />
      <div className="mt-3 h-3 w-1/3 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-2/3 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-1/4 rounded bg-gray-200" />
    </div>
  );
}

export default ShoppingProductTile;
