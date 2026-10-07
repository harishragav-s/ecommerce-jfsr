import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import Field from "../auth/field";
import AddressCard from "./address-card";
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from "@/store/slices/addressSlice";
import { getId } from "@/lib/format";

const empty = { address: "", city: "", pincode: "", phone: "", notes: "" };

function Address({ selectedId, setCurrentSelectedAddress }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((s) => s.auth);
  const { addressList, isLoading } = useSelector((s) => s.shopAddress);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  const list = addressList || [];

  useEffect(() => {
    if (user?.id) dispatch(fetchAllAddresses(user.id));
  }, [dispatch, user?.id]);

  // In checkout, pre-select the first address so the user can pay straight away
  useEffect(() => {
    if (setCurrentSelectedAddress && !selectedId && list.length > 0) setCurrentSelectedAddress(list[0]);
  }, [list, selectedId, setCurrentSelectedAddress]);

  function openNew() {
    setEditingId(null);
    setForm(empty);
    setErrors({});
    setOpen(true);
  }

  function openEdit(a) {
    setEditingId(getId(a));
    setForm({ address: a.address, city: a.city, pincode: a.pincode, phone: a.phone, notes: a.notes === "No notes" ? "" : a.notes || "" });
    setErrors({});
    setOpen(true);
  }

  function validate() {
    const e = {};
    if (form.address.trim().length < 5) e.address = "Enter house no., street and area";
    if (!form.city.trim()) e.city = "Enter a city";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "6-digit pincode";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "10-digit mobile number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function save(event) {
    event.preventDefault();
    if (!validate()) return;
    const data = { ...form, notes: form.notes.trim() || "No notes" };
    const res = editingId
      ? await dispatch(editaAddress({ userId: user?.id, addressId: editingId, formData: data }))
      : await dispatch(addNewAddress({ ...data, userId: user?.id }));

    if (res?.payload?.success) {
      await dispatch(fetchAllAddresses(user?.id));
      if (setCurrentSelectedAddress && res.payload.data) setCurrentSelectedAddress(res.payload.data);
      setOpen(false);
      toast({ title: editingId ? "Address updated" : "Address saved" });
    } else {
      toast({ title: "Couldn't save the address. Please try again.", variant: "destructive" });
    }
  }

  function remove(a) {
    if (!window.confirm("Remove this address?")) return;
    dispatch(deleteAddress({ userId: user?.id, addressId: getId(a) })).then((res) => {
      if (res?.payload?.success) {
        if (setCurrentSelectedAddress && getId(selectedId) === getId(a)) setCurrentSelectedAddress(null);
        dispatch(fetchAllAddresses(user?.id));
        toast({ title: "Address removed" });
      }
    });
  }

  const set = (k) => (v) => setForm({ ...form, [k]: k === "pincode" || k === "phone" ? v.replace(/\D/g, "").slice(0, k === "pincode" ? 6 : 10) : v });

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {isLoading && list.length === 0 && <div className="h-40 animate-pulse rounded-xl bg-gray-100" />}
        {list.map((a) => (
          <AddressCard
            key={getId(a)}
            addressInfo={a}
            selected={setCurrentSelectedAddress ? getId(selectedId) === getId(a) : false}
            onSelect={setCurrentSelectedAddress}
            onEdit={openEdit}
            onDelete={remove}
          />
        ))}
        <button
          type="button"
          onClick={openNew}
          className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-600 transition hover:border-gray-900 hover:text-gray-900"
        >
          <Plus className="h-6 w-6" />
          Add new address
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit address" : "Add a new address"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4" noValidate>
            <Field label="House no., street, area" value={form.address} error={errors.address} onChange={set("address")} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" value={form.city} error={errors.city} onChange={set("city")} />
              <Field label="Pincode" value={form.pincode} error={errors.pincode} onChange={set("pincode")} />
            </div>
            <Field label="Mobile number" value={form.phone} error={errors.phone} onChange={set("phone")} />
            <Field label="Landmark / delivery notes (optional)" value={form.notes} onChange={set("notes")} />
            <Button type="submit" className="w-full">{editingId ? "Save changes" : "Save address"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Address;
