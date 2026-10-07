import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminProductsSlice from "./slices/adminProductsSlice";
import adminOrderSlice from "./slices/adminOrdersSlice";
import adminUsersSlice from "./slices/adminUsersSlice";
import shopWishlistSlice from "./slices/wishlistSlice";

import shopProductsSlice from "./slices/productsSlice";
import shopCartSlice from "./slices/cartSlice";
import shopAddressSlice from "./slices/addressSlice";
import shopOrderSlice from "./slices/ordersSlice";
import shopSearchSlice from "./slices/searchSlice";
import shopReviewSlice from "./slices/reviewsSlice";
import commonFeatureSlice from "./slices/featuresSlice";
import uiSlice from "./slices/uiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    adminUsers: adminUsersSlice,
    shopWishlist: shopWishlistSlice,

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,

    commonFeature: commonFeatureSlice,
    ui: uiSlice,
  },
});

export default store;
