# EAS Build Quick Start Guide

## ✅ Setup Complete!

Your ListarPro Expo app is ready for EAS Build. Here's what's configured:

- **EAS CLI**: v16.28.0 ✅
- **Project ID**: a89183a5-6f5a-4adb-a95a-71e747728d12 ✅
- **Bundle ID**: com.passionui.listarpro ✅
- **Dependencies**: Installed ✅

---

## 🚀 How to Build & Test with EAS

### Step 1: Login to Expo Account

**You need an Expo account** (free at expo.dev)

```bash
cd /home/user/ListarProOrig/source-expo
eas login
```

**Options:**
- If you have an account: Enter your Expo username/email and password
- If you don't have an account: Run `eas register` first, or sign up at https://expo.dev

---

### Step 2: Choose Your Build Profile

You have 4 build profiles available:

#### **A. Development Simulator Build** (Recommended for testing without Mac)
```bash
eas build --platform ios --profile development-simulator
```
- ✅ Runs on Mac iOS Simulator
- ✅ Includes dev tools and debugging
- ✅ Can be shared with team members who have Macs
- ⏱️ Build time: ~15-20 minutes

#### **B. Development Build** (For physical iPhone)
```bash
eas build --platform ios --profile development
```
- ✅ Runs on real iPhone/iPad
- ✅ Includes dev tools
- ⚠️ **Requires**: Apple Developer Account (can use free account for 7-day testing)
- ⚠️ **Requires**: Device UDID registration
- ⏱️ Build time: ~15-20 minutes

#### **C. Preview Build** (Internal testing)
```bash
eas build --platform ios --profile preview
```
- ✅ Pre-production testing
- ✅ No dev tools (more like production)
- ⚠️ **Requires**: Apple Developer Account
- ⏱️ Build time: ~15-20 minutes

#### **D. Production Build** (App Store ready)
```bash
eas build --platform ios --profile production
```
- ✅ Optimized for App Store
- ✅ Ready to submit
- ⚠️ **Requires**: Paid Apple Developer Account ($99/year)
- ⏱️ Build time: ~15-20 minutes

---

### Step 3: Start the Build

**For Simulator (No Apple Account Needed):**
```bash
cd /home/user/ListarProOrig/source-expo
eas build --platform ios --profile development-simulator
```

**What happens:**
1. ✅ EAS validates your project
2. ✅ Uploads your code to EAS servers
3. ✅ Builds the app in the cloud
4. ✅ Provides a download link when complete

**Sample output:**
```
✔ Build completed!
Build URL: https://expo.dev/accounts/yourname/projects/listarpro/builds/abc123
Download: https://expo.dev/artifacts/eas/abc123.tar.gz
```

---

### Step 4: Download & Install

#### **For Simulator Build:**

**On a Mac:**
```bash
# Download the build (replace URL with your actual build URL)
curl -L -o listarpro-simulator.tar.gz "YOUR_BUILD_DOWNLOAD_URL"

# Extract
tar -xzf listarpro-simulator.tar.gz

# Install to simulator
xcrun simctl install booted listarpro.app

# Or drag the .app file to your simulator
```

**Or use EAS helper:**
```bash
eas build:run --profile development-simulator --platform ios
```

#### **For Physical Device Build:**

**Option 1: Install via Link**
- Open the build URL on your iPhone
- Tap "Install"
- Trust the certificate: Settings → General → VPN & Device Management

**Option 2: Use Apple Configurator** (Mac required)
- Download the .ipa file
- Connect iPhone via USB
- Use Apple Configurator to install

---

### Step 5: Test Your App

Once installed, you can test:

**Simulator Testing:**
- ✅ Full UI/UX testing
- ✅ Navigation and flows
- ✅ API integration
- ✅ Redux state management
- ✅ Camera (simulated)
- ✅ Location (simulated)

**Physical Device Testing:**
- ✅ Real camera functionality
- ✅ Real GPS/location
- ✅ Push notifications
- ✅ Performance testing
- ✅ Real-world scenarios

---

## 🔄 Making Updates

After you make code changes, you have two options:

### **Option A: New Build** (For native changes)
```bash
# Rebuild completely
eas build --platform ios --profile development-simulator
```
Use this when:
- You changed native dependencies
- You updated Expo config
- You changed iOS permissions

### **Option B: Over-The-Air (OTA) Update** (For JS changes only)
```bash
# Quick JS updates
eas update --branch development
```
Use this when:
- You only changed JavaScript/TypeScript code
- You updated UI components
- You fixed bugs in app logic

---

## 📊 Monitor Your Builds

**View build status:**
```bash
# List all builds
eas build:list

# View specific build
eas build:view [BUILD_ID]

# View build logs
eas build:logs [BUILD_ID]
```

**Web Dashboard:**
- Go to https://expo.dev
- Navigate to your project
- View Builds tab
- See build history, logs, and artifacts

---

## 🐛 Troubleshooting

### "Not logged in"
```bash
eas login
```

### "Project not configured"
```bash
eas build:configure
```

### "Build failed"
```bash
# View logs
eas build:logs [BUILD_ID]

# Common issues:
# - Check app.json for valid bundle identifier
# - Ensure all assets exist (icon, splash screen)
# - Check for TypeScript errors: npm run tsc
```

### "Cannot install on device"
```bash
# For physical devices, check:
# 1. Device UDID is registered
# 2. Provisioning profile includes your device
# 3. Certificate is trusted on device
```

---

## 💡 Tips & Best Practices

**1. Start with Simulator Build**
- Fastest to test
- No Apple account needed
- Good for development iteration

**2. Use Development Profile During Development**
- Includes useful debugging tools
- Hot reload support
- Error messages

**3. Test on Physical Device Before Production**
- Camera, GPS, notifications behave differently
- Performance varies from simulator
- Test on multiple iOS versions

**4. Use Preview for Beta Testing**
- Share with testers via TestFlight
- More stable than development builds
- Close to production experience

**5. Monitor Build Minutes**
- Free tier: 30 builds/month
- Check usage: https://expo.dev/accounts/[username]/settings/billing

---

## 📋 Quick Command Reference

```bash
# Login
eas login

# Build simulator
eas build --platform ios --profile development-simulator

# Build device
eas build --platform ios --profile development

# List builds
eas build:list

# Install build
eas build:run --profile development-simulator --platform ios

# View logs
eas build:logs [BUILD_ID]

# OTA update
eas update --branch development

# Submit to App Store
eas submit --platform ios

# Check account info
eas whoami

# Logout
eas logout
```

---

## 🎯 Recommended Testing Workflow

### Phase 1: Initial Testing (Simulator)
```bash
# Build for simulator
eas build --platform ios --profile development-simulator

# Install on Mac simulator
# Test core functionality
# Fix bugs
```

### Phase 2: Device Testing
```bash
# Build for your iPhone
eas build --platform ios --profile development

# Register your device UDID when prompted
# Install on device
# Test camera, location, notifications
```

### Phase 3: Beta Testing (TestFlight)
```bash
# Build production version
eas build --platform ios --profile production

# Submit to App Store Connect
eas submit --platform ios

# Add beta testers in App Store Connect
```

---

## 📞 Need Help?

- **EAS Documentation**: https://docs.expo.dev/build/introduction/
- **Expo Forums**: https://forums.expo.dev
- **Build Status**: https://expo.dev/accounts/[username]/projects/listarpro/builds

---

## ⚡ Next Steps

1. **Login to Expo**: `eas login`
2. **Start your first build**: `eas build --platform ios --profile development-simulator`
3. **Wait for build to complete** (~15-20 min)
4. **Download and test** on Mac simulator
5. **Iterate and improve** your app

**Ready to build? Run:**
```bash
cd /home/user/ListarProOrig/source-expo
eas login
eas build --platform ios --profile development-simulator
```

Good luck! 🚀
