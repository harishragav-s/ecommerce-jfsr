import { CheckCircle2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const cod = params.get("method") === "cod";
  const eta = new Date();
  eta.setDate(eta.getDate() + 4);

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-20">
      <div className="w-full max-w-md rounded-2xl border bg-white p-10 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 className="mb-2 text-2xl font-bold">{cod ? "Order placed!" : "Payment successful!"}</h1>
        <p className="mb-2 text-gray-600">{cod ? "Pay in cash when your order arrives." : "Thank you! Your order is confirmed."}</p>
        <p className="mb-6 text-sm font-medium">Expected delivery by {formatDate(eta)}</p>
        {orderId && <p className="mb-8 rounded-lg bg-gray-50 px-4 py-3 font-mono text-xs text-gray-600">Order #{orderId}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" onClick={() => navigate("/shop/account?tab=orders")}>Track order</Button>
          <Button variant="outline" className="flex-1" onClick={() => navigate("/shop/home")}>Keep shopping</Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
