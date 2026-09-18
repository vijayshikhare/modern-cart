
# Modern Cart

> A polished full-stack e-commerce experience built with React, Node.js, Express, and MongoDB.

[![Frontend Build](https://github.com/vijayshikhare/modern-cart/actions/workflows/ci.yml/badge.svg)](https://github.com/vijayshikhare/modern-cart/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Modern Cart is a responsive online store with a production-minded shopping flow, account features, and a secure REST API. The customer-facing brand inside the app is **ProShop**.

## Why This Project

Modern Cart is designed as a practical portfolio-quality MERN e-commerce project rather than a static storefront. It demonstrates responsive UI composition, lazy-loaded React routes, authenticated customer workflows, server-side validation, protected API routes, security headers, and rate limiting.

## Features

- Responsive storefront with product discovery, search, deals, and new arrivals
- Product details, cart, checkout, wishlist, and order history flows
- User registration, login, protected routes, and account dashboard
- REST API for authentication, products, carts, wishlists, orders, and users
- MongoDB persistence through Mongoose
- Joi request validation and JWT authentication
- Helmet security headers, CORS configuration, Morgan logging, and rate limiting
- Reusable React UI components with Tailwind CSS and Framer Motion
- Lazy-loaded pages for a faster initial frontend load

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS, Framer Motion, Lucide |
| Backend | Node.js, Express, JWT, Joi, Helmet, Morgan, express-rate-limit |
| Database | MongoDB and Mongoose |
| Quality | ESLint, Vite production build, Node syntax checks, GitHub Actions |

## Project Structure

```text
modern-cart/
├── backend/      # Express API, models, controllers, routes, and database config
├── frontend/     # React + Vite storefront
├── .github/      # Continuous integration workflow
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database, local or hosted

### 1. Clone the repository

```bash
git clone https://github.com/vijayshikhare/modern-cart.git
cd modern-cart
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Fill in the values in `backend/.env` before using authentication or database-backed features. Never commit `.env` files.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:5000` by default.

## Useful Commands

### Frontend

```bash
npm run dev       # Start Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
```

### Backend

```bash
npm run dev       # Start the API with nodemon
npm start         # Start the API normally
npm run seed      # Seed the database when configured
```

## API Areas

- `/api/auth` - registration and login
- `/api/products` - product browsing and management
- `/api/cart` - customer cart operations
- `/api/wishlist` - saved products
- `/api/orders` - checkout and order history
- `/api/users` - account operations

## Contributing

Issues, suggestions, and pull requests are welcome. For a focused contribution:

1. Fork the repository.
2. Create a branch: `git checkout -b feat/your-improvement`.
3. Make and test your change.
4. Open a pull request with a clear summary and screenshots for UI changes.

## License

This project is licensed under the MIT License.

## Discover More

`react` `vite` `nodejs` `express` `mongodb` `mongoose` `mern-stack` `ecommerce` `shopping-cart` `tailwindcss` `full-stack` `web-development`

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
