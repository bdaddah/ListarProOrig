# ⚡ Quick Start - 5 Minutes to Running Backend

## 🐳 Fastest Way (Docker)

```bash
cd /Users/bdadd/Dev/ListarProOrig/listar-backend

# 1. Create environment file
cp .env.example .env

# 2. Edit .env (REQUIRED - change JWT_SECRET!)
nano .env
# Set: JWT_SECRET="your-random-32-char-string"

# 3. Start everything
docker-compose up -d

# 4. Check it's running
curl http://localhost:3000/health

# 5. View logs
docker-compose logs -f backend
```

**Done!** Backend is running at `http://localhost:3000`

Default login:
- Email: `admin@example.com`
- Password: `admin123`

---

## 💻 Manual Setup (No Docker)

```bash
cd /Users/bdadd/Dev/ListarProOrig/listar-backend

# 1. Install dependencies
npm install

# 2. Create & configure .env
cp .env.example .env
# Edit DATABASE_URL and JWT_SECRET

# 3. Setup database
npm run prisma:migrate
npm run prisma:seed

# 4. Start server
npm run dev
```

**Running at:** `http://localhost:3000`

---

## 📱 Connect Mobile App

Edit: `source-expo/app/api/restapi.ts` (line 46)

```typescript
// Change from:
config.baseURL = `${getDomain()}/wp-json`;

// To:
config.baseURL = `http://localhost:3000/wp-json`;
```

Restart your app - Done!

---

## 🧪 Test It Works

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/wp-json/jwt-auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@example.com","password":"admin123"}'

# Get categories
curl http://localhost:3000/wp-json/listar/v1/category/list

# Get listings
curl http://localhost:3000/wp-json/listar/v1/place/list
```

---

## 🛠️ Common Commands

```bash
# Start backend
npm run dev                    # Development with hot-reload
npm start                      # Production

# Database
npm run prisma:studio         # Visual database browser (http://localhost:5555)
npm run prisma:migrate        # Run migrations
npm run prisma:seed           # Seed data

# Docker
docker-compose up -d          # Start
docker-compose down           # Stop
docker-compose logs -f        # View logs
docker-compose restart        # Restart
```

---

## 📚 Next Steps

1. ✅ Backend running
2. ✅ Mobile app connected
3. 📖 Read full docs: `README.md`
4. 🗄️ Explore database: `npm run prisma:studio`
5. 🚀 Deploy to production: see `SETUP.md`

---

## 🆘 Troubleshooting

**Port 3000 in use?**
```bash
lsof -ti:3000 | xargs kill
# Or change PORT in .env
```

**Database error?**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Reset database
npm run prisma:migrate reset
```

**Docker issues?**
```bash
# Clean restart
docker-compose down -v
docker-compose up -d --build
```

---

## 📞 Documentation

- 📖 **Full Setup:** `SETUP.md`
- 🔄 **WordPress Migration:** `MIGRATION_GUIDE.md`
- 📚 **API Reference:** `API_REFERENCE.md`
- 📋 **Features:** `README.md`
- 📊 **Summary:** `../BACKEND_SUMMARY.md`

---

**That's it! You're ready to go! 🎉**
