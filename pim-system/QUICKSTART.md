# PIM System - Quick Reference Guide

## 🎯 First Time Setup (5 minutes)

### 1. Backend Setup
```bash
cd pim-system/backend
npm install
cp .env.example .env
# Edit .env with your settings
npm start
# Should see: "PIM Backend running on http://localhost:5000"
```

### 2. Frontend Setup (new terminal)
```bash
cd pim-system/frontend
npm install
npm start
# Automatically opens http://localhost:3000
```

### 3. Create Your First Account
1. Go to `http://localhost:3000`
2. Click "Register here"
3. Create account with any username, email, password
4. You're logged in! Start adding products

## 💡 Common Tasks

### Add a Product
1. Click "Add Product" button
2. Fill in SKU (required, must be unique)
3. Fill in Name (required)
4. Add optional fields: description, category, price, weight, etc.
5. Click "Create Product"

### Search for Products
- Use the search box to find by name or SKU
- Use category dropdown to filter by category
- Results update instantly

### Edit a Product
1. Find the product in the list
2. Click "Edit" button
3. Modify any fields
4. Click "Update Product"

### Delete a Product
1. Find the product
2. Click "Delete" button
3. Confirm deletion

## 🔑 API Quick Reference

All API calls (except auth) need the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Main Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Get JWT token |
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product (admin only) |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |

## 🎨 Customization Tips

### Change Colors
Edit `frontend/src/App.css` and the `.css` files in `frontend/src/styles/`

### Add New Product Fields
1. Update database schema in `backend/src/database/db.js`
2. Add field to form in `frontend/src/components/ProductForm.jsx`
3. Add field to list in `frontend/src/components/ProductList.jsx`

### Change Database Location
Edit `DATABASE` in `backend/.env`

## 🆘 Need Help?

- Check server console for error messages
- Ensure both backend and frontend are running
- Check browser console (F12) for frontend errors
- Verify port 5000 is available: `netstat -ano | findstr 5000` (Windows)

## 📊 Database Reset

To start fresh:
```bash
# Stop backend
# Delete the database file
rm pim_database.db
# or on Windows
del pim_database.db
# Restart backend - new empty database will be created
npm start
```

## 🚀 Deploy to Production

Before deploying:
1. Change `JWT_SECRET` in `.env` to a strong random string
2. Set `NODE_ENV=production`
3. Build frontend: `npm run build`
4. Use proper database (PostgreSQL recommended)
5. Use environment-specific `.env` files

---

**Need more features?** Check the main README.md for API documentation and enhancement ideas!
