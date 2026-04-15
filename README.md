# ⬡ Orbit Education — Full Stack PERN Website

A production-ready education website with dynamic content management via admin panel.

---

## 🗂️ Project Structure

```
orbit-edu/
├── client/          ← React.js Frontend + Admin Panel
├── server/          ← Node.js + Express API
└── schema.sql       ← PostgreSQL database schema + seed data
```

---

## 🛠️ Tech Stack

| Layer      | Technology          | Hosting           |
|------------|---------------------|-------------------|
| Frontend   | React.js            | Vercel (free)     |
| Backend    | Node.js + Express   | Vercel Serverless |
| Database   | PostgreSQL          | Supabase (free)   |
| Auth       | JWT (bcryptjs)      | —                 |

---

## 🔐 Admin Panel Features

- Secure JWT login (`/admin/login`)
- Dashboard with live content counts
- Full CRUD for:
  - 📰 **News & Notices** — with badge, category, image
  - 📅 **Events** — with date, location, featured flag
  - 🎓 **Programmes** — with icon, color, features list
  - 🖼️ **Gallery** — with category and sort order
  - 💬 **Testimonials** — with star rating, avatar

---

## 🌐 Frontend Sections

### Static (Hardcoded)
- Hero Banner
- Scrolling Strip
- Why Choose Us
- Get In Touch (Contact Form)
- Footer

### Dynamic (Admin-managed)
- News & Notices (with category filters)
- Upcoming Events (with featured card)
- Our Programmes (card grid)
- Campus Life Gallery (masonry with lightbox)
- Testimonials (star ratings)
- Admission Banner

---

## 🚀 Deployment Guide

### Step 1 — Supabase (Database)

1. Go to https://supabase.com → Create project
2. Go to **SQL Editor** → Paste contents of `schema.sql` → Run
3. Copy your connection string from **Settings → Database → URI**
   - Format: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`

---

### Step 2 — Create Admin Account

In Supabase SQL Editor:

```sql
-- Get a bcrypt hash from: https://bcrypt.online (cost factor 10)
-- Then run:
INSERT INTO members (name, email, password_hash, role)
VALUES ('Your Name', 'you@email.com', '$2a$10$...hash...', 'admin');
```

---

### Step 3 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourname/orbit-edu.git
git push -u origin main
```

---

### Step 4 — Deploy Backend (Vercel)

1. Go to https://vercel.com → **Add New Project**
2. Import your GitHub repo
3. Set **Root Directory** → `server`
4. **Framework Preset** → Other
5. Add Environment Variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Supabase connection string |
| `JWT_SECRET` | Any long random string (min 32 chars) |
| `CLIENT_URL` | `https://your-frontend.vercel.app` *(update after step 5)* |
| `PORT` | `4000` |

6. Click **Deploy**
7. Note your API URL: `https://orbit-edu-server-xxx.vercel.app`

---

### Step 5 — Deploy Frontend (Vercel)

1. Go to Vercel → **Add New Project**
2. Import the **same** GitHub repo
3. Set **Root Directory** → `client`
4. **Framework Preset** → Create React App
5. Add Environment Variable:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://orbit-edu-server-xxx.vercel.app/api` |

6. Click **Deploy**
7. Note your Frontend URL: `https://orbit-edu-client-xxx.vercel.app`

---

### Step 6 — Update Backend CORS

Go back to your **server** Vercel project → Settings → Environment Variables.
Update `CLIENT_URL` to your actual frontend URL (no trailing slash).
Then: **Deployments → Redeploy**.

---

### Step 7 — Initialize Database

Visit your API health endpoint once to trigger schema creation:
```
https://orbit-edu-server-xxx.vercel.app/health
```

---

## 💻 Local Development

```bash
# Terminal 1 — Backend
cd server
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, CLIENT_URL
npm run dev            # runs on http://localhost:4000

# Terminal 2 — Frontend
cd client
npm install
cp .env.example .env   # set REACT_APP_API_URL=http://localhost:4000/api
npm start              # runs on http://localhost:3000
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login → returns JWT |
| GET | `/api/auth/me` | Get current user (auth required) |
| POST | `/api/auth/setup` | Create first admin (only if no admins exist) |

### Content Endpoints (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news` | Published news |
| GET | `/api/events` | Upcoming events |
| GET | `/api/programs` | Active programmes |
| GET | `/api/gallery` | Published gallery images |
| GET | `/api/testimonials` | Published testimonials |

### Admin Endpoints (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news/all` | All news (including drafts) |
| POST | `/api/news` | Create news |
| PUT | `/api/news/:id` | Update news |
| DELETE | `/api/news/:id` | Delete news |
| *(same pattern)* | `/api/events/*` | Events CRUD |
| *(same pattern)* | `/api/programs/*` | Programmes CRUD |
| *(same pattern)* | `/api/gallery/*` | Gallery CRUD |
| *(same pattern)* | `/api/testimonials/*` | Testimonials CRUD |

---

## 🔑 Admin Access

After deployment:
- URL: `https://your-frontend.vercel.app/admin/login`
- Use the email and password you inserted into the `members` table

---

## 🛡️ Security Notes

- All admin routes protected with JWT middleware
- Passwords hashed with bcrypt (cost factor 10)
- CORS restricted to your frontend domain
- SSL enforced on all DB connections
- JWT expires in 7 days

---

## 🔧 Troubleshooting

**CORS errors** → `CLIENT_URL` env var must exactly match your frontend URL (no trailing slash).

**DB not connecting** → Check `DATABASE_URL` is correct and contains `?sslmode=require` or that ssl option is set.

**404 on page refresh** → `client/vercel.json` rewrites all routes to `/` — ensure this file is present.

**Admin login fails** → Check the bcrypt hash was generated with cost factor 10 and matches your password.
# redeployed
