# E-commerce Backend

## Setup

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

Base URL: `http://localhost:5000`

## Routes

- GET `/api/products`
- GET `/api/products?q=hat`
- GET `/api/products?category=headwear`
- GET `/api/products/:id`
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/orders`
