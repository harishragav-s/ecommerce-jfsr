import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { capturePayment } from "@/store/slices/ordersSlice";

// Kept for the old PayPal redirect flow; the new checkout pays in-page.
function PaypalReturnPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("token") || JSON.parse(sessionStorage.getItem("currentOrderId") || "null");
    if (!orderId) {
      navigate("/shop/checkout");
      return;
    }
    dispatch(capturePayment({ paymentId: params.get("paymentId") || `DEMO-PAYPAL-${Date.now()}`, payerId: params.get("PayerID") || user?.id, orderId })).then((res) => {
      sessionStorage.removeItem("currentOrderId");
      navigate(res?.payload?.success ? `/shop/payment-success?orderId=${orderId}` : "/shop/checkout");
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="flex flex-1 items-center justify-center py-24 text-lg font-medium">Processing payment...</div>;
}

export default PaypalReturnPage;
