# Fresh Bites — Food Ordering Website

A full-stack food ordering website built for a home-based food business, letting customers browse the menu, add items to a cart, and place delivery orders online.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

## Features

- 📋 Menu browsing, grouped by category, fetched from Supabase
- 🛒 Cart with add/remove/update quantity (React Context)
- ✅ Checkout with form validation (Zod, client + server side)
- 🔒 Server-side price verification — order totals are always recalculated from the database, never trusted from the client
- 📊 Password-protected admin dashboard for viewing orders, revenue, cost, and profit (today / this month / all time)
- 🚦 Basic rate limiting on the admin login endpoint
- 🖼️ Auto-generated Open Graph image, sitemap, and robots.txt for SEO

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Validation | Zod |

## Project Structure

\`\`\`
src/
  app/
    page.tsx          → Home page
    menu/              → Menu page (Server Component, ISR every 5 min)
    checkout/          → Checkout page
    admin/             → Admin dashboard (password protected)
    api/
      orders/          → Order creation endpoint
      admin/orders/    → Admin order-fetching endpoint (rate limited)
  components/          → Navbar, Cart Drawer, Menu Card, etc.
  context/             → Cart state (React Context)
  lib/                 → Supabase clients, site config
  types/                → Shared TypeScript types
\`\`\`

## Getting Started

1. Clone the repo and install dependencies:
   \`\`\`bash
   git clone https://github.com/ajaz-awan/fresh-bites-website.git
   cd fresh-bites-website
   npm install
   \`\`\`

2. Create a \`.env.local\` file in the root with:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ADMIN_PASSWORD=your_admin_password
   \`\`\`

3. Run the dev server:
   \`\`\`bash
   npm run dev
   \`\`\`

   Open [http://localhost:3000](http://localhost:3000) to view it.

## Notes

- \`siteConfig.ts\` centralizes all business-specific info (brand name, contact, delivery areas, theme colors) so the template can be reused for a different business by editing one file.
- The \`SUPABASE_SERVICE_ROLE_KEY\` is only ever used server-side (API routes / Server Components) and never exposed to the browser.