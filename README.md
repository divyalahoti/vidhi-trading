# 🏪 Vidhi Trading — FMCG B2B Website

Full-stack MERN application for Vidhi Trading Company — a B2B FMCG distributor with customer storefront and admin panel.

## Features

### Customer Side
- Home page with hero banner, brand showcase, featured products
- Product catalog with search, category & brand filters
- Product detail page with quantity selector
- Shopping cart with GST calculation
- Checkout with fake payment (UPI / Card / NEFT / COD)
- Order history with status tracking
- B2B registration with GST number, business name

### Admin Panel
- Dashboard with revenue, order, customer stats
- Categories management (add/edit/delete)
- Sub-categories management (linked to categories)
- Brands management (Suhana, Ramdev, MDH, etc.)
- Products management (full CRUD with brand/category/sub-category)
- Orders management (view details, update status)
- Customers management (view, block/activate)

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Auth
- **Frontend:** React 18, React Router v6, Axios, React Hot Toast
- **Payment:** Demo payment system (UPI, Card, NEFT, COD)

## Setup & Run

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Configure Environment
```bash
cd backend
cp .env.example .env
# Edit .env — set your MONGO_URI and JWT_SECRET
```

### 3. Seed Database
```bash
npm run seed
```
This creates:
- Admin: `admin@vidhitrading.com` / `admin123`
- Customer: `rajesh@hariom.com` / `pass123`
- 8 brands, 4 categories, 5 sub-categories, 10 products

### 4. Run Development Servers
```bash
npm run dev
```
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register customer |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get logged-in user |

### Products (public)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/products | List products (filter: brand, category, search) |
| GET | /api/products/:id | Product detail |

### Admin-only
| Method | Route | Description |
|--------|-------|-------------|
| POST/PUT/DELETE | /api/categories | Manage categories |
| POST/PUT/DELETE | /api/subcategories | Manage sub-categories |
| POST/PUT/DELETE | /api/brands | Manage brands |
| POST/PUT/DELETE | /api/products | Manage products |
| GET | /api/orders | All orders |
| PUT | /api/orders/:id/status | Update order status |
| GET | /api/customers | All B2B customers |
| GET | /api/dashboard | Stats |

## Project Structure
```
vidhi-trading/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/ (User, Category, SubCategory, Brand, Product, Order)
│   ├── routes/ (auth, categories, subcategories, brands, products, orders, customers, dashboard)
│   ├── server.js
│   ├── seeder.js
│   └── .env.example
└── frontend/
    └── src/
        ├── admin/ (AdminLayout, Dashboard, ManageCategories, ManageSubCategories, ManageBrands, ManageProducts, ManageOrders, ManageCustomers)
        ├── components/ (Navbar, ProductCard)
        ├── context/ (AuthContext, CartContext)
        ├── pages/ (Home, ProductList, ProductDetail, Cart, Checkout, Orders, Login, Register)
        └── utils/api.js
```

## Adding Real Payment (Razorpay)
Replace the fake payment in `Checkout.js` with Razorpay:
```bash
cd frontend && npm install razorpay
```
Then load the Razorpay script and call the checkout API. Razorpay is standard for Indian B2B.

---
Built for Vidhi Trading Company | Gujarat, India
