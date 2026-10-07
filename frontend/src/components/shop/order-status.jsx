import { Check, X } from "lucide-react";

export const statusMeta = {
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmed", cls: "bg-blue-100 text-blue-800" },
  inProcess: { label: "Processing", cls: "bg-indigo-100 text-indigo-800" },
  inShipping: { label: "Shipped", cls: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", cls: "bg-green-100 text-green-800" },
  rejected: { label: "Cancelled", cls: "bg-red-100 text-red-800" },
};

export function StatusBadge({ status }) {
  const m = statusMeta[status] || { label: status || "Unknown", cls: "bg-gray-100 text-gray-700" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m.cls}`}>{m.label}</span>;
}

const steps = ["pending", "confirmed", "inShipping", "delivered"];

export function OrderTimeline({ status }) {
  if (status === "rejected") {
    return (
      <p className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        <X className="h-4 w-4" /> This order was cancelled.
      </p>
    );
  }
  const idx = Math.max(0, steps.indexOf(status === "inProcess" ? "confirmed" : status));
  const labels = ["Ordered", "Confirmed", "Shipped", "Delivered"];
  return (
    <div className="flex items-start">
      {steps.map((s, i) => (
        <div key={s} className="flex flex-1 flex-col items-center">
          <div className="flex w-full items-center">
            <div className={`h-0.5 flex-1 ${i === 0 ? "invisible" : i <= idx ? "bg-green-600" : "bg-gray-200"}`} />
            <div className={`flex h-7 w-7 items-center justify-center rounded-full ${i <= idx ? "bg-green-600 text-white" : "bg-gray-200 text-gray-400"}`}>
              <Check className="h-4 w-4" />
            </div>
            <div className={`h-0.5 flex-1 ${i === steps.length - 1 ? "invisible" : i < idx ? "bg-green-600" : "bg-gray-200"}`} />
          </div>
          <span className={`mt-2 text-xs ${i <= idx ? "font-semibold text-gray-900" : "text-gray-400"}`}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
