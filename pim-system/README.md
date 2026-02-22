# Product Information Management (PIM) System

A modern, full-stack PIM system for managing product information with multiple fields, categories, user authentication, and flexible product specs.

## 🎯 Features

- **User Authentication**: Register, login, and role-based access control
- **Product Management**: Create, read, update, and delete products
- **Flexible Product Fields**: Support for custom specs on each product
- **Categorization**: Organize products by categories
- **Search & Filter**: Find products by name, SKU, or category
- **User Permissions**: Admin and editor roles
- **Responsive UI**: Modern React-based interface

## 📋 Product Fields

Each product can contain:
- SKU (unique identifier)
- Name
- Description
- Category
- Price
- Startup Price
- Weight
- Best Before Date
- Image URL
- Custom Specs (unlimited key-value pairs)

## 🏗️ Project Structure

```
pim-system/
├── backend/              # Node.js/Express server
│   ├── src/
│   │   ├── server.js     # Main server file
│   │   ├── database/
│   │   │   └── db.js     # SQLite database setup
│   │   ├── routes/       # API endpoints
│   │   ├── controllers/  # Business logic
│   │   └── middleware/   # Auth & other middleware
│   ├── uploads/          # Product images storage
│   ├── package.json
│   └── .env.example
├── frontend/             # React application
│   ├── src/
│   │   ├── pages/        # Page components (Auth, Products)
│   │   ├── components/   # Reusable components
│   │   ├── api/          # API client
│   │   ├── styles/       # CSS stylesheets
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd pim-system/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update these values:
   ```
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_secure_secret_key_here_min_32_chars
   DATABASE=pim_database.db
   UPLOAD_DIR=uploads
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```
   
   Or with auto-reload:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **In a new terminal, navigate to frontend directory:**
   ```bash
   cd pim-system/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The frontend will open at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response: 201 Created
{
  "message": "User created successfully",
  "userId": "uuid"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "editor"
  }
}
```

### Products Endpoints

#### Get All Products
```
GET /api/products?search=&category=&page=1&limit=20
```

#### Get Product by ID
```
GET /api/products/:id
```

#### Create Product
```
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "sku": "PROD-001",
  "name": "Product Name",
  "description": "Product description",
  "category_id": "uuid",
  "price": 29.99,
  "startup_price": 24.99,
  "weight": 500,
  "best_before_date": "2026-12-31",
  "image_url": "https://example.com/image.jpg",
  "specs": {
    "color": "red",
    "size": "large",
    "material": "cotton"
  }
}

Response: 201 Created
{
  "message": "Product created",
  "productId": "uuid"
}
```

#### Update Product
```
PUT /api/products/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 34.99,
  "specs": {
    "color": "blue",
    "size": "xlarge"
  }
}

Response: 200 OK
{
  "message": "Product updated"
}
```

#### Delete Product
```
DELETE /api/products/:id
Authorization: Bearer {token}
(Admin role required)

Response: 200 OK
{
  "message": "Product deleted"
}
```

### Categories Endpoints

#### Get All Categories
```
GET /api/categories
```

#### Create Category
```
POST /api/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic products"
}

Response: 201 Created
{
  "message": "Category created",
  "categoryId": "uuid"
}
```

#### Update Category
```
PUT /api/categories/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

#### Delete Category
```
DELETE /api/categories/:id
Authorization: Bearer {token}
```

### Health Check
```
GET /api/health

Response: 200 OK
{
  "status": "OK",
  "timestamp": "2026-02-22T10:30:00.000Z"
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Register a new account at `/register`
2. Login at `/api/auth/login` to get a token
3. Include the token in the Authorization header for protected routes:
   ```
   Authorization: Bearer {token}
   ```

Tokens expire after 24 hours.

## 👥 User Roles

- **editor**: Can create, view, and edit products. Default role for new users.
- **admin**: Full access including deletion of products.

To make a user admin, directly update the database (modify the `role` field in the `users` table).

## 🗄️ Database

The system uses SQLite for data storage. The database file (`pim_database.db`) is automatically created on first run.

### Tables

**users**
- id (TEXT PRIMARY KEY)
- username (TEXT UNIQUE)
- email (TEXT UNIQUE)
- password (TEXT - bcrypt hashed)
- role (TEXT - editor/admin)
- created_at (DATETIME)

**products**
- id (TEXT PRIMARY KEY)
- sku (TEXT UNIQUE)
- name (TEXT)
- description (TEXT)
- category_id (TEXT FOREIGN KEY)
- price (REAL)
- startup_price (REAL)
- weight (REAL)
- best_before_date (TEXT)
- image_url (TEXT)
- created_by (TEXT FOREIGN KEY)
- created_at (DATETIME)
- updated_at (DATETIME)

**categories**
- id (TEXT PRIMARY KEY)
- name (TEXT UNIQUE)
- description (TEXT)
- created_at (DATETIME)

**product_specs**
- id (TEXT PRIMARY KEY)
- product_id (TEXT FOREIGN KEY)
- spec_key (TEXT)
- spec_value (TEXT)

## 🔧 Configuration

All configuration is done via environment variables in the `.env` file:

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret key for JWT signing (must be at least 32 characters)
- `DATABASE`: SQLite database filename
- `UPLOAD_DIR`: Directory for uploaded files

## 📦 Dependencies

### Backend
- **express**: Web framework
- **sqlite3/sqlite**: Database
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin requests
- **dotenv**: Environment variable management
- **multer**: File uploads
- **uuid**: Unique identifiers

### Frontend
- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client

## 🚀 Next Steps & Enhancements

1. **Image Upload**: Add local image upload functionality
2. **Bulk Import**: CSV/Excel import for product data
3. **Export**: Export products to CSV/Excel
4. **Advanced Filtering**: Add price ranges, date ranges
5. **Product Variants**: Support for product variations
6. **Audit Trail**: Track changes to products
7. **Comments/Notes**: Add internal product notes
8. **Dashboard**: Analytics and statistics
9. **Mobile App**: React Native mobile version
10. **Database Migration**: Move from SQLite to PostgreSQL for production

## 🐛 Troubleshooting

**Backend won't start:**
- Check if port 5000 is already in use
- Verify Node.js installation: `node --version`
- Check console for error messages

**Frontend shows "Cannot connect to API":**
- Ensure backend is running on port 5000
- Check CORS settings if connecting from different domain
- Verify API URLs in `frontend/src/api/index.js`

**Database errors:**
- Delete `pim_database.db` to reset database
- Check write permissions in the backend directory

## 📝 Example Usage

### Creating a Product via API

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "APPLE-RED-001",
    "name": "Red Apple",
    "description": "Fresh red apples from local farm",
    "price": 2.99,
    "weight": 200,
    "best_before_date": "2026-03-01",
    "specs": {
      "variety": "Gala",
      "origin": "California",
      "organic": "yes"
    }
  }'
```

### Searching Products

```bash
# Search by name
GET /api/products?search=apple

# Filter by category
GET /api/products?category=CATEGORY_ID

# Pagination
GET /api/products?page=2&limit=50
```

## 📄 License

MIT License - feel free to use this for personal or commercial projects.

## 👨‍💻 Author

Created as a starter template for Product Information Management Systems.

---

**Version**: 1.0.0  
**Last Updated**: February 2026
