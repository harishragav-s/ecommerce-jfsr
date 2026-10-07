import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Field from "@/components/auth/field";
import { registerUser } from "@/store/slices/authSlice";

function AuthRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ userName: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (form.userName.trim().length < 3) e.userName = "At least 3 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (form.password.length < 6) e.password = "At least 6 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { confirm, ...payload } = form; // eslint-disable-line no-unused-vars
    const res = await dispatch(registerUser(payload));
    setLoading(false);
    if (res?.payload?.success) {
      toast({ title: "Account created! Please log in." });
      navigate("/auth/login");
    } else {
      toast({ title: res?.payload?.message || "Registration failed.", variant: "destructive" });
    }
  }

  const set = (k) => (v) => setForm({ ...form, [k]: v });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">It takes less than a minute.</p>
      </div>
      <Field label="Username" autoComplete="username" value={form.userName} error={errors.userName} onChange={set("userName")} />
      <Field label="Email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={set("email")} />
      <Field label="Password" type="password" autoComplete="new-password" value={form.password} error={errors.password} onChange={set("password")} />
      <Field label="Confirm password" type="password" autoComplete="new-password" value={form.confirm} error={errors.confirm} onChange={set("confirm")} />
      <Button type="submit" className="h-11 w-full" disabled={loading}>{loading ? "Creating account..." : "Create account"}</Button>
      <p className="text-center text-sm text-gray-600">
        Already have an account? <Link to="/auth/login" className="font-semibold text-gray-900 underline-offset-4 hover:underline">Log in</Link>
      </p>
    </form>
  );
}

export default AuthRegister;
