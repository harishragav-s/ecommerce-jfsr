import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { fetchAllProducts, addNewProduct, editProduct, deleteProduct } from "@/store/slices/adminProductsSlice";
import { filterOptions, categoryOptionsMap, brandOptionsMap } from "@/config";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import Field from "@/components/auth/field";
import ProductImage from "@/components/common/product-image";
import { formatPrice, getId, discountPercent } from "@/lib/format";

const empty = { image: "", title: "", description: "", category: "", brand: "", price: "", salePrice: "", totalStock: "" };

function Select({ label, value, onChange, options, error }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`h-11 w-full rounded-md border bg-white px-3 text-sm outline-none focus:border-gray-900 ${error ? "border-red-500" : "border-gray-300"}`}>
        <option value="">Select...</option>
        {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function AdminProducts() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { productList, isLoading } = useSelector((s) => s.adminProducts);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const rows = useMemo(
    () =>
      (productList || []).filter(
        (p) => (!cat || p.category === cat) && (!q || `${p.title} ${p.brand}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [productList, q, cat]
  );

  function openAdd() {
    setEditingId(null);
    setForm(empty);
    setErrors({});
    setOpen(true);
  }

  function openEdit(p) {
    setEditingId(getId(p));
    setForm({
      image: p.image || "",
      title: p.title || "",
      description: p.description || "",
      category: p.category || "",
      brand: p.brand || "",
      price: p.price ?? "",
      salePrice: p.salePrice ?? "",
      totalStock: p.totalStock ?? "",
    });
    setErrors({});
    setOpen(true);
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.category) e.category = "Required";
    if (!form.brand) e.brand = "Required";
    if (!(Number(form.price) > 0)) e.price = "Enter a price above 0";
    if (form.salePrice !== "" && Number(form.salePrice) >= Number(form.price)) e.salePrice = "Must be less than price";
    if (form.totalStock === "" || Number(form.totalStock) < 0) e.totalStock = "Enter stock (0 or more)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function save(event) {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      salePrice: form.salePrice === "" ? null : Number(form.salePrice),
      totalStock: Number(form.totalStock),
    };
    const res = await dispatch(editingId ? editProduct({ id: editingId, formData: payload }) : addNewProduct(payload));
    setSaving(false);
    if (res?.payload?.success) {
      dispatch(fetchAllProducts());
      setOpen(false);
      toast({ title: editingId ? "Product updated" : "Product added" });
    } else {
      toast({ title: "Couldn't save. Are you logged in as admin?", variant: "destructive" });
    }
  }

  function remove(p) {
    if (!window.confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    dispatch(deleteProduct(getId(p))).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: "Product deleted" });
      } else {
        toast({ title: "Couldn't delete the product.", variant: "destructive" });
      }
    });
  }

  const set = (k) => (v) => setForm({ ...form, [k]: v });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-gray-500">{rows.length} of {(productList || []).length} products</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" /> Add product</Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or brand" className="h-10 w-full rounded-md border bg-white pl-9 pr-3 text-sm outline-none focus:border-gray-900" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-10 rounded-md border bg-white px-3 text-sm">
          <option value="">All categories</option>
          {filterOptions.category.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading && rows.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-gray-500">Loading...</td></tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-gray-500">No products found.</td></tr>
            )}
            {rows.map((p) => {
              const off = discountPercent(p.price, p.salePrice);
              return (
                <tr key={getId(p)} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage src={p.image} alt={p.title} className="h-12 w-12 shrink-0 rounded" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.title}</p>
                        <p className="text-xs text-gray-500">{brandOptionsMap[p.brand] || p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{categoryOptionsMap[p.category] || p.category}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{formatPrice(off ? p.salePrice : p.price)}</p>
                    {off > 0 && <p className="text-xs text-gray-400"><span className="line-through">{formatPrice(p.price)}</span> -{off}%</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.totalStock === 0 ? "bg-red-100 text-red-700" : p.totalStock < 10 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                      {p.totalStock === 0 ? "Out of stock" : `${p.totalStock} in stock`}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.averageReview > 0 ? `${Number(p.averageReview).toFixed(1)} ★` : "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="rounded p-2 hover:bg-gray-100" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(p)} className="rounded p-2 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4 text-red-500" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editingId ? "Edit product" : "Add product"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-[160px_1fr]" noValidate>
            <ProductImage src={form.image} alt="Image preview" className="aspect-[3/4] w-full rounded-lg border" />
            <div className="space-y-4">
              <Field label="Image URL" placeholder="https://..." value={form.image} onChange={set("image")} />
              <Field label="Title" value={form.title} error={errors.title} onChange={set("title")} />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">Description</span>
                <Textarea value={form.description} onChange={(e) => set("description")(e.target.value)} />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Category" value={form.category} onChange={set("category")} options={filterOptions.category} error={errors.category} />
                <Select label="Brand" value={form.brand} onChange={set("brand")} options={filterOptions.brand} error={errors.brand} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Price (₹)" type="number" value={form.price} error={errors.price} onChange={set("price")} />
                <Field label="Sale price (₹)" type="number" value={form.salePrice} error={errors.salePrice} onChange={set("salePrice")} />
                <Field label="Stock" type="number" value={form.totalStock} error={errors.totalStock} onChange={set("totalStock")} />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Add product"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminProducts;
