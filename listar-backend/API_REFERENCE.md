# API Reference

Complete API documentation for ListarPro Backend.

## Base URL

```
Development: http://localhost:3000/wp-json
Production: https://your-domain.com/wp-json
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Authentication Endpoints

### Login
```
POST /jwt-auth/v1/token
```

**Body:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "display_name": "John Doe",
    "first_name": "John",
    "last_name": "Doe",
    "user_photo": "https://...",
    "user_level": 1
  }
}
```

### Register
```
POST /listar/v1/auth/register
```

**Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Validate Token
```
POST /jwt-auth/v1/token/validate
Headers: Authorization: Bearer TOKEN
```

### Get User Profile
```
GET /listar/v1/auth/user
Headers: Authorization: Bearer TOKEN
```

### Update Profile
```
POST /wp/v2/users/me
Headers: Authorization: Bearer TOKEN

Body:
{
  "first_name": "John",
  "last_name": "Doe",
  "description": "About me",
  "user_photo": "https://..."
}
```

---

## Listings/Places

### Get Listings
```
GET /listar/v1/place/list
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 10)
- `s` - Search query
- `category_id` - Filter by category
- `location_id` - Filter by location
- `orderby` - Sort field (date, title, rating)
- `order` - Sort direction (asc, desc)
- `user_id` - Filter by author
- `post_status` - Filter by status (publish, pending, draft)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ID": 1,
      "post_title": "Restaurant Name",
      "post_excerpt": "Description...",
      "post_date": "2024-01-01T00:00:00Z",
      "image": {
        "full": "https://...",
        "thumb": "https://..."
      },
      "category": {
        "term_id": 1,
        "name": "Restaurants",
        "icon": "fas fa-utensils",
        "color": "#FF6B6B"
      },
      "rating_avg": 4.5,
      "rating_count": 10,
      "address": "123 Main St",
      "wishlist": false
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 50,
    "total_pages": 5
  }
}
```

### Get Single Listing
```
GET /listar/v1/place/view?id=1
```

### Create/Update Listing
```
POST /listar/v1/place/save
Headers: Authorization: Bearer TOKEN

Body:
{
  "post_id": 1,  // Optional, for updates
  "title": "Restaurant Name",
  "content": "Full description...",
  "country": 1,
  "state": 2,
  "city": 3,
  "address": "123 Main St",
  "phone": "+1234567890",
  "email": "contact@restaurant.com",
  "website": "https://restaurant.com",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "price_min": "10",
  "price_max": "50",
  "status": "publish"
}
```

### Delete Listing
```
POST /listar/v1/place/delete
Headers: Authorization: Bearer TOKEN

Body:
{
  "post_id": 1
}
```

---

## Categories & Locations

### Get Categories
```
GET /listar/v1/category/list
```

**Query Parameters:**
- `category_id` - Get children of this category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "term_id": 1,
      "name": "Restaurants",
      "slug": "restaurants",
      "icon": "fas fa-utensils",
      "color": "#FF6B6B",
      "count": 25,
      "children": [...]
    }
  ]
}
```

### Get Discovery Categories
```
GET /listar/v1/category/list_discover
```

### Get Locations
```
GET /listar/v1/location/list
```

**Query Parameters:**
- `parent_id` - Get children of this location

---

## Bookings

### Get Booking Form
```
GET /listar/v1/booking/form?resource_id=1
```

### Calculate Price
```
POST /listar/v1/booking/cart
Headers: Authorization: Bearer TOKEN

Body:
{
  "resource_id": 1,
  // Booking-specific parameters based on style
}
```

### Create Booking
```
POST /listar/v1/booking/order
Headers: Authorization: Bearer TOKEN

Body:
{
  "resource_id": 1,
  "payment_method": "paypal",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "memo": "Special requests..."
}
```

### Get User Bookings
```
GET /listar/v1/booking/list
Headers: Authorization: Bearer TOKEN
```

---

## Reviews/Comments

### Get Reviews
```
GET /listar/v1/comments?post_id=1
```

### Submit Review
```
POST /wp/v2/comments
Headers: Authorization: Bearer TOKEN

Body:
{
  "post": 1,
  "content": "Great place!",
  "rating": 5
}
```

---

## Wishlist

### Get Wishlist
```
GET /listar/v1/wishlist/list
Headers: Authorization: Bearer TOKEN
```

### Add to Wishlist
```
POST /listar/v1/wishlist/save
Headers: Authorization: Bearer TOKEN

Body:
{
  "post_id": 1
}
```

### Remove from Wishlist
```
POST /listar/v1/wishlist/remove
Headers: Authorization: Bearer TOKEN

Body:
{
  "post_id": 1
}
```

### Clear Wishlist
```
POST /listar/v1/wishlist/reset
Headers: Authorization: Bearer TOKEN
```

---

## Claims

### Submit Claim
```
POST /listar/v1/claim/submit
Headers: Authorization: Bearer TOKEN

Body:
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "memo": "I own this business..."
}
```

### Get Claims
```
GET /listar/v1/claim/list
Headers: Authorization: Bearer TOKEN
```

---

## Blog/Posts

### Get Posts
```
GET /listar/v1/post/home
```

**Query Parameters:**
- `page` - Page number
- `per_page` - Items per page

### Get Single Post
```
GET /listar/v1/post/view?id=1
```

---

## Media Upload

### Upload File
```
POST /wp/v2/media
Headers:
  Authorization: Bearer TOKEN
  Content-Type: multipart/form-data

Body:
  file: [binary file data]
```

**Response:**
```json
{
  "id": 1,
  "source_url": "https://.../uploads/filename.jpg",
  "media_details": {
    "file": "filename.jpg",
    "filesize": 123456
  }
}
```

---

## Settings

### Get App Settings
```
GET /listar/v1/setting/init
```

### Get Payment Settings
```
GET /listar/v1/setting/payment
```

---

## Home Page

### Get Home Data
```
GET /listar/v1/home/init
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sliders": ["url1", "url2"],
    "categories": [...],
    "locations": [...],
    "recent_posts": [...]
  }
}
```

### Get Home Widgets
```
GET /listar/v1/home/widget
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "error_code"
}
```

**Common Error Codes:**
- `jwt_auth_invalid_token` - Invalid or expired token
- `jwt_auth_no_token` - No token provided
- `user_exists` - Email already registered
- `invalid_username` - User not found
- `incorrect_password` - Wrong password

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

**Development:** No limits

**Production:**
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` - Page number (starts at 1)
- `per_page` - Items per page (default: 10, max: 100)

**Response includes:**
```json
{
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 50,
    "total_pages": 5
  }
}
```

---

## Search & Filtering

**Search:**
```
GET /listar/v1/place/list?s=restaurant
```

**Filter by Category:**
```
GET /listar/v1/place/list?category_id=1
```

**Filter by Location:**
```
GET /listar/v1/place/list?location_id=3
```

**Sort:**
```
GET /listar/v1/place/list?orderby=rating&order=desc
```

**Combined:**
```
GET /listar/v1/place/list?s=pizza&category_id=1&location_id=3&orderby=rating&order=desc&page=1&per_page=20
```

---

## Testing with cURL

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3000/wp-json/jwt-auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@example.com","password":"admin123"}' \
  | jq -r '.data.token')

# Get listings
curl -s http://localhost:3000/wp-json/listar/v1/place/list | jq

# Create listing
curl -X POST http://localhost:3000/wp-json/listar/v1/place/save \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Restaurant","content":"Great food!","status":"publish"}'

# Upload image
curl -X POST http://localhost:3000/wp-json/wp/v2/media \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@image.jpg"
```
