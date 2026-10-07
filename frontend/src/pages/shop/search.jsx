import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import ShoppingProductTile, { ProductTileSkeleton } from "@/components/shop/product-tile";
import { getSearchResults, resetSearchResults } from "@/store/slices/searchSlice";
import { getId } from "@/lib/format";

const suggestions = ["Sneakers", "Jeans", "Hoodie", "Dress", "Watch", "Nike", "Zara"];

function SearchProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [keyword, setKeyword] = useState(params.get("keyword") || "");
  const { searchResults, isLoading } = useSelector((s) => s.shopSearch);

  useEffect(() => {
    setKeyword(params.get("keyword") || "");
  }, [params]);

  useEffect(() => {
    const k = keyword.trim();
    if (k.length < 2) {
      dispatch(resetSearchResults());
      return;
    }
    const t = setTimeout(() => {
      dispatch(getSearchResults(k));
      navigate(`/shop/search?keyword=${encodeURIComponent(k)}`, { replace: true });
    }, 350);
    return () => clearTimeout(t);
  }, [keyword, dispatch, navigate]);

  const k = keyword.trim();
  const results = searchResults || [];

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <div className="relative mx-auto mb-8 max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          autoFocus
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search for products, brands and more"
          className="h-14 w-full rounded-full border-2 pl-12 pr-12 text-base outline-none focus:border-gray-900"
        />
        {keyword && (
          <button onClick={() => setKeyword("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900" aria-label="Clear">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {k.length < 2 ? (
        <div className="text-center">
          <p className="mb-4 text-sm text-gray-500">Popular searches</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => setKeyword(s)} className="rounded-full border px-4 py-1.5 text-sm hover:border-gray-900">{s}</button>
            ))}
          </div>
        </div>
      ) : isLoading && results.length === 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <ProductTileSkeleton key={i} />)}
        </div>
      ) : results.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-semibold">No results for "{k}"</p>
          <p className="text-sm text-gray-500">Check the spelling or try a more general term.</p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-gray-500">{results.length} results for "{k}"</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {results.map((p) => <ShoppingProductTile key={getId(p)} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchProducts;
