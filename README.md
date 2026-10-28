# Fresh Bites — Food Ordering Website

A full-stack food ordering website for a home-based food business. Customers can browse the menu, manage their cart, and place delivery orders online.

Built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

## Features

- Menu browsing, grouped by category
- Shopping cart with quantity updates and item removal
- Checkout with client-side and server-side validation
- Server-side price verification using database prices
- Password-protected admin dashboard for orders, revenue, cost, and profit
- Basic rate limiting on the admin login endpoint
- Open Graph image, sitemap, and robots.txt

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 — App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase — PostgreSQL |
| Validation | Zod |
| Cart State | React Context |

## Project Structure

```text
src/
  app/
    page.tsx          # Home page
    menu/             # Menu page
    checkout/         # Checkout page
    admin/            # Admin dashboard
    api/
      orders/         # Order creation endpoint
      admin/orders/   # Admin order-fetching endpoint
  components/         # Shared UI components
  context/            # Cart state
  lib/                # Supabase clients and site configuration
  types/              # Shared TypeScript types
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ajaz-awan/fresh-bites-website.git
cd fresh-bites-website
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PASSWORD=your_admin_password
```

Use your own Supabase project and configure the database tables required by the application. Environment variables alone do not create the database schema.

Keep `.env.local` out of version control. The service role key and admin password must remain server-side.

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration
## Screenshots

![Screenshot 1](Screenshot%202026-10-28%20233826.png)

![Screenshot 2](Screenshot%202026-10-28%20234123.png)

![Screenshot 3](Screenshot%202026-10-28%20234217.png)
Business details, delivery areas, and theme settings are managed in `siteConfig.ts`.

## Setup Documentation To Add

- Database schema and setup SQL
- Sample menu data
- Screenshots of the customer pages and admin dashboard
