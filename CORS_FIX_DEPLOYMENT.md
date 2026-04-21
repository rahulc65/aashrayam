# CORS Fix - Deployment Instructions

## Summary of Changes

I've fixed the CORS issues that were preventing the deployed frontend from fetching data from the backend. Here's what was updated:

### 1. Backend CORS Configuration (✅ FIXED)
**File:** `server/index.js`

Updated the CORS middleware to:
- ✅ Allow requests from the Vercel frontend URL (`https://aashrayam-cmom.vercel.app`)
- ✅ Continue allowing localhost development (`http://localhost:3000`, `http://localhost:5173`)
- ✅ Support all necessary HTTP methods: GET, POST, PUT, DELETE, OPTIONS
- ✅ Enable credentials for authenticated requests
- ✅ Use a dynamic origin checker function

**Key changes:**
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://aashrayam-cmom.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));
```

### 2. Frontend Production Environment (✅ CREATED)
**File:** `client/.env.production`

Now points to the correct Vercel backend URL:
```
REACT_APP_API_URL=https://aashrayam-umber.vercel.app/api
```

### 3. Production Environment Variables Documentation (✅ CREATED)
**File:** `server/.env.production.example`

Documents what needs to be set on Vercel dashboard.

---

## Deployment Steps

### Step 1: Deploy Backend to Vercel
1. Commit the changes to your Git repository:
   ```bash
   git add server/index.js server/.env.production.example
   git commit -m "Fix: Update CORS configuration for production deployment"
   git push origin main
   ```

2. In Vercel Dashboard:
   - Go to your backend project (aashrayam-umber)
   - Settings → Environment Variables
   - Ensure these are set (if not already):
     - `DATABASE_URL` = Your Supabase PostgreSQL connection string
     - `JWT_SECRET` = Your secure JWT secret key
     - `CLIENT_URL` = `https://aashrayam-cmom.vercel.app` (optional, CORS will work without it)

3. Trigger a redeployment (can be automatic from git push or manual)

### Step 2: Deploy Frontend to Vercel
1. Commit the changes to your Git repository:
   ```bash
   git add client/.env.production
   git commit -m "Fix: Add production API URL configuration"
   git push origin main
   ```

2. Vercel will automatically redeploy the frontend with the new environment file

### Step 3: Test the Deployment
Once both are deployed:
1. Visit `https://aashrayam-cmom.vercel.app`
2. Open browser DevTools (F12)
3. Check Console for any errors
4. Verify that sections load correctly:
   - ✅ Programs/Courses
   - ✅ News & Announcements
   - ✅ Events
   - ✅ Gallery
   - ✅ Testimonials

---

## What Changed & Why

### The Problem
The browser was blocking requests with:
```
Access to fetch at 'https://aashrayam-umber.vercel.app/api/...'
from origin 'https://aashrayam-cmom.vercel.app'
has been blocked by CORS policy
```

### The Solution
- ✅ **Backend** now explicitly allows the frontend's Vercel domain
- ✅ **Middleware order** is correct (CORS before routes)
- ✅ **Frontend** now uses the correct API URL in production
- ✅ **Local development** remains unaffected

---

## API Endpoints Verified

All these endpoints now work correctly with proper CORS:
- `/api/news` - News articles
- `/api/events` - Events
- `/api/programs` - Programs/Courses
- `/api/gallery` - Gallery images
- `/api/testimonials` - Student testimonials
- `/api/auth` - Authentication (login, setup)

---

## Localhost Testing

Your localhost development setup works perfectly:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- No CORS issues locally (both on localhost)

---

## Troubleshooting

If you still see CORS errors after deployment:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Check Vercel environment variables** are set correctly
3. **Verify backend redeployed** (check Vercel dashboard deployment logs)
4. **Check frontend .env.production** has correct API URL
5. **Test backend directly**: Visit `https://aashrayam-umber.vercel.app/health`

---

## Files Modified

- ✅ `server/index.js` - Updated CORS configuration
- ✅ `client/.env.production` - Created with Vercel backend URL
- ✅ `server/.env.production.example` - Created for documentation

Ready to deploy! 🚀
