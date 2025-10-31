# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a Next.js 14 outdoor gear directory with a unique chat-like interface. Posts appear as incoming messages, with commentary as outgoing messages.

### Core Architecture
- **Frontend**: Next.js 14 with App Router, React 19, Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL) with single `posts` table
- **Authentication**: Supabase Auth for admin access only
- **Storage**: Supabase Storage for image uploads in `images` bucket
- **State**: React Context for auth, direct Supabase queries for data

### Key Files & Structure
- `src/lib/supabase.ts` - Supabase client configuration
- `src/lib/auth.tsx` - Authentication context provider
- `src/types/database.ts` - TypeScript types for database schema
- `src/components/ChatFeed.tsx` - Main feed that renders posts as chat messages
- `src/components/ChatMessage.tsx` - Individual message components (product/commentary)
- `database.sql` - Complete database schema with sample data

### App Router Structure
- `/` - Public chat feed (main interface)
- `/post/[id]` - Individual post detail pages
- `/admin/login` - Admin authentication
- `/admin` - Admin dashboard
- `/admin/posts` - Post management
- `/admin/posts/new` - Create new posts

### Data Model
Single `posts` table with:
- Product info: name, brand, price, url, description, images
- Commentary: short_commentary (chat feed), long_commentary (detail page)
- Publishing: published boolean for draft/live posts
- Metadata: timestamps, UUID primary key

### Authentication Flow
- Public site requires no auth
- Admin routes protected by Supabase Auth context
- Single admin user workflow (manual user creation in Supabase dashboard)

## Environment Setup

Required environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Database setup requires running `database.sql` and creating public `images` storage bucket.

## Development Notes

- All admin functionality is in `/admin` routes with authentication guards
- Chat interface alternates between product posts (left/gray) and commentary (right/blue)
- Images can be uploaded to Supabase Storage or referenced by URL
- Posts can be saved as drafts or published immediately
- Mobile-first responsive design throughout