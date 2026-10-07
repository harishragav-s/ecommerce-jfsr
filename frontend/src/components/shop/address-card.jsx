import { Home, Pencil, Trash2, Phone } from "lucide-react";

function AddressCard({ addressInfo, selected, onSelect, onEdit, onDelete }) {
  const selectable = typeof onSelect === "function";
  return (
    <div
      onClick={selectable ? () => onSelect(addressInfo) : undefined}
      className={`relative rounded-xl border-2 p-4 transition ${selectable ? "cursor-pointer" : ""} ${
        selected ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"
      }`}
    >
      {selectable && (
        <span className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected ? "border-gray-900" : "border-gray-300"}`}>
          {selected && <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />}
        </span>
      )}
      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
        <Home className="h-3.5 w-3.5" /> Address
      </p>
      <p className="pr-8 text-sm font-medium">{addressInfo.address}</p>
      <p className="text-sm text-gray-600">{addressInfo.city} - {addressInfo.pincode}</p>
      <p className="mt-1 flex items-center gap-1 text-sm text-gray-600"><Phone className="h-3.5 w-3.5" /> {addressInfo.phone}</p>
      {addressInfo.notes && addressInfo.notes !== "No notes" && <p className="mt-1 text-xs text-gray-500">Note: {addressInfo.notes}</p>}
      <div className="mt-3 flex gap-4 border-t pt-3">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(addressInfo); }}
          className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(addressInfo); }}
          className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-3.5 w-3.5" /> Remove
        </button>
      </div>
    </div>
  );
}

export default AddressCard;
