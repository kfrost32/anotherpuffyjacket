# Another Puffy Jacket

A curated outdoor gear directory with a unique chat-like interface, built for discovering and sharing the latest outdoor equipment finds.

## 🏔️ Features

- **Chat-Style Feed**: Product posts appear as "incoming messages" with your commentary as "outgoing messages"
- **Admin Interface**: Full CRUD management for posts with authentication
- **Image Upload**: Direct uploads to Supabase Storage or URL-based images
- **Responsive Design**: Optimized for both mobile and desktop viewing
- **Post Details**: Dedicated pages for in-depth product information
- **Publishing Workflow**: Draft and publish posts as needed

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for image uploads
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd anotherpuffyjacket
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the SQL schema from `database.sql` in the SQL Editor
4. Create an images storage bucket:
   - Go to Storage > Create Bucket
   - Name: `images`
   - Make it public
   - Apply the storage policies from `database.sql`

### 3. Environment Variables

Copy `.env.local.example` to `.env.local` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Create Admin User

In Supabase Dashboard > Authentication > Users, create a new user account for admin access.

### 5. Run the App

```bash
npm run dev
```

Visit:
- **Main site**: http://localhost:3000
- **Admin login**: http://localhost:3000/admin/login
- **Admin dashboard**: http://localhost:3000/admin

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin interface
│   │   ├── login/         # Admin login
│   │   ├── posts/         # Post management
│   │   └── page.tsx       # Admin dashboard
│   ├── post/[id]/         # Dynamic post detail pages
│   └── page.tsx           # Main chat feed
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── ChatFeed.tsx      # Main feed component
│   ├── ChatMessage.tsx   # Individual message bubbles
│   └── ImageUpload.tsx   # Image upload utility
├── lib/                  # Utilities and configurations
│   ├── auth.tsx          # Authentication context
│   ├── storage.ts        # Supabase storage helpers
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # General utilities
└── types/
    └── database.ts       # TypeScript types for database
```

## 🎨 Design Philosophy

The site mimics a chat thread where:
- **Product posts** appear as incoming messages (left-aligned, gray background)
- **Your commentary** appears as outgoing messages (right-aligned, blue background)
- Each post has a **detail page** with full product information
- **Mobile-first** responsive design

## 🔐 Admin Features

- **Authentication**: Secure login with Supabase Auth
- **Post Management**: Create, edit, delete, and publish posts
- **Image Uploads**: Direct upload to Supabase Storage or URL entry
- **Draft System**: Save posts as drafts before publishing
- **Responsive Admin**: Mobile-friendly admin interface

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Your site will be available at `your-app.vercel.app`

## 🔮 Future Enhancements

- **Chrome Extension**: Direct posting from web browsing (architecture ready)
- **Analytics**: Track popular posts and engagement
- **Categories**: Filter posts by gear type
- **User Comments**: Allow visitor feedback
- **RSS Feed**: Subscribe to new gear finds
- **Search**: Find specific products or brands

## 📝 Content Management

### Creating Posts

1. Login to `/admin/login`
2. Go to "New Post" from the dashboard
3. Fill in product details:
   - **Name & Brand**: Product identification
   - **Images**: Feature image (required) + additional images
   - **Price & URL**: Link to purchase
   - **Description**: Product details
   - **Short Commentary**: Appears in chat feed
   - **Long Commentary**: Appears on detail page
4. Choose to save as draft or publish immediately

### Post Workflow

- **Draft**: Create and refine posts before publishing
- **Published**: Live posts visible in the main feed
- **Edit**: Update any post details anytime
- **Delete**: Remove posts permanently (with confirmation)

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your own use cases!

## 📄 License

MIT License - feel free to use for personal or commercial projects.
