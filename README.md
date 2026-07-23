# Siya's Kitchen — Order Manager

A simple, mobile-first order tracker for a home/cloud kitchen.

## Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000 (redirects to /dashboard).

## What it does

- Record daily orders (customer, items, amount, source, payment method, optional expense)
- See today's orders, sales, cash received, and UPI received at a glance
- Edit or delete any order
- Works great on a phone; also looks good on desktop
