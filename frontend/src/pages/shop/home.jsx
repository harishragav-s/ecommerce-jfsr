import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Truck, RotateCcw, ShieldCheck, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAllFilteredProducts } from "@/store/slices/productsSlice";
import ShoppingProductTile, { ProductTileSkeleton } from "@/components/shop/product-tile";
import { getId } from "@/lib/format";

const IMG = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const slides = [
  {
    image: IMG("1441986300917-64674bd600d8"),
    eyebrow: "New season",
    title: "Fresh styles, handpicked for you",
    text: "The latest drops from Nike, Adidas, Zara and more.",
    cta: "Shop the collection",
    to: "/shop/listing",
  },
  {
    image: IMG("1460353581641-37baddab0fa2"),
    eyebrow: "Up to 25% off",
    title: "Sneakers that move with you",
    text: "Running, training and everyday classics on sale now.",
    cta: "Shop footwear",
    to: "/shop/listing?category=footwear",
  },
  {
    image: IMG("1483985988355-763728e1935b"),
    eyebrow: "Women's edit",
    title: "Effortless looks for every day",
    text: "Dresses, blazers and knitwear you'll wear on repeat.",
    cta: "Shop women",
    to: "/shop/listing?category=women",
  },
];

const categories = [
  { id: "men", label: "Men", image: IMG("1617137968427-85924c800a22", 600) },
  { id: "women", label: "Women", image: IMG("1515886657613-9f3515b0c78f", 600) },
  { id: "kids", label: "Kids", image: IMG("1503944583220-79d8926ad5e2", 600) },
  { id: "footwear", label: "Footwear", image: IMG("1542291026-7eec264c27ff", 600) },
  { id: "accessories", label: "Accessories", image: IMG("1523275335684-37898b6baf30", 600) },
];

const brands = [
  { id: "nike", label: "Nike", tag: "Just do it" },
  { id: "adidas", label: "Adidas", tag: "Impossible is nothing" },
  { id: "puma", label: "Puma", tag: "Forever faster" },
  { id: "levi", label: "Levi's", tag: "Quality never goes out of style" },
  { id: "zara", label: "Zara", tag: "Latest trends" },
  { id: "h&m", label: "H&M", tag: "Fashion & quality" },
];

const perks = [
  { icon: Truck, title: "Free delivery", text: "On orders above ₹999" },
  { icon: RotateCcw, title: "Easy returns", text: "30-day return policy" },
  { icon: ShieldCheck, title: "Secure payments", text: "100% protected checkout" },
  { icon: Headphones, title: "24/7 support", text: "We're here to help" },
];

function ShoppingHome() {
  const [current, setCurrent] = useState(0);
  const { productList, isLoading } = useSelector((s) => s.shopProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setCurrent((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-hightolow" }));
  }, [dispatch]);

  const all = productList || [];
  const trending = all.slice(0, 8);
  const deals = [...all]
    .filter((p) => p.salePrice > 0 && p.salePrice < p.price)
    .sort((a, b) => (b.price - b.salePrice) / b.price - (a.price - a.salePrice) / a.price)
    .slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[480px] w-full overflow-hidden md:h-[580px]">
        {slides.map((slide, i) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <img src={slide.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-xl text-white">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-300">{slide.eyebrow}</p>
                  <h1 className="mb-4 text-4xl font-bold leading-tight md:text-6xl">{slide.title}</h1>
                  <p className="mb-8 text-lg text-white/85">{slide.text}</p>
                  <div className="flex flex-wrap gap-3">
                    <Button size="lg" className="gap-2 bg-white text-gray-900 hover:bg-gray-100" onClick={() => navigate(slide.to)}>
                      {slide.cta} <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
                      onClick={() => navigate("/shop/listing")}
                    >
                      Browse all
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button aria-label="Previous" onClick={() => setCurrent((s) => (s - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button aria-label="Next" onClick={() => setCurrent((s) => (s + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white">
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-white" : "w-2 bg-white/50"}`} />
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="border-b">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-6 py-6 md:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon className="h-8 w-8 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-gray-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-14">
        <div className="container mx-auto px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Shop by category</h2>
            <button onClick={() => navigate("/shop/listing")} className="text-sm font-semibold hover:underline">View all</button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {categories.map((c) => (
              <button key={c.id} onClick={() => navigate(`/shop/listing?category=${c.id}`)} className="group relative aspect-[3/4] overflow-hidden rounded-xl">
                <img src={c.image} alt={c.label} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-4 left-4 text-lg font-bold text-white">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Deals */}
      {deals.length > 0 && (
        <section className="bg-red-50 py-14">
          <div className="container mx-auto px-6">
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-widest text-red-600">Deal of the day</p>
              <h2 className="text-2xl font-bold md:text-3xl">Biggest discounts right now</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-6">
              {deals.map((p) => <ShoppingProductTile key={getId(p)} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      <section className="py-14">
        <div className="container mx-auto px-6">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">Top brands</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => navigate(`/shop/listing?brand=${encodeURIComponent(b.id)}`)}
                className="flex h-28 flex-col items-center justify-center rounded-xl border bg-white px-2 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-2xl font-black tracking-tight">{b.label}</span>
                <span className="mt-1 text-center text-[11px] text-gray-500">{b.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="pb-14">
        <div className="container mx-auto px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Trending now</h2>
            <button onClick={() => navigate("/shop/listing")} className="text-sm font-semibold hover:underline">See everything</button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {isLoading && trending.length === 0
              ? Array.from({ length: 8 }).map((_, i) => <ProductTileSkeleton key={i} />)
              : trending.map((p) => <ShoppingProductTile key={getId(p)} product={p} />)}
          </div>
          {!isLoading && trending.length === 0 && (
            <div className="rounded-xl border border-dashed p-12 text-center text-gray-500">No products yet. Make sure product-service is running.</div>
          )}
        </div>
      </section>

      {/* Promo */}
      <section className="pb-14">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl">
            <img src={IMG("1490481651871-ab68de25d43d")} alt="" className="h-72 w-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-start justify-center bg-black/50 px-8 text-white md:px-16">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-300">Limited time</p>
              <h3 className="mb-4 text-3xl font-bold md:text-4xl">Accessories starting at ₹449</h3>
              <Button className="bg-white text-gray-900 hover:bg-gray-100" onClick={() => navigate("/shop/listing?category=accessories")}>
                Shop accessories
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoppingHome;
