import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "./components/auth/layout";
import ShoppingLayout from "./components/shop/layout";
import AdminLayout from "./components/admin/layout";
import CheckAuth from "./components/common/check-auth";

import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";

import ShoppingHome from "./pages/shop/home";
import ShoppingListing from "./pages/shop/listing";
import ProductPage from "./pages/shop/product";
import ShoppingCheckout from "./pages/shop/checkout";
import ShoppingAccount from "./pages/shop/account";
import ShoppingWishlist from "./pages/shop/wishlist";
import SearchProducts from "./pages/shop/search";
import HelpPage from "./pages/shop/help";
import PaypalReturnPage from "./pages/shop/paypal-return";
import PaymentSuccessPage from "./pages/shop/payment-success";

import AdminDashboard from "./pages/admin/dashboard";
import AdminProducts from "./pages/admin/products";
import AdminOrders from "./pages/admin/orders";
import AdminUsers from "./pages/admin/users";

import NotFound from "./pages/not-found";
import UnauthPage from "./pages/unauth-page";
import { checkAuth } from "@/store/slices/authSlice";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-3xl font-black">STYLE<span className="text-red-500">KART</span></p>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  const guard = (el) => <CheckAuth isAuthenticated={isAuthenticated} user={user}>{el}</CheckAuth>;

  return (
    <Routes>
      <Route path="/" element={guard(null)} />

      <Route path="/auth" element={guard(<AuthLayout />)}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<AuthLogin />} />
        <Route path="register" element={<AuthRegister />} />
      </Route>

      <Route path="/shop" element={guard(<ShoppingLayout />)}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<ShoppingHome />} />
        <Route path="listing" element={<ShoppingListing />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="search" element={<SearchProducts />} />
        <Route path="wishlist" element={<ShoppingWishlist />} />
        <Route path="checkout" element={<ShoppingCheckout />} />
        <Route path="account" element={<ShoppingAccount />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="paypal-return" element={<PaypalReturnPage />} />
        <Route path="payment-success" element={<PaymentSuccessPage />} />
      </Route>

      <Route path="/admin" element={guard(<AdminLayout />)}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      <Route path="/unauth-page" element={<UnauthPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
