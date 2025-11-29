# ListarPro Backend Setup Guide

Complete guide to set up and run the ListarPro backend that replaces your WordPress installation.

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18 or higher ([Download](https://nodejs.org/))
- PostgreSQL 12 or higher ([Download](https://www.postgresql.org/download/))
- Git
- A code editor (VS Code recommended)

**OR**

- Docker and Docker Compose ([Download](https://www.docker.com/))

## 🚀 Installation Methods

### Method 1: Docker (Easiest - Recommended)

Perfect if you want to get started quickly without installing PostgreSQL.

#### Step 1: Navigate to backend directory
```bash
cd /Users/bdadd/Dev/ListarProOrig/listar-backend
```

#### Step 2: Create environment file
```bash
cp .env.example .env
```

#### Step 3: Edit .env file
Open `.env` and set a strong JWT secret:
```env
JWT_SECRET="change-this-to-a-random-string-min-32-chars"
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-secure-password"
```

#### Step 4: Start everything with Docker
```bash
docker-compose up -d
```

This will:
- Start PostgreSQL database
- Build and start the backend
- Run database migrations
- Seed initial data

#### Step 5: Verify it's running
```bash
curl http://localhost:3000/health
```

You should see: `{"status":"ok","timestamp":"..."}`

#### Step 6: View logs
```bash
docker-compose logs -f backend
```

### Method 2: Manual Installation

If you prefer to run everything locally or already have PostgreSQL installed.

#### Step 1: Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Windows:**
Download from [PostgreSQL.org](https://www.postgresql.org/download/windows/)

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Step 2: Create database
```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE listardb;
CREATE USER listaruser WITH ENCRYPTED PASSWORD 'listarpass';
GRANT ALL PRIVILEGES ON DATABASE listardb TO listaruser;
\q
```

#### Step 3: Navigate and install dependencies
```bash
cd /Users/bdadd/Dev/ListarProOrig/listar-backend
npm install
```

#### Step 4: Setup environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://listaruser:listarpass@localhost:5432/listardb?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

#### Step 5: Run database migrations
```bash
npm run prisma:migrate
```

#### Step 6: Seed database with initial data
```bash
npm run prisma:seed
```

You should see output like:
```
🌱 Seeding database...
✓ Admin user created: admin@example.com
✓ Demo user created: demo@example.com
✓ Categories created
✓ Locations created
✓ Features created
✓ Settings created
✓ Sample posts created
🎉 Database seeded successfully!

📝 Login credentials:
   Email: admin@example.com
   Password: admin123
```

#### Step 7: Start development server
```bash
npm run dev
```

You should see:
```
🚀 ListarPro Backend running on port 3000
📝 Environment: development
🔗 API Base URL: http://localhost:3000/wp-json
```

## 📱 Connect Your Mobile App

### Step 1: Update API endpoint

Edit your mobile app's API configuration:

**File:** `source-expo/app/api/restapi.ts`

Change line 46:
```typescript
// OLD (WordPress):
config.baseURL = `${getDomain()}/wp-json`;

// NEW (Your backend):
config.baseURL = `http://localhost:3000/wp-json`;
```

### Step 2: Test on real device (if needed)

If testing on a real device, use your computer's local IP instead of localhost:

**Find your IP:**
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

Then use that IP:
```typescript
config.baseURL = `http://192.168.1.XXX:3000/wp-json`;
```

### Step 3: Restart your mobile app
```bash
cd ../source-expo
npm start
# Press 'r' to reload
```

## ✅ Verify Everything Works

### Test Authentication
```bash
# Register a new user
curl -X POST http://localhost:3000/wp-json/listar/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "first_name": "Test",
    "last_name": "User"
  }'

# Login
curl -X POST http://localhost:3000/wp-json/jwt-auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "test123"
  }'
```

You should receive a JWT token in the response.

### Test Other Endpoints
```bash
# Get categories
curl http://localhost:3000/wp-json/listar/v1/category/list

# Get settings
curl http://localhost:3000/wp-json/listar/v1/setting/init

# Get home page data
curl http://localhost:3000/wp-json/listar/v1/home/init
```

## 🗄️ Database Management

### View Database with Prisma Studio
```bash
npm run prisma:studio
```

This opens a web UI at http://localhost:5555 where you can:
- Browse all tables
- Edit data
- Add new records
- Delete records

### Common Database Tasks

**Reset database (WARNING: Deletes all data):**
```bash
npm run prisma:migrate reset
```

**Create a new migration after schema changes:**
```bash
npm run prisma:migrate
```

**Re-seed database:**
```bash
npm run prisma:seed
```

## 🔧 Troubleshooting

### Port 3000 already in use
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill

# Or change port in .env
PORT=3001
```

### Database connection failed
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check your DATABASE_URL in .env matches your PostgreSQL credentials
```

### Prisma errors
```bash
# Regenerate Prisma client
npm run prisma:generate

# Reset and re-migrate
npm run prisma:migrate reset
```

### Docker issues
```bash
# Stop all containers
docker-compose down

# Remove volumes and restart fresh
docker-compose down -v
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📊 Production Deployment

### Option 1: Deploy with Docker

1. **Prepare production environment:**
   ```bash
   cp .env.example .env.production
   ```

2. **Edit .env.production:**
   ```env
   DATABASE_URL="postgresql://user:pass@your-db-host:5432/listardb"
   JWT_SECRET="VERY-STRONG-SECRET-KEY-MINIMUM-32-CHARS"
   NODE_ENV="production"
   PORT=3000
   ```

3. **Build and deploy:**
   ```bash
   docker-compose -f docker-compose.yml --env-file .env.production up -d
   ```

### Option 2: Deploy to a VPS (DigitalOcean, AWS, etc.)

1. **SSH into your server**

2. **Install Node.js and PostgreSQL**

3. **Clone your backend:**
   ```bash
   git clone <your-repo>
   cd listar-backend
   ```

4. **Install dependencies:**
   ```bash
   npm ci --production
   ```

5. **Setup environment and database:**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   npm run prisma:migrate
   npm run prisma:seed
   ```

6. **Build:**
   ```bash
   npm run build
   ```

7. **Use PM2 to keep it running:**
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name listar-backend
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx as reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string (32+ characters)
- [ ] Change admin password
- [ ] Use HTTPS (SSL certificate)
- [ ] Enable PostgreSQL SSL connections
- [ ] Configure CORS properly for your domain
- [ ] Set up regular database backups
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Set `NODE_ENV=production`
- [ ] Use environment-specific .env files
- [ ] Don't commit .env files to Git

## 📚 Default Login Credentials

After running `npm run prisma:seed`:

**Admin:**
- Email: `admin@example.com` (or your ADMIN_EMAIL from .env)
- Password: `admin123` (or your ADMIN_PASSWORD from .env)

**Demo:**
- Email: `demo@example.com`
- Password: `demo123`

⚠️ **IMPORTANT:** Change these in production!

## 🆘 Getting Help

If you encounter issues:

1. Check the logs:
   ```bash
   # Manual installation
   npm run dev

   # Docker
   docker-compose logs -f backend
   ```

2. Verify environment variables are set correctly

3. Make sure PostgreSQL is running and accessible

4. Check database connection with:
   ```bash
   npm run prisma:studio
   ```

## 📖 Next Steps

Now that your backend is running:

1. ✅ Test all API endpoints
2. ✅ Connect your mobile app
3. ✅ Test user registration and login
4. ✅ Test creating listings
5. ✅ Set up production deployment
6. ✅ Configure backups
7. ✅ Monitor logs and performance

---

**You're all set! Your ListarPro backend is now ready to replace WordPress! 🎉**
