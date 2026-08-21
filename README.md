# ShopSphere — E-Commerce Frontend Capstone

A fully functional, responsive e-commerce frontend built with React. Users can browse a live product catalog, filter and sort items, view product details, manage a persistent shopping cart, simulate login/registration, and complete a validated checkout flow.

**Live demo:** _add your deployed URL here after running the deployment steps below_

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Setup Instructions](#2-setup-instructions)
3. [Code Structure](#3-code-structure)
4. [Component Architecture & Data Flow](#4-component-architecture--data-flow)
5. [State Management Approach](#5-state-management-approach)
6. [API Integration Details](#6-api-integration-details)
7. [Technical Details](#7-technical-details)
8. [Performance Optimizations](#8-performance-optimizations)
9. [Testing Evidence](#9-testing-evidence)
10. [Visual Documentation](#10-visual-documentation)
11. [Deployment Steps](#11-deployment-steps)
12. [Challenges Faced](#12-challenges-faced)

---

## 1. Project Overview

**Goal:** Bring together the core frontend concepts from the course — component design, routing, state management, API integration, forms, and performance — into one cohesive, production-shaped application.

**What it does:**
- Lists live products pulled from [FakeStoreAPI](https://fakestoreapi.com), with search, category filtering, and sorting.
- Lets users view full product details and add items to a cart.
- Persists the cart across page reloads and browser sessions via Local Storage.
- Simulates authentication (login/register) using Local Storage, with a protected checkout route.
- Runs a validated multi-field checkout form and confirms a simulated order.
- Is optimized with route-based code splitting, lazy image loading, skeleton loading states, and an error boundary.

**Objectives it satisfies:**
- Responsive design that works from mobile through desktop.
- Modern routing with React Router v6, including a protected route.
- Global state via the Context API (no prop drilling for cart/auth).
- Real API integration with graceful loading and error states.
- Form validation with inline, field-level feedback.
- Deployable as a static site to Netlify or Vercel.

---

## 2. Setup Instructions

### Prerequisites
- Node.js 16+ and npm 8+

### Install & Run Locally

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd ecommerce-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app runs at `http://localhost:3000`.

### Other Scripts

```bash
npm run build   # Production build → /build
npm test        # Run the Jest/React Testing Library test suite
```

### Demo Login Credentials

The login form works two ways:
- **Real FakeStoreAPI credentials:** username `mor_2314`, password `83r5^_`
- **Simulated fallback:** any username (3+ characters) and password (4+ characters) will log you in locally — useful since FakeStoreAPI only recognizes a handful of seeded accounts.

### Note on `.env`

The repo includes a `.env` with `DISABLE_ESLINT_PLUGIN=true`. This works around a known `react-scripts@5.0.1` dependency-resolution conflict with newer ESLint versions (`Environment key "jest/globals" is unknown`) that can surface depending on how npm hoists transitive packages. If your local `npm install` resolves cleanly without it, feel free to delete that line — it's not required for the app's logic.

---

## 3. Code Structure

```
ecommerce-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar/            # Site navigation, cart badge, auth state
│   │   ├── ProductList/       # Grid + search/filter/sort controls
│   │   ├── ProductCard/       # Individual product tile
│   │   ├── Cart/              # CartItem row + CartSummary panel
│   │   ├── Checkout/          # CheckoutForm (validation) + OrderReview
│   │   ├── ProtectedRoute/    # Route guard for authenticated pages
│   │   └── ErrorBoundary/     # Catches render errors gracefully
│   ├── pages/
│   │   ├── Home.js            # Product catalog page
│   │   ├── ProductDetail.js   # Single product page
│   │   ├── CartPage.js        # Cart review page
│   │   ├── CheckoutPage.js    # Checkout flow (protected)
│   │   ├── Login.js
│   │   └── Register.js
│   ├── contexts/
│   │   ├── CartContext.js     # Cart state (useReducer + Local Storage)
│   │   └── AuthContext.js     # Simulated auth state
│   ├── hooks/
│   │   └── useProducts.js     # Fetch + filter/sort logic for the catalog
│   ├── services/
│   │   └── api.js             # All FakeStoreAPI calls, centralized
│   ├── styles/
│   │   └── index.css          # Global styles & design tokens
│   ├── App.js                 # Routes, providers, lazy-loaded pages
│   ├── index.js                # React DOM entry point
│   └── reportWebVitals.js
├── netlify.toml
├── vercel.json
├── package.json
└── README.md
```

---

## 4. Component Architecture & Data Flow

```
                              ┌────────────────┐
                              │     App.js      │
                              │ (Router+Providers)│
                              └────────┬────────┘
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
            ┌───────▼──────┐   ┌────────▼────────┐  ┌───────▼───────┐
            │  AuthProvider │   │   CartProvider   │  │    Navbar      │
            │  (Context)    │   │   (Context)      │  │ (reads Cart +  │
            └───────┬───────┘   └────────┬─────────┘  │  Auth context) │
                    │                    │             └────────────────┘
        ┌───────────┼────────────────────┼───────────────┐
        │            │                    │               │
  ┌─────▼─────┐ ┌────▼─────┐  ┌───────────▼──────┐  ┌─────▼──────┐
  │   Home     │ │ Product   │  │    CartPage      │  │ CheckoutPage│
  │(useProducts│ │ Detail    │  │ (CartItem list + │  │ (Protected; │
  │ → api.js)  │ │(api.js)   │  │  CartSummary)    │  │ CheckoutForm│
  └─────┬──────┘ └────┬─────┘  └──────────────────┘  │ +OrderReview│
        │             │                               └─────────────┘
  ┌─────▼──────┐ ┌────▼─────┐
  │ ProductList │ │ Add to   │
  │ → Product   │ │ Cart btn │
  │ Card ×N     │ │ (Cart     │
  └─────────────┘ │ Context)  │
                   └───────────┘
```

**Data flow summary:**
1. `useProducts` fetches the catalog and categories from `services/api.js`, then applies client-side search/filter/sort — this logic lives in one hook so `Home` stays presentational.
2. `CartContext` is the single source of truth for cart contents. Any component (`ProductCard`, `ProductDetail`, `CartPage`, `Navbar`) reads or dispatches to it via `useContext`, so the cart badge, cart page, and checkout summary all stay in sync automatically.
3. `AuthContext` gates the `/checkout` route through `ProtectedRoute`, redirecting unauthenticated users to `/login` and returning them to checkout after a successful login (via React Router's `location.state`).
4. Form state (`CheckoutForm`, `Login`, `Register`) is local `useState`, since it's transient and doesn't need to be shared beyond the immediate page.

---

## 5. State Management Approach

**Context API + `useReducer`** was chosen over Redux for this app's scope:

- **`CartContext`** uses `useReducer` with actions (`ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`, `HYDRATE`) — this gives Redux-like predictability (pure reducer function, explicit action types) without the extra dependency and boilerplate. State is synced to `localStorage` in a `useEffect` on every change, and re-hydrated lazily on mount via `useReducer`'s lazy initializer.
- **`AuthContext`** uses plain `useState` since auth has fewer, simpler transitions (logged in/out) and doesn't benefit as much from a reducer.
- **Derived values** (`totalItems`, `totalPrice`) are computed with `useMemo` inside `CartProvider` rather than stored redundantly in state, avoiding sync bugs.
- **Local component state** (`useState`) is used for anything that doesn't need to be shared: form inputs, loading/error flags on a single page, quantity selectors, etc.

This keeps global state limited to genuinely global concerns (cart, auth) while everything else stays local and easy to reason about.

---

## 6. API Integration Details

All external calls are centralized in `src/services/api.js`, which wraps `fetch` against [FakeStoreAPI](https://fakestoreapi.com):

| Function | Endpoint | Used by |
|---|---|---|
| `getAllProducts()` | `GET /products` | `useProducts` (catalog) |
| `getAllCategories()` | `GET /products/categories` | `useProducts` (filter dropdown) |
| `getProductById(id)` | `GET /products/:id` | `ProductDetail` |
| `loginUser(username, password)` | `POST /auth/login` | `AuthContext.login` |
| `createOrder(userId, products)` | `POST /carts` | `CheckoutPage` (simulated order) |

Each call goes through a shared `request()` helper that checks `response.ok`, throws on failure, and logs the error — every consumer (`useProducts`, `ProductDetail`, `AuthContext`) catches that error and surfaces a user-facing message with a retry option rather than a blank screen.

**Why FakeStoreAPI:** it's a free, no-auth-required REST API purpose-built for e-commerce demos (products, categories, a login endpoint, and a carts endpoint), which let the project focus on frontend concerns without standing up a backend.

---

## 7. Technical Details

- **Routing:** React Router v6 (`BrowserRouter`, `Routes`, nested `Route` elements, `useParams`, `useNavigate`, `useLocation`, and a custom `ProtectedRoute` wrapper using `<Navigate>`).
- **Filtering/sorting algorithm:** `useProducts` runs filtering (category, search substring match) and sorting (price asc/desc, rating) inside a single `useMemo`, recomputed only when `products`, `selectedCategory`, `sortBy`, or `searchTerm` change — avoiding recomputation on unrelated re-renders.
- **Cart merge logic:** adding a product already in the cart increments its `quantity` rather than pushing a duplicate row — implemented as a lookup (`state.items.find`) inside the reducer's `ADD_ITEM` case.
- **Form validation:** `CheckoutForm` validates on blur and on submit using regex checks (email format, ZIP length, card number length, `MM/YY` expiry format, CVV length), tracking `touched` fields separately from `errors` so messages don't appear before a user has interacted with a field.
- **Persistence:** both cart and auth state serialize to `localStorage` as JSON, with `try/catch` around all reads/writes to tolerate corrupted or missing data (e.g., private browsing mode).

---

## 8. Performance Optimizations

- **Route-based code splitting:** every page (`Home`, `ProductDetail`, `CartPage`, `CheckoutPage`, `Login`, `Register`) is loaded via `React.lazy()` + `Suspense`, so the initial bundle only ships the code needed for the first paint. Verified in the production build — each route compiles to its own chunk file rather than one monolithic bundle.
- **Lazy image loading:** product images use `loading="lazy"` so off-screen images don't block initial page load.
- **Memoized derived state:** `useMemo` for cart totals and filtered/sorted product lists avoids recalculating on every render.
- **Skeleton loading states:** the product grid shows animated placeholder cards while data loads, instead of a blocking spinner, to reduce perceived latency.
- **Error boundary:** wraps the routed content so a render error in one page doesn't blank the entire app.

---

## 9. Testing Evidence

The suite uses Jest + React Testing Library (`npm test`). 11 tests across 3 suites, all passing:

```
PASS src/contexts/CartContext.test.js
PASS src/components/Checkout/CheckoutForm.test.js
PASS src/components/ProductCard/ProductCard.test.js

Test Suites: 3 passed, 3 total
Tests:       11 passed, 11 total
```

**What's covered:**
- **`CartContext.test.js`** — empty-cart initial state; adding an item updates totals; adding the same item twice increments quantity instead of duplicating; removing an item clears it; cart state is written to `localStorage`.
- **`ProductCard.test.js`** — renders title/price/category correctly; "Add to Cart" shows an `Adding…` → `Added ✓` transition; links to the correct `/product/:id` route.
- **`CheckoutForm.test.js`** — empty submission surfaces required-field errors and blocks `onSubmit`; invalid email format is caught; a fully valid form calls `onSubmit` with the correct data.

The production build was also verified end-to-end with `npm run build`, confirming a clean compile with per-route code-split chunks (see Performance Optimizations above).

---

## 10. Visual Documentation

_Add screenshots here after running the app locally (`npm start`) or viewing the deployed link:_

- [ ] Home page — product grid with filters
- [ ] Product detail page
- [ ] Cart page with items
- [ ] Checkout form (including a validation-error state)
- [ ] Order confirmation screen
- [ ] Mobile view of the home page (narrow viewport)

---

## 11. Deployment Steps

### Option A — Vercel
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Framework preset: **Create React App** (auto-detected). Build command `npm run build`, output directory `build`.
4. Deploy. The included `vercel.json` rewrites all routes to `index.html` so client-side routing works on refresh.

### Option B — Netlify
1. Push this repository to GitHub.
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**.
3. Build command: `npm run build`. Publish directory: `build`. (Both are already set in `netlify.toml`.)
4. Deploy. The `[[redirects]]` rule in `netlify.toml` handles client-side routing the same way.

### Option C — Manual/CLI
```bash
npm run build
npx serve -s build      # sanity-check locally
# then drag the /build folder into Netlify's manual deploy UI,
# or run: npx vercel --prod
```

---

## 12. Challenges Faced

- **Cart/auth state without Redux:** deciding how much global state was actually needed. Using `useReducer` inside Context for the cart (rather than plain `useState`) gave Redux-like predictability for merge/quantity logic without adding a dependency, while auth stayed simple `useState` since it has far fewer transitions.
- **Simulating auth against a real but limited API:** FakeStoreAPI's `/auth/login` only recognizes a small set of seeded users, which would make the login form nearly unusable for graders/reviewers. The fix was a fallback: try the real endpoint first, and if it rejects, simulate a successful login locally when the input meets basic length requirements — keeping a real API call in the flow while still making the demo usable.
- **Keeping the cart in sync across independent components:** `ProductCard` (on the home page), `ProductDetail`, `CartPage`, and `Navbar` all need the same up-to-date cart data without prop drilling. Centralizing all reads/writes through `CartContext` and computing totals with `useMemo` avoided duplicate/stale state.
- **Toolchain version drift:** `react-scripts@5.0.1` combined with newer transitive ESLint versions produced a build-blocking config error (`Environment key "jest/globals" is unknown`) unrelated to any application code. Resolved via CRA's documented `DISABLE_ESLINT_PLUGIN` escape hatch, documented above so it's not a mystery for future contributors.
- **Form validation UX:** balancing "helpful" against "annoying" — validating every field on every keystroke felt noisy, so `CheckoutForm` only shows an error once a field has been blurred (`touched`) or the form has been submitted, matching common real-world checkout UX.

---

## License

Built as a course capstone project. Product data courtesy of [FakeStoreAPI](https://fakestoreapi.com).
