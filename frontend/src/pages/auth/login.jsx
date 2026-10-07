import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Field from "@/components/auth/field";
import { loginUser } from "@/store/slices/authSlice";

function AuthLogin() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Enter your password";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const res = await dispatch(loginUser(form));
    setLoading(false);
    if (res?.payload?.success) {
      toast({ title: `Welcome back, ${res.payload.user?.userName}!` });
    } else {
      toast({ title: res?.payload?.message || "Login failed. Is the backend running?", variant: "destructive" });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">Log in to track orders and check out faster.</p>
      </div>
      <Field label="Email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(v) => setForm({ ...form, email: v })} />
      <Field label="Password" type="password" autoComplete="current-password" value={form.password} error={errors.password} onChange={(v) => setForm({ ...form, password: v })} />
      <Button type="submit" className="h-11 w-full" disabled={loading}>{loading ? "Signing in..." : "Log in"}</Button>
      <p className="text-center text-sm text-gray-600">
        New here? <Link to="/auth/register" className="font-semibold text-gray-900 underline-offset-4 hover:underline">Create an account</Link>
      </p>
      <p className="rounded-md bg-gray-50 px-3 py-2 text-center text-xs text-gray-500">
        Demo admin: admin@ecommerce.com / Admin@123
      </p>
    </form>
  );
}

export default AuthLogin;
