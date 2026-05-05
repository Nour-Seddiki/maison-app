# Maison & Co. — Private Residences & Advisory

**Live Platform:** [https://maisonapp-ten.vercel.app/](https://maisonapp-ten.vercel.app/)

---

## Overview

**Maison & Co.** is a luxury real estate platform designed for the world's most discerning clientele. It curates an extraordinary collection of prestigious private residences — penthouses, villas, townhouses, manors, and off-market estates — across London's most coveted postcodes including Mayfair, Knightsbridge, and Belgravia.

The platform serves three distinct user roles — **clients**, **sellers**, and **administrators** — each with a tailored experience, from browsing exclusive listings to managing property portfolios and overseeing the entire marketplace.

---

## Key Features

### For Clients
- Browse and search curated luxury property listings (sale, rent, off-market)
- Save favourite properties to a personal wishlist
- Submit private inquiries directly to sellers or advisors
- View detailed property pages with high-resolution imagery, floor plans, and neighbourhood insights
- Access a personal dashboard to track inquiries and saved properties
- Manage profile, preferences, and identity verification (national ID upload)

### For Sellers
- Create and manage property listings with full media support
- Track inquiry pipelines and update inquiry statuses
- Monitor listing performance through a dedicated seller dashboard

### For Admins
- Full user management (view, verify, suspend users)
- Review and approve/reject property submissions
- Platform-wide analytics dashboard (listings, users, inquiries)
- Manage all active listings across the marketplace


---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Database & Auth | Supabase (PostgreSQL + Row-Level Security) |
| Payments | Stripe |
| Forms & Validation | React Hook Form + Zod |
| UI Components | Lucide React, Embla Carousel |
| Fonts | Cormorant Garamond (headings), Montserrat (body) |
| Deployment | Vercel |

---

## Project Structure

```
app/
├── (public)/         # Public-facing pages (portfolio, market insights, concierge…)
├── (auth)/           # Sign-in & sign-up flows
├── (client)/         # Authenticated client dashboard, profile, settings
├── (seller)/         # Seller dashboard and listing management
├── (admin)/          # Admin panel — users, listings, analytics
└── api/              # REST API routes (properties, inquiries, profile, payments…)

components/
├── home/             # Landing page sections (Hero, About, Testimonials…)
├── layout/           # Navbar and Footer
├── property/         # Reusable property card component
└── ui/               # Design-system primitives (Button, Input, Modal, Badge…)

lib/
├── supabase/         # Supabase client, server, and admin helpers
└── data/             # Shared data utilities

supabase/
└── schema.sql        # Full database schema with RLS policies
```

---

## Database Schema

The Supabase PostgreSQL schema includes the following core tables:

- **profiles** — extends Supabase Auth with role, verification, NDA status, and identity documents
- **properties** — full property listings with type, status, pricing, location, and media
- **neighborhoods** — curated area guides linked to properties
- **property_images** — ordered image gallery per property
- **inquiries** — buyer–seller communication threads with status tracking
- **saved_properties** — client wishlists
- **notifications** — in-app notification system

Role-based access is enforced via PostgreSQL Row-Level Security (RLS) policies.

