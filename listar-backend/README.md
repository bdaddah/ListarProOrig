# ListarPro Backend

TypeScript/Node.js backend for the ListarPro mobile directory app - a complete WordPress replacement.

## Features

✨ **Complete WordPress API Compatibility** - Drop-in replacement for WordPress endpoints used by the mobile app

🔐 **JWT Authentication** - Secure token-based authentication with user management

📱 **Full-Featured Directory Platform**:
- Listings management with categories, locations, and features
- Multi-style booking system (Standard, Daily, Hourly, Table, Slot)
- Reviews and ratings
- Wishlist functionality
- Business claiming system
- Blog/Posts
- Media uploads
- Customizable widgets and home screen

🗄️ **PostgreSQL Database** - Robust relational database with Prisma ORM

🐳 **Docker Support** - Easy deployment with Docker and Docker Compose

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: express-fileupload, multer
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+ (or use Docker)
- Git

## Quick Start

### Option 1: Docker (Recommended)

1. **Clone and setup**:
   ```bash
   cd listar-backend
   cp .env.example .env
   ```

2. **Edit `.env` file** with your configuration (especially JWT_SECRET)

3. **Start with Docker**:
   ```bash
   docker-compose up -d
   ```

4. **Access the API**:
   - API: http://localhost:3000/wp-json
   - Health check: http://localhost:3000/health

### Option 2: Manual Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup database**:
   ```bash
   # Create PostgreSQL database
   createdb listardb

   # Run migrations
   npm run prisma:migrate

   # Seed initial data
   npm run prisma:seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication (JWT)
- `POST /wp-json/jwt-auth/v1/token` - Login
- `POST /wp-json/jwt-auth/v1/token/validate` - Validate token
- `POST /wp-json/listar/v1/auth/register` - Register
- `POST /wp-json/listar/v1/auth/reset_password` - Forgot password
- `GET /wp-json/listar/v1/auth/user` - Get user profile
- `POST /wp-json/listar/v1/auth/otp` - Request OTP
- `POST /wp-json/listar/v1/auth/deactivate` - Deactivate account

### Listings/Places
- `GET /wp-json/listar/v1/place/list` - Get listings
- `GET /wp-json/listar/v1/place/view?id={id}` - Get listing detail
- `POST /wp-json/listar/v1/place/save` - Create/update listing
- `POST /wp-json/listar/v1/place/delete` - Delete listing
- `GET /wp-json/listar/v1/place/form` - Get submit form settings
- `GET /wp-json/listar/v1/place/terms` - Get tags

### Categories & Locations
- `GET /wp-json/listar/v1/category/list` - Get categories
- `GET /wp-json/listar/v1/category/list_discover` - Get featured categories
- `GET /wp-json/listar/v1/location/list` - Get locations

### Bookings
- `GET /wp-json/listar/v1/booking/form?resource_id={id}` - Get booking form
- `POST /wp-json/listar/v1/booking/cart` - Calculate price
- `POST /wp-json/listar/v1/booking/order` - Create booking
- `GET /wp-json/listar/v1/booking/list` - Get user bookings

### Reviews/Comments
- `GET /wp-json/listar/v1/comments?post_id={id}` - Get comments
- `POST /wp-json/wp/v2/comments` - Save comment/review

### Wishlist
- `GET /wp-json/listar/v1/wishlist/list` - Get wishlist
- `POST /wp-json/listar/v1/wishlist/save` - Add to wishlist
- `POST /wp-json/listar/v1/wishlist/remove` - Remove from wishlist
- `POST /wp-json/listar/v1/wishlist/reset` - Clear wishlist

### Claims
- `POST /wp-json/listar/v1/claim/submit` - Submit claim
- `GET /wp-json/listar/v1/claim/list` - Get claims

### Blog/Posts
- `GET /wp-json/listar/v1/post/home` - Get posts
- `GET /wp-json/listar/v1/post/view?id={id}` - Get post detail

### Media
- `POST /wp-json/wp/v2/media` - Upload file

### Settings & Home
- `GET /wp-json/listar/v1/setting/init` - Get app settings
- `GET /wp-json/listar/v1/setting/payment` - Get payment methods
- `GET /wp-json/listar/v1/home/init` - Get home page data
- `GET /wp-json/listar/v1/home/widget` - Get home widgets

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/listardb"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
UPLOAD_DIR="./uploads"
PER_PAGE=10
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

## Database Management

```bash
# Create a new migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Seed database with initial data
npm run prisma:seed

# Generate Prisma client
npm run prisma:generate
```

## Project Structure

```
listar-backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── controllers/       # Route controllers
│   ├── routes/            # Express routes
│   ├── middlewares/       # Custom middleware
│   ├── utils/             # Utility functions
│   ├── services/          # Business logic
│   ├── types/             # TypeScript types
│   └── index.ts           # Main entry point
├── uploads/               # Uploaded files
├── .env.example           # Environment template
├── docker-compose.yml     # Docker configuration
├── Dockerfile             # Docker build file
├── package.json
└── tsconfig.json
```

## Development

```bash
# Run in development mode (with auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## Connecting Your Mobile App

Update your mobile app's API domain in:

```typescript
// app/api/restapi.ts
config.baseURL = `http://localhost:3000/wp-json`;
```

For production, replace with your production URL:
```typescript
config.baseURL = `https://your-domain.com/wp-json`;
```

## Default Credentials

After seeding the database:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Demo Account:**
- Email: `demo@example.com`
- Password: `demo123`

⚠️ **Change these credentials in production!**

## Production Deployment

### Using Docker

1. Update `.env` for production
2. Build and start:
   ```bash
   docker-compose up -d --build
   ```

### Manual Deployment

1. Set `NODE_ENV=production`
2. Build the project: `npm run build`
3. Set up PostgreSQL database
4. Run migrations: `npm run prisma:migrate`
5. Seed database: `npm run prisma:seed`
6. Start server: `npm start`

### Using PM2 (Process Manager)

```bash
npm install -g pm2
pm2 start dist/index.js --name listar-backend
pm2 startup
pm2 save
```

## Security Considerations

1. **Change JWT_SECRET** to a strong random string
2. **Use HTTPS** in production
3. **Configure CORS** properly for your domain
4. **Set strong passwords** for database and admin accounts
5. **Enable rate limiting** for API endpoints
6. **Regular backups** of database
7. **Update dependencies** regularly

## Troubleshooting

**Database connection issues:**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Verify DATABASE_URL in .env
```

**Migration issues:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Re-run migrations
npx prisma migrate deploy
```

**Port already in use:**
```bash
# Change PORT in .env or kill process
lsof -ti:3000 | xargs kill
```

## Support & Contributing

For issues or feature requests, please create an issue in the repository.

## License

MIT License

---

**Built with ❤️ for the ListarPro mobile app**
