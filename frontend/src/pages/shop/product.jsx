import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Minus, Plus, ShoppingBag, Truck, RotateCcw, ShieldCheck, ChevronRight, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ProductImage from "@/components/common/product-image";
import StarRatingComponent from "@/components/common/star-rating";
import ShoppingProductTile from "@/components/shop/product-tile";
import { fetchProductDetails, fetchAllFilteredProducts, setProductDetails } from "@/store/slices/productsSlice";
import { addReview, getReviews } from "@/store/slices/reviewsSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { formatPrice, getId, discountPercent, effectivePrice, formatDate } from "@/lib/format";

function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const addToCart = useAddToCart();
  const { productDetails: product, productList, isLoading } = useSelector((s) => s.shopProducts);
  const { reviews } = useSelector((s) => s.shopReview);
  const { user } = useSelector((s) => s.auth);
  const wishlisted = useSelector((s) => s.shopWishlist.items.some((p) => p.id === id));

  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewMsg, setReviewMsg] = useState("");

  useEffect(() => {
    setQty(1);
    setDeliveryMsg("");
    dispatch(fetchProductDetails(id));
    dispatch(getReviews(id));
    window.scrollTo(0, 0);
    return () => dispatch(setProductDetails());
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.category) {
      dispatch(fetchAllFilteredProducts({ filterParams: { category: [product.category] }, sortParams: "price-lowtohigh" }));
    }
  }, [dispatch, product?.category]);

  if (!product) {
    return (
      <div className="container mx-auto grid gap-10 px-4 py-10 md:grid-cols-2">
        <div className="aspect-[3/4] animate-pulse rounded-xl bg-gray-200" />
        <div className="space-y-4">
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
          {!isLoading && <p className="pt-6 text-gray-500">This product could not be found.</p>}
        </div>
      </div>
    );
  }

  const off = discountPercent(product.price, product.salePrice);
  const price = effectivePrice(product);
  const outOfStock = product.totalStock === 0;
  const related = (productList || []).filter((p) => getId(p) !== id).slice(0, 4);
  const avg = reviews?.length ? reviews.reduce((s, r) => s + r.reviewValue, 0) / reviews.length : 0;

  async function handleAdd(buyNow) {
    const ok = await addToCart(id, product.totalStock, qty);
    if (ok && buyNow) navigate("/shop/checkout");
  }

  function checkDelivery() {
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryMsg("Enter a valid 6-digit pincode.");
      return;
    }
    const date = new Date();
    date.setDate(date.getDate() + 4);
    setDeliveryMsg(`Delivery by ${formatDate(date)} to ${pincode}`);
  }

  function submitReview() {
    if (!rating) {
      toast({ title: "Please choose a star rating.", variant: "destructive" });
      return;
    }
    dispatch(
      addReview({ productId: id, userId: user?.id, userName: user?.userName, reviewMessage: reviewMsg, reviewValue: rating })
    ).then((res) => {
      if (res?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(id));
        dispatch(fetchProductDetails(id));
        toast({ title: "Thanks for your review!" });
      } else {
        toast({
          title: "Only customers who have bought this product can review it, once.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link to="/shop/home" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/shop/listing?category=${product.category}`} className="hover:text-gray-900">
          {categoryOptionsMap[product.category] || product.category}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="line-clamp-1 text-gray-900">{product.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl bg-gray-100 md:sticky md:top-28 md:h-fit">
          <ProductImage src={product.image} alt={product.title} className="aspect-[3/4] w-full" />
          {off > 0 && (
            <span className="absolute left-4 top-4 rounded bg-red-600 px-3 py-1 text-sm font-bold text-white">-{off}%</span>
          )}
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">{brandOptionsMap[product.brand] || product.brand}</p>
          <h1 className="mt-1 text-2xl font-semibold md:text-3xl">{product.title}</h1>

          {reviews?.length > 0 && (
            <a href="#reviews" className="mt-3 inline-flex items-center gap-2 rounded border px-2 py-1 text-sm">
              <span className="font-semibold">{avg.toFixed(1)}</span>
              <StarRatingComponent rating={avg} size="sm" />
              <span className="text-gray-500">| {reviews.length} ratings</span>
            </a>
          )}

          <div className="mt-5 border-t pt-5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(price)}</span>
              {off > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">MRP {formatPrice(product.price)}</span>
                  <span className="text-lg font-semibold text-orange-600">({off}% OFF)</span>
                </>
              )}
            </div>
            <p className="mt-1 text-sm text-green-700">Inclusive of all taxes</p>
          </div>

          <p className={`mt-4 text-sm font-semibold ${outOfStock ? "text-red-600" : product.totalStock < 10 ? "text-amber-600" : "text-green-700"}`}>
            {outOfStock ? "Out of stock" : product.totalStock < 10 ? `Hurry, only ${product.totalStock} left!` : "In stock"}
          </p>

          {!outOfStock && (
            <div className="mt-5 flex items-center gap-4">
              <span className="text-sm font-semibold">Quantity</span>
              <div className="flex items-center rounded-md border">
                <button className="p-2.5 disabled:opacity-40" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)} aria-label="Decrease">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button
                  className="p-2.5 disabled:opacity-40"
                  disabled={qty >= product.totalStock}
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button size="lg" className="flex-1 gap-2" disabled={outOfStock} onClick={() => handleAdd(false)}>
              <ShoppingBag className="h-5 w-5" />
              Add to bag
            </Button>
            <Button size="lg" variant="outline" className="flex-1" disabled={outOfStock} onClick={() => handleAdd(true)}>
              Buy now
            </Button>
            <Button
              size="lg"
              variant="outline"
              aria-label="Wishlist"
              onClick={() => dispatch(toggleWishlist(product))}
            >
              <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>

          {/* Delivery check */}
          <div className="mt-8 rounded-xl border p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4" /> Delivery options
            </p>
            <div className="flex gap-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter pincode"
                className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-gray-900"
              />
              <Button variant="outline" onClick={checkDelivery}>Check</Button>
            </div>
            {deliveryMsg && <p className="mt-2 text-sm text-gray-700">{deliveryMsg}</p>}
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><Truck className="h-4 w-4" /> Free delivery on orders above ₹999</li>
              <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4" /> Easy 30-day returns and exchanges</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> 100% original products</li>
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="mb-2 font-semibold">Product details</h2>
            <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-gray-500">Brand</dt>
              <dd>{brandOptionsMap[product.brand] || product.brand}</dd>
              <dt className="text-gray-500">Category</dt>
              <dd>{categoryOptionsMap[product.category] || product.category}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section id="reviews" className="mt-16 grid gap-10 border-t pt-10 md:grid-cols-[300px_1fr]">
        <div>
          <h2 className="text-xl font-bold">Ratings & reviews</h2>
          {reviews?.length > 0 ? (
            <div className="mt-4">
              <p className="text-5xl font-bold">{avg.toFixed(1)}</p>
              <StarRatingComponent rating={avg} />
              <p className="mt-1 text-sm text-gray-500">{reviews.length} verified buyers</p>
              <div className="mt-4 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => Math.round(r.reviewValue) === star).length;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3">{star}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full bg-green-600" style={{ width: `${(count / reviews.length) * 100}%` }} />
                      </div>
                      <span className="w-4 text-gray-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">No reviews yet.</p>
          )}

          <div className="mt-8 rounded-xl border p-4">
            <p className="mb-2 text-sm font-semibold">Rate this product</p>
            <StarRatingComponent rating={rating} handleRatingChange={setRating} />
            <Textarea
              className="mt-3"
              placeholder="Share what you liked or didn't (optional)"
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
            />
            <Button className="mt-3 w-full" onClick={submitReview}>Submit review</Button>
          </div>
        </div>

        <div className="divide-y">
          {(reviews || []).map((r) => (
            <div key={r.id || r._id} className="py-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-green-700 px-1.5 py-0.5 text-xs font-bold text-white">
                  {r.reviewValue} ★
                </span>
                <span className="text-sm font-semibold">{r.userName}</span>
                <span className="flex items-center gap-1 text-xs text-gray-500"><Check className="h-3 w-3" /> Verified buyer</span>
              </div>
              {r.reviewMessage && <p className="mt-2 text-sm text-gray-700">{r.reviewMessage}</p>}
              {r.createdAt && <p className="mt-1 text-xs text-gray-400">{formatDate(r.createdAt)}</p>}
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16 border-t pt-10">
          <h2 className="mb-6 text-xl font-bold">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {related.map((p) => (
              <ShoppingProductTile key={getId(p)} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductPage;
