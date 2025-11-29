# 📱 Connecting Mobile App to New Backend

## ✅ Changes Made

I've updated your mobile app to connect to the new TypeScript backend instead of WordPress.

### File Modified:
**`source-expo/app/api/restapi.ts` (line 47)**

```typescript
// BEFORE (WordPress):
config.baseURL = `${getDomain()}/wp-json`;

// AFTER (New Backend):
config.baseURL = 'http://localhost:3000/wp-json';
```

## 🚀 How to Test

### Step 1: Start the Backend

**Option A - Docker (Easiest):**
```bash
cd listar-backend
docker-compose up -d
```

**Option B - Manual:**
```bash
cd listar-backend
npm run dev
```

**Verify backend is running:**
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Step 2: Start Mobile App

```bash
cd source-expo
npm start
```

Then press:
- `a` - Open on Android
- `i` - Open on iOS
- `w` - Open on Web

### Step 3: Test in the App

1. **Try registering a new user:**
   - Open app
   - Go to Register/Sign Up
   - Create account with email & password

2. **Try logging in:**
   - Use the seeded admin account:
     - Email: `admin@example.com`
     - Password: `admin123`

3. **Test features:**
   - Browse categories
   - View listings
   - Add to wishlist
   - Search listings

## 📱 Testing on Real Device

If testing on a **real device** (not simulator), you need to use your computer's local IP instead of localhost.

### Find Your Local IP:

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

Look for something like `192.168.1.XXX`

### Update the API URL:

Edit `source-expo/app/api/restapi.ts` line 47:

```typescript
// For real device testing:
config.baseURL = 'http://192.168.1.XXX:3000/wp-json';

// Replace XXX with your actual IP
```

## 🔄 Switching Between Backends

You can easily switch between the new backend and WordPress:

### Use New Backend (Current):
```typescript
config.baseURL = 'http://localhost:3000/wp-json';
```

### Use WordPress:
```typescript
config.baseURL = `${getDomain()}/wp-json`;
```

### Use Production Backend:
```typescript
config.baseURL = 'https://your-domain.com/wp-json';
```

## 🧪 Testing Checklist

Test these features to verify everything works:

### Authentication:
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout
- [ ] View profile
- [ ] Update profile
- [ ] Change password

### Listings:
- [ ] View listing list
- [ ] Search listings
- [ ] Filter by category
- [ ] Filter by location
- [ ] View listing details
- [ ] Create new listing (if logged in)

### Categories:
- [ ] View categories
- [ ] Browse by category
- [ ] View discovery/featured categories

### Wishlist:
- [ ] Add listing to wishlist
- [ ] View wishlist
- [ ] Remove from wishlist
- [ ] Clear wishlist

### Reviews:
- [ ] View reviews on listing
- [ ] Submit review (if logged in)
- [ ] Rating system

### Other Features:
- [ ] Home page loads
- [ ] Settings/configuration loads
- [ ] Blog posts (if applicable)
- [ ] Media uploads work

## 🐛 Troubleshooting

### Problem: "Network Error" or "Connection Refused"

**Solution 1:** Make sure backend is running
```bash
curl http://localhost:3000/health
```

**Solution 2:** Check if port 3000 is correct
```bash
# Backend should show:
🚀 ListarPro Backend running on port 3000
```

**Solution 3:** For real device, use local IP not localhost
```typescript
config.baseURL = 'http://192.168.1.XXX:3000/wp-json';
```

### Problem: "Invalid token" or authentication errors

**Solution:** Clear app data and try logging in again
- On iOS Simulator: Device → Erase All Content and Settings
- On Android: Settings → Apps → Your App → Clear Data

### Problem: No data showing

**Solution:** Make sure backend database is seeded
```bash
cd listar-backend
npm run prisma:seed
```

### Problem: App crashes or blank screens

**Solution 1:** Check backend logs for errors
```bash
# Docker:
docker-compose logs -f backend

# Manual:
# Check terminal where npm run dev is running
```

**Solution 2:** Restart Metro bundler
```bash
# In source-expo directory
# Press Ctrl+C to stop
npm start
# Press 'r' to reload
```

## 📊 Backend URL Configuration

### Development URLs:

| Environment | URL | Use Case |
|-------------|-----|----------|
| iOS Simulator | `http://localhost:3000/wp-json` | Default, works great |
| Android Emulator | `http://10.0.2.2:3000/wp-json` | Android emulator special IP |
| Real Device | `http://192.168.1.XXX:3000/wp-json` | Replace XXX with your IP |
| Web Browser | `http://localhost:3000/wp-json` | Web development |

### Production URL:
```typescript
config.baseURL = 'https://api.yourdomain.com/wp-json';
```

## 🔍 Verify Connection

Check Metro bundler logs for API calls:

```
Before Request >>> {
  url: '/listar/v1/setting/init',
  baseURL: 'http://localhost:3000/wp-json',
  method: 'get',
  ...
}

After Response >>> {
  status: 200,
  data: { success: true, ... }
}
```

If you see these logs with `baseURL: 'http://localhost:3000/wp-json'`, you're connected to the new backend! ✅

## 📖 Next Steps

1. ✅ Mobile app now points to new backend
2. ✅ Test all major features
3. 📝 Report any issues or missing features
4. 🚀 When ready, deploy backend to production
5. 🔄 Update mobile app with production URL

## 💡 Tips

- **Keep both backends running** during testing (old WordPress and new backend)
- **Use feature flags** to easily switch between backends
- **Test thoroughly** before removing WordPress
- **Monitor backend logs** to catch any API issues
- **Use Prisma Studio** to inspect database: `npm run prisma:studio`

## 🎯 Current Configuration

✅ **Mobile App:** Points to `http://localhost:3000/wp-json`
✅ **Backend:** Running on port 3000
✅ **Database:** PostgreSQL with seeded data
✅ **Default Login:** admin@example.com / admin123

---

**Your app is now connected to the new backend! Start testing! 🎉**
