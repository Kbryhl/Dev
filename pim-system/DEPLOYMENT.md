# PIM System - Deployment & GitHub Setup Guide

## 🚀 Overview

Your PIM system now has GitHub Actions workflows that:
- ✅ Test backend code on every push
- ✅ Build frontend on every push  
- ✅ Deploy frontend preview to Vercel
- ✅ Deploy backend to Railway/Render

## 📋 Setup Steps

### 1. Frontend Deployment (Vercel) - 5 minutes

**Option A: Automatic Deploy via GitHub**

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub (or create account)
3. Click "New Project"
4. Import your GitHub repository
5. Select `frontend` as the root directory
6. Vercel auto-detects it's a React app
7. Click "Deploy" - done!

**Get your Vercel secrets for GitHub Actions:**

1. In Vercel dashboard, go to Settings → Tokens
2. Create new token, copy it
3. Go to your GitHub repo → Settings → Secrets and variables → Actions
4. Add these secrets:
   - `VERCEL_TOKEN`: (paste the token from step 2)
   - `VERCEL_ORG_ID`: (found in Vercel Settings → General → Project ID area)
   - `VERCEL_PROJECT_ID`: (found in Vercel project Settings)

Now: Every push to main/develop automatically deploys a preview!

### 2. Backend Deployment - Choose One Option

#### Option A: Railway.app (Recommended - Free tier available)

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "Create New Project" → "Deploy from GitHub repo"
4. Select your PIM repo
5. Set environment variables:
   ```
   PORT=3000
   NODE_ENV=production
   JWT_SECRET=<generate_a_random_key>
   DATABASE=pim_database.db
   ```
6. Railway generates a public URL automatically
7. Get your `RAILWAY_TOKEN`:
   - Go to Account → Tokens
   - Create new token, copy it
   - Add to GitHub repo Secrets as `RAILWAY_TOKEN`

#### Option B: Render.com (Also free tier available)

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect to your GitHub repo
5. Set these settings:
   - Environment: Node
   - Build command: `cd backend && npm install`
   - Start command: `node src/server.js`
   - Add environment variables (same as above)
6. Click "Create Web Service"
7. Render gives you a public URL like: `https://pim-backend.onrender.com`

#### Option C: Heroku (Legacy - more complex)

*Note: Heroku removed free tier. Use Railway or Render instead.*

### 3. Connect Frontend to Backend

After you have your backend URL (from Railway/Render), update your frontend:

**frontend/.env.production**

Create this file:
```
REACT_APP_API_BASE_URL=https://your-backend-url.railway.app
```

Or in **frontend/src/api/index.js**, update:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
```

### 4. GitHub Actions Workflows

The workflows automatically trigger on:
- **CI/CD**: Every push to main/develop (tests backend & frontend)
- **Frontend Deploy**: Every push to main/develop (deploys to Vercel)
- **Backend Deploy**: Push to main with backend/ changes (deploys to Railway)

View status: GitHub repo → Actions tab

## 🔗 Your Deployed URLs

After setup, you'll have:

```
Frontend:  https://pim-system.vercel.app    (Vercel preview URLs for PRs too)
Backend:   https://pim-backend.railway.app   (Railway URL)
```

Update your docs with these URLs for team members.

## 🔐 Production Checklist

Before going live:

- [ ] Change `JWT_SECRET` to a strong random value (32+ chars)
- [ ] Set `NODE_ENV=production` on backend
- [ ] Add HTTPS to backend (Railway/Render do this auto)
- [ ] Set database to PostgreSQL (not SQLite) for production
- [ ] Configure CORS properly in backend for your domain
- [ ] Add error logging/monitoring
- [ ] Set up database backups
- [ ] Test login/products on production URLs

## 📊 Environment Variables Needed

### GitHub Secrets (for Actions to work)
```
VERCEL_TOKEN          (from Vercel account)
VERCEL_ORG_ID         (from Vercel)
VERCEL_PROJECT_ID     (from Vercel)
RAILWAY_TOKEN         (from Railway account)
```

### Backend Environment (.env on Railway/Render)
```
PORT=3000
NODE_ENV=production
JWT_SECRET=your_very_secure_random_string_here
DATABASE=pim_database.db
UPLOAD_DIR=uploads
```

### Frontend Environment (.env.production)
```
REACT_APP_API_BASE_URL=https://your-backend-url-here
```

## 🧪 Test Your Setup

1. **Local test first:**
   ```bash
   cd backend && npm start
   cd frontend && npm start
   ```

2. **Push a test branch:**
   ```bash
   git checkout -b test-deployment
   git push origin test-deployment
   ```

3. **Watch GitHub Actions:**
   - Go to repo → Actions tab
   - See workflow run in real-time
   - Check for ✅ or ❌

4. **Test frontend deployment:**
   - After Vercel deploys, click the preview link
   - Register and test adding a product
   - Check Network tab that API calls work

## 🔄 Typical Workflow

### For new features:
```bash
git checkout -b feature/new-feature
# ... code changes ...
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# → GitHub Actions tests automatically
# → Vercel deploys preview (check PR for link)
# Create Pull Request, get reviewed
git checkout main && git merge feature/new-feature
git push
# → Deplooys to production!
```

## 🐛 Troubleshooting Deployments

**Vercel build fails:**
- Check build logs in Vercel dashboard
- Usually: missing .env.production variables
- Make sure root directory is set to `frontend/`

**Railway/Render deployment fails:**
- Check console logs in Railway/Render dashboard
- Often: Node packages not installed
- Check start command is correct in settings

**Frontend can't reach backend:**
- Check backend URL in frontend/.env files
- Verify backend is running and accessible
- Check CORS settings in backend

**Database errors on production:**
- SQLite doesn't persist in most cloud environments
- Upgrade to PostgreSQL before going to production
- See [Production Database Setup](#production-checklist)

## 📚 Next Steps

1. Set up Vercel (5 min)
2. Set up Railway backend (5 min)  
3. Add secrets to GitHub (2 min)
4. Push to trigger first auto-deploy (1 min)
5. Test deployed versions (5 min)
6. Share live URLs with team!

✨ **You now have a production-ready CI/CD pipeline!**

---

**Need help?**
- Vercel docs: https://vercel.com/docs
- Railway docs: https://docs.railway.app
- Render docs: https://render.com/docs
