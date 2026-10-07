# Frontend (React + Vite + Redux Toolkit + Tailwind)

```
src/
├── api/          All HTTP calls. client.js is the one axios instance (base URL, cookies).
│                 One file per area: auth, products, cart, orders, addresses, reviews, users, features.
├── store/        Redux state.
│   ├── index.js  Combines the reducers.
│   └── slices/   One slice per area. Each thunk just calls a function from src/api.
├── pages/        One file per screen: auth/, shop/, admin/, not-found/, unauth-page/.
├── components/   shop/ and admin/ (screen parts), auth/, common/, ui/ (buttons, dialogs).
├── hooks/        Reusable hooks, e.g. use-add-to-cart.
├── lib/          Helpers: format.js (₹ prices, dates), utils.js.
├── config/       Form definitions and filter options.
├── App.jsx       Routes.
└── main.jsx      Entry point.
```

## How a request flows
Page → dispatch(thunk in store/slices) → function in api/ → axios client → gateway :8080.

To add an endpoint: add one line in the matching `api/*.js` file, call it from a thunk in the matching slice.

## Run
```
npm install
npm run dev
```
The API address is `http://localhost:8080`. Override it with `VITE_API_URL` in a `.env` file.
