
# Modern Cart

> A polished MERN e-commerce platform for discovering products, managing a cart, and completing an authenticated checkout flow.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20Storefront-0f75e6?style=for-the-badge)](https://modern-cart-seven.vercel.app/)
[![Frontend Build](https://github.com/vijayshikhare/modern-cart/actions/workflows/ci.yml/badge.svg)](https://github.com/vijayshikhare/modern-cart/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/vijayshikhare/modern-cart?style=flat)](https://github.com/vijayshikhare/modern-cart/stargazers)

Modern Cart is a full-stack JavaScript shopping experience built for people who want to see how a real storefront fits together: product discovery, search, authentication, cart persistence, wishlist management, checkout, and order history backed by a REST API.

The customer-facing brand inside the app is **ProShop**.

<div align="center">

**[Try the live storefront](https://modern-cart-seven.vercel.app/)** · **[Explore the API](#api-surface)** · **[Open an issue](https://github.com/vijayshikhare/modern-cart/issues)**

</div>

## Why Modern Cart?

This is more than a static shop mockup. It is a practical MERN e-commerce project with a responsive React interface, protected customer workflows, server-side checkout rules, MongoDB persistence, and production-minded API middleware.

It is useful for:

- Developers learning how a React storefront communicates with an Express API
- Hiring teams reviewing a complete full-stack portfolio project
- Contributors looking for a focused e-commerce codebase to improve
- Product teams exploring a clean starting point for a shopping experience

## What You Can Try

| Experience | Included |
| --- | --- |
| Discover | Responsive home page, categories, search suggestions, deals, new arrivals, and product details |
| Shop | Persistent cart, quantity updates, stock checks, wishlist, and protected checkout |
| Account | Registration, login, dashboard, order history, and protected routes |
| Operate | Product, user, cart, wishlist, and order REST endpoints with MongoDB persistence |
| Trust | JWT authentication, Joi validation, Helmet headers, CORS rules, logging, and rate limiting |

## Product Highlights

- Lazy-loaded React routes for a lighter initial storefront load
- Responsive layout with light and dark themes
- Search, category filters, sorting, pagination, and quick product suggestions
- Server-owned order totals and stock reservation during checkout
- Reusable UI primitives built with Tailwind CSS and Lucide icons
- Seed data for quickly creating a local product catalog
- GitHub Actions checks for the frontend build and backend syntax

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS, Framer Motion, Lucide React |
| Backend | Node.js, Express, JWT, Joi, Helmet, Morgan, express-rate-limit |
| Database | MongoDB and Mongoose |
| Quality | ESLint, Vite production build, Node syntax checks, GitHub Actions |

## Architecture

```text
Browser
	│
	▼
React + Vite storefront ── REST calls ──► Express API
																						 │
																						 ▼
																				 MongoDB
```

## Project Structure

```text
modern-cart/
├── backend/
│   ├── controllers/   # Request handlers and business rules
│   ├── models/        # Mongoose schemas
│   ├── routes/        # REST endpoints
│   └── server.js      # API entry point
├── frontend/
│   └── src/            # React pages, components, hooks, and utilities
├── .github/workflows/  # Continuous integration
└── README.md
```

## Run It Locally

### Prerequisites

- Node.js 18+
- npm
- A MongoDB database, local or hosted

### 1. Clone the repository

```bash
git clone https://github.com/vijayshikhare/modern-cart.git
cd modern-cart
```

### 2. Configure and start the API

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

Update `backend/.env` with your MongoDB URI and JWT secret before using account, cart, or order features:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbName>
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Seed sample products (optional)

From `backend/`:

```bash
npm run seed
```

### 4. Start the storefront

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API runs at [http://localhost:5000](http://localhost:5000).

## Commands

Run these commands from the relevant directory:

```bash
# frontend/
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build

# backend/
npm run dev       # Start the API with nodemon
npm start         # Start the API normally
npm run seed      # Replace products with sample catalog data
```

## API Surface

| Route | Purpose |
| --- | --- |
| `/api/auth` | Registration, login, and profile |
| `/api/products` | Public browsing plus protected product management |
| `/api/cart` | Authenticated cart operations |
| `/api/wishlist` | Authenticated saved products |
| `/api/orders` | Authenticated checkout and order history |
| `/api/users` | Authenticated user operations |

## Current Scope

The checkout UI currently presents COD, Card, and UPI choices, but no external payment processor is connected yet. This keeps the demo flow usable while leaving a clear integration point for Stripe, Razorpay, or another provider.

## Contributing

Ideas, bug reports, documentation improvements, and pull requests are welcome. A good first contribution is a focused issue with reproduction steps or a small UI/API improvement with tests or screenshots.

1. Fork the repository.
2. Create a branch: `git checkout -b feat/your-improvement`.
3. Install dependencies and run the relevant checks.
4. Open a pull request with a clear summary and screenshots for UI changes.

If this project helps you, a **star** is appreciated. It helps more developers discover the project and gives future contributors a useful signal.

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).

## Discover More

`react` `react-router` `vite` `nodejs` `express` `mongodb` `mongoose` `mern-stack` `ecommerce` `shopping-cart` `rest-api` `tailwindcss` `full-stack-javascript`

