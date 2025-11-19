# 🚀 GlacierFarm Netlify Serverless API Documentation

**Status:** ✅ FULLY FUNCTIONAL  
**Date:** November 17, 2025  
**Version:** 1.0.0  
**Environment:** Production-Ready

---

## 📋 Quick Start

### API Base URL
- **Development:** `http://localhost:3000/api`
- **Production:** `https://glacierfarm.netlify.app/api`

### Health Check
```bash
curl https://glacierfarm.netlify.app/health
```

Expected Response:
```json
{
  "message": "GlacierFarm Netlify Functions are healthy",
  "timestamp": "2025-11-17T10:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

---

## 🔐 Authentication

All endpoints (except `/login` and `/signup`) require a Bearer token.

### How to Authenticate

1. **Login with credentials:**
```bash
curl -X POST https://glacierfarm.netlify.app/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "password123"
  }'
```

2. **Get token from response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1234567890",
    "email": "farmer@example.com",
    "farmName": "Green Valley Farm",
    "location": "California",
    "phone": "+1-555-0123"
  }
}
```

3. **Use token in requests:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  https://glacierfarm.netlify.app/api/products
```

---

## 👤 User Endpoints

### 1. Signup (Register New Farmer)

**Endpoint:** `POST /api/signup`

**Request:**
```bash
curl -X POST https://glacierfarm.netlify.app/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "farmName": "Green Valley Farm",
    "email": "farmer@example.com",
    "location": "California",
    "phone": "+1-555-0123",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1234567890",
    "email": "farmer@example.com",
    "farmName": "Green Valley Farm",
    "location": "California",
    "phone": "+1-555-0123"
  }
}
```

**Error Responses:**
```json
// 400: Invalid input
{ "error": "All fields are required" }

// 400: Password mismatch
{ "error": "Passwords do not match" }

// 400: Password too short
{ "error": "Password must be at least 6 characters" }

// 400: User already exists
{ "error": "User already exists" }
```

**Validation Rules:**
- `farmName`: Required, non-empty string
- `email`: Required, valid email format
- `location`: Required, non-empty string
- `phone`: Required, non-empty string
- `password`: Required, minimum 6 characters
- `confirmPassword`: Must match password

---

### 2. Login

**Endpoint:** `POST /api/login`

**Request:**
```bash
curl -X POST https://glacierfarm.netlify.app/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "SecurePass123"
  }'
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1234567890",
    "email": "farmer@example.com",
    "farmName": "Green Valley Farm",
    "location": "California",
    "phone": "+1-555-0123"
  }
}
```

**Error Responses:**
```json
// 400: Missing fields
{ "error": "Email and password required" }

// 401: Invalid credentials
{ "error": "Invalid credentials" }
```

**Token Details:**
- **Expiration:** 7 days
- **Algorithm:** HS256
- **Format:** `Bearer <token>`

---

### 3. Get Current User

**Endpoint:** `GET /api/me`

**Request:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  https://glacierfarm.netlify.app/api/me
```

**Success Response (200):**
```json
{
  "user": {
    "id": "user_1234567890",
    "email": "farmer@example.com",
    "farmName": "Green Valley Farm",
    "location": "California",
    "phone": "+1-555-0123"
  }
}
```

**Error Responses:**
```json
// 401: No token provided
{ "error": "Access token required" }

// 403: Invalid token
{ "error": "Invalid or expired token" }

// 404: User not found
{ "error": "User not found" }
```

---

## 📦 Products Endpoints

### 1. Get All Products

**Endpoint:** `GET /api/products`

**Request:**
```bash
curl -H "Authorization: Bearer <token>" \
  https://glacierfarm.netlify.app/api/products
```

**Success Response (200):**
```json
{
  "products": [
    {
      "id": "product_1234567890",
      "userId": "user_1234567890",
      "name": "Organic Tomatoes",
      "description": "Fresh organic tomatoes",
      "quantity": 100,
      "price": 2.50,
      "createdAt": "2025-11-17T10:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
```json
// 401: Unauthorized
{ "error": "Access token required" }

// 403: Invalid token
{ "error": "Invalid or expired token" }
```

---

### 2. Create Product

**Endpoint:** `POST /api/products`

**Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Organic Tomatoes",
    "description": "Fresh organic tomatoes",
    "quantity": 100,
    "price": 2.50
  }' \
  https://glacierfarm.netlify.app/api/products
```

**Success Response (201):**
```json
{
  "product": {
    "id": "product_1234567890",
    "userId": "user_1234567890",
    "name": "Organic Tomatoes",
    "description": "Fresh organic tomatoes",
    "quantity": 100,
    "price": 2.50,
    "createdAt": "2025-11-17T10:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// 400: Missing required fields
{ "error": "Name, quantity, and price required" }
```

**Validation Rules:**
- `name`: Required, non-empty string
- `quantity`: Required, positive integer
- `price`: Required, positive number
- `description`: Optional

---

## 📋 Orders Endpoints

### 1. Get All Orders

**Endpoint:** `GET /api/orders`

**Request:**
```bash
curl -H "Authorization: Bearer <token>" \
  https://glacierfarm.netlify.app/api/orders
```

**Success Response (200):**
```json
{
  "orders": [
    {
      "id": "order_1234567890",
      "userId": "user_1234567890",
      "productId": "product_1234567890",
      "quantity": 50,
      "totalPrice": 125.00,
      "status": "pending",
      "createdAt": "2025-11-17T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Create Order

**Endpoint:** `POST /api/orders`

**Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product_1234567890",
    "quantity": 50,
    "totalPrice": 125.00
  }' \
  https://glacierfarm.netlify.app/api/orders
```

**Success Response (201):**
```json
{
  "order": {
    "id": "order_1234567890",
    "userId": "user_1234567890",
    "productId": "product_1234567890",
    "quantity": 50,
    "totalPrice": 125.00,
    "status": "pending",
    "createdAt": "2025-11-17T10:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// 400: Missing required fields
{ "error": "Product ID, quantity, and total price required" }
```

**Validation Rules:**
- `productId`: Required, non-empty string
- `quantity`: Required, positive integer
- `totalPrice`: Required, positive number

---

## 🏪 Storage Units Endpoints

### 1. Get All Storage Units

**Endpoint:** `GET /api/storage-units`

**Request:**
```bash
curl -H "Authorization: Bearer <token>" \
  https://glacierfarm.netlify.app/api/storage-units
```

**Success Response (200):**
```json
{
  "storageUnits": [
    {
      "id": "unit_1234567890",
      "userId": "user_1234567890",
      "name": "Cold Storage Unit A",
      "capacity": 1000,
      "temperature": -18,
      "location": "Building A",
      "status": "active",
      "createdAt": "2025-11-17T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Create Storage Unit

**Endpoint:** `POST /api/storage-units`

**Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cold Storage Unit A",
    "capacity": 1000,
    "temperature": -18,
    "location": "Building A"
  }' \
  https://glacierfarm.netlify.app/api/storage-units
```

**Success Response (201):**
```json
{
  "storageUnit": {
    "id": "unit_1234567890",
    "userId": "user_1234567890",
    "name": "Cold Storage Unit A",
    "capacity": 1000,
    "temperature": -18,
    "location": "Building A",
    "status": "active",
    "createdAt": "2025-11-17T10:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// 400: Missing required fields
{ "error": "Name, capacity, and temperature required" }
```

**Validation Rules:**
- `name`: Required, non-empty string
- `capacity`: Required, positive integer
- `temperature`: Required, number (can be negative)
- `location`: Optional

---

## 🧪 Testing Guide

### Test 1: Health Check
```bash
# Should return 200 OK
curl https://glacierfarm.netlify.app/health
```

### Test 2: Signup Flow
```bash
# Create new user
curl -X POST https://glacierfarm.netlify.app/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "farmName": "Test Farm",
    "email": "test@example.com",
    "location": "Test City",
    "phone": "+1-555-0000",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }'
```

### Test 3: Login Flow
```bash
# Use credentials from signup
curl -X POST https://glacierfarm.netlify.app/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Save token from response
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Test 4: Create Product
```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "A test product",
    "quantity": 50,
    "price": 10.00
  }' \
  https://glacierfarm.netlify.app/api/products
```

### Test 5: Get Products
```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://glacierfarm.netlify.app/api/products
```

### Test 6: Create Order
```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product_1234567890",
    "quantity": 25,
    "totalPrice": 250.00
  }' \
  https://glacierfarm.netlify.app/api/orders
```

### Test 7: Create Storage Unit
```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Storage",
    "capacity": 500,
    "temperature": -20,
    "location": "Test Location"
  }' \
  https://glacierfarm.netlify.app/api/storage-units
```

---

## 🔒 Security Features

### 1. Authentication
- ✅ JWT token-based authentication
- ✅ Token expiration: 7 days
- ✅ Password hashing with bcrypt
- ✅ Secure token verification

### 2. Authorization
- ✅ All data endpoints require authentication
- ✅ Users can only access their own data
- ✅ userId validated on every request

### 3. CORS
- ✅ Configurable origin validation
- ✅ Credentials allowed
- ✅ Proper headers set

### 4. Validation
- ✅ All inputs validated
- ✅ Type checking
- ✅ Required field checking
- ✅ Format validation

### 5. Error Handling
- ✅ Proper HTTP status codes
- ✅ Descriptive error messages
- ✅ No sensitive data exposed
- ✅ Unhandled errors caught

---

## 📊 Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | No token provided |
| 403 | Forbidden | Invalid token |
| 404 | Not Found | User not found |
| 500 | Server Error | Unhandled exception |

---

## 🌐 Environment Variables

### Required (Netlify Dashboard)
```
JWT_SECRET=your-secret-key
FRONTEND_URL=https://glacierfarm.netlify.app
NODE_ENV=production
```

### Optional
```
PORT=3001
MONGO_URI=mongodb://localhost:27017/glacierfarm
```

---

## 📱 Client Integration

### React Example
```javascript
// Login
const response = await fetch('https://glacierfarm.netlify.app/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'farmer@example.com',
    password: 'password123'
  })
});

const { token, user } = await response.json();
localStorage.setItem('token', token);

// Get Products
const productsRes = await fetch('https://glacierfarm.netlify.app/api/products', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const { products } = await productsRes.json();
```

---

## 🚀 Deployment Checklist

- [x] API endpoints implemented
- [x] Authentication configured
- [x] Error handling added
- [x] Validation implemented
- [x] Environment variables set
- [x] CORS configured
- [x] Security headers added
- [x] Tests passing
- [x] Documentation complete
- [x] Production-ready

---

## 📞 Troubleshooting

### Issue: "Access token required"
**Solution:** Make sure you're including the Authorization header with Bearer token

### Issue: "Invalid or expired token"
**Solution:** Generate new token by logging in again

### Issue: CORS errors
**Solution:** Check FRONTEND_URL environment variable matches your domain

### Issue: "User not found" after login
**Solution:** Try signing up first with a new email address

---

## 🔄 API Status

| Endpoint | Status | Notes |
|----------|--------|-------|
| POST /api/signup | ✅ Live | Creating new users |
| POST /api/login | ✅ Live | Authenticating users |
| GET /api/me | ✅ Live | User info retrieval |
| GET /api/products | ✅ Live | List user products |
| POST /api/products | ✅ Live | Create products |
| GET /api/orders | ✅ Live | List user orders |
| POST /api/orders | ✅ Live | Create orders |
| GET /api/storage-units | ✅ Live | List storage units |
| POST /api/storage-units | ✅ Live | Create storage units |
| GET /health | ✅ Live | Health check |

---

**Last Updated:** November 17, 2025  
**Status:** ✅ PRODUCTION READY  
**Support:** Contact development team
