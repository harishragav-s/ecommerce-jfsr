import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ShoppingProductTile, { ProductTileSkeleton } from "@/components/shop/product-tile";
import { fetchAllFilteredProducts } from "@/store/slices/productsSlice";
import { filterOptions, sortOptions, categoryOptionsMap, brandOptionsMap } from "@/config";
import { effectivePrice, getId } from "@/lib/format";

const priceRanges = [
  { id: "0-999", label: "Under ₹999", min: 0, max: 999 },
  { id: "1000-2999", label: "₹1,000 - ₹2,999", min: 1000, max: 2999 },
  { id: "3000-4999", label: "₹3,000 - ₹4,999", min: 3000, max: 4999 },
  { id: "5000-up", label: "₹5,000 & above", min: 5000, max: Infinity },
];

const groups = [
  { key: "category", title: "Category", options: filterOptions.category },
  { key: "brand", title: "Brand", options: filterOptions.brand },
  { key: "price", title: "Price", options: priceRanges },
];

function readList(params, key) {
  const v = params.get(key);
  return v ? v.split(",") : [];
}

function Filters({ params, toggle, clearAll }) {
  const hasAny = groups.some((g) => readList(params, g.key).length > 0);
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold uppercase tracking-wide">Filters</h2>
        {hasAny && (
          <button onClick={clearAll} className="text-xs font-semibold text-red-600 hover:underline">
            Clear all
          </button>
        )}
      </div>
      {groups.map((g) => {
        const selected = readList(params, g.key);
        return (
          <div key={g.key} className="border-t py-4">
            <p className="mb-3 text-sm font-bold uppercase">{g.title}</p>
            <div className="space-y-2.5">
              {g.options.map((opt) => (
                <label key={opt.id} className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-gray-900"
                    checked={selected.includes(opt.id)}
                    onChange={() => toggle(g.key, opt.id)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const { productList, isLoading } = useSelector((s) => s.shopProducts);
  const [mobileFilters, setMobileFilters] = useState(false);

  const categoryParam = params.get("category") || "";
  const brandParam = params.get("brand") || "";
  const sort = params.get("sort") || "price-lowtohigh";
  const priceSel = readList(params, "price");

  useEffect(() => {
    const filterParams = {};
    if (categoryParam) filterParams.category = categoryParam;
    if (brandParam) filterParams.brand = brandParam;
    dispatch(fetchAllFilteredProducts({ filterParams, sortParams: sort }));
  }, [dispatch, categoryParam, brandParam, sort]);

  const products = useMemo(() => {
    const list = productList || [];
    if (priceSel.length === 0) return list;
    const ranges = priceRanges.filter((r) => priceSel.includes(r.id));
    return list.filter((p) => ranges.some((r) => effectivePrice(p) >= r.min && effectivePrice(p) <= r.max));
  }, [productList, priceSel.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  function update(mutator) {
    const next = new URLSearchParams(params);
    mutator(next);
    setParams(next);
  }

  function toggle(key, value) {
    update((next) => {
      const list = readList(next, key);
      const updated = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      updated.length ? next.set(key, updated.join(",")) : next.delete(key);
    });
  }

  function clearAll() {
    update((next) => groups.forEach((g) => next.delete(g.key)));
  }

  const chips = groups.flatMap((g) =>
    readList(params, g.key).map((v) => ({
      key: g.key,
      value: v,
      label:
        g.key === "category"
          ? categoryOptionsMap[v]
          : g.key === "brand"
          ? brandOptionsMap[v]
          : priceRanges.find((r) => r.id === v)?.label,
    }))
  );

  const title =
    readList(params, "category").length === 1 ? categoryOptionsMap[readList(params, "category")[0]] : "All products";

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500">{isLoading ? "Loading..." : `${products.length} items`}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 lg:hidden" onClick={() => setMobileFilters(true)}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden text-gray-500 sm:inline">Sort by</span>
            <select
              value={sort}
              onChange={(e) => update((next) => next.set("sort", e.target.value))}
              className="rounded-md border bg-white px-3 py-2 text-sm font-medium outline-none focus:border-gray-900"
            >
              {sortOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={`${c.key}-${c.value}`}
              onClick={() => toggle(c.key, c.value)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium hover:border-gray-900"
            >
              {c.label}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <Filters params={params} toggle={toggle} clearAll={clearAll} />
        </aside>

        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductTileSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-dashed py-20 text-center">
              <p className="text-lg font-semibold">No products match these filters</p>
              <p className="mb-6 text-sm text-gray-500">Try removing a filter or two.</p>
              <Button onClick={clearAll}>Clear filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ShoppingProductTile key={getId(p)} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Sheet open={mobileFilters} onOpenChange={setMobileFilters}>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="sr-only">Filters</SheetTitle>
          </SheetHeader>
          <Filters params={params} toggle={toggle} clearAll={clearAll} />
          <Button className="mt-4 w-full" onClick={() => setMobileFilters(false)}>
            Show {products.length} items
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default ShoppingListing;
