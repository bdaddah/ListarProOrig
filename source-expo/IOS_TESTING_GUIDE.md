# iOS Testing Guide for ListarPro

## 🎯 Quick Decision Guide

**Do you have a Mac?**
- ✅ **YES** → Go to [Option 1: Mac + Xcode](#option-1-mac-with-xcode-recommended)
- ❌ **NO** → Go to [Option 2: EAS Build](#option-2-eas-build-no-mac-needed)

---

## Option 1: Mac with Xcode (Recommended)

### Prerequisites
- macOS computer
- Xcode 15+ (from App Store)
- Node.js 18+ installed
- CocoaPods installed: `sudo gem install cocoapods`

### Setup Steps

#### 1. Clone and Install
```bash
# Clone the repository
git clone https://github.com/bdaddah/ListarProOrig.git
cd ListarProOrig/source-expo

# Install JavaScript dependencies
npm install

# Install iOS dependencies
cd ios
pod install
cd ..
```

#### 2. Run in iOS Simulator
```bash
# Start Metro bundler and iOS simulator
npm run ios

# Or specify a specific simulator
npx expo run:ios --device "iPhone 15 Pro"

# See available simulators
xcrun simctl list devices available
```

#### 3. Open in Xcode (Optional)
```bash
# Open workspace in Xcode
open ios/listarpro.xcworkspace
```

Then in Xcode:
- Select your target device/simulator
- Press ▶️ (Run button) or Cmd+R

### Testing Capabilities on Simulator
- ✅ Full UI/UX testing
- ✅ Navigation flows
- ✅ Redux state management
- ✅ API calls
- ✅ Camera (simulated with sample images)
- ✅ Location (can set mock locations)
- ✅ Notifications
- ✅ Performance profiling

---

## Option 2: EAS Build (No Mac Needed)

### Prerequisites
- Expo account (free at expo.dev)
- EAS CLI installed

### Setup Steps

#### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 2. Login to Expo
```bash
eas login
```

#### 3. Configure Project (if not already done)
```bash
cd source-expo
eas build:configure
```

#### 4. Build for iOS Simulator
```bash
# Build for iOS simulator (can download and run on Mac)
eas build --platform ios --profile development-simulator
```

#### 5. Build for Physical Device (Requires Apple Developer Account)
```bash
# Build development client
eas build --platform ios --profile development

# Follow the prompts to:
# - Sign in to Apple Developer account
# - Register your device UDID
# - Create provisioning profile
```

#### 6. Install on Device
- After build completes, you'll get a download link
- Download the .ipa file
- Install using Apple Configurator or Xcode
- Or use: `eas build:run --profile development --platform ios`

---

## Option 3: Physical iPhone Testing (Mac Required)

### Prerequisites
- Mac with Xcode
- iPhone connected via USB
- Apple Developer Account (free or paid)

### Steps

#### 1. Connect iPhone
- Connect iPhone to Mac via USB
- Trust the computer on iPhone when prompted

#### 2. Configure Signing in Xcode
```bash
cd source-expo
open ios/listarpro.xcworkspace
```

In Xcode:
1. Select `listarpro` project in navigator
2. Select `listarpro` target
3. Go to "Signing & Capabilities" tab
4. Select your Team (Apple ID)
5. Xcode will automatically create provisioning profile

#### 3. Run on Device
```bash
# Run on connected device
npm run ios --device
```

Or in Xcode:
- Select your iPhone from device dropdown
- Press ▶️ Run

#### 4. Trust Developer Certificate
On your iPhone:
- Settings → General → VPN & Device Management
- Trust your developer certificate

---

## Option 4: TestFlight (Production Testing)

### Prerequisites
- Apple Developer Account ($99/year)
- App Store Connect access

### Steps

#### 1. Build Production Version
```bash
eas build --platform ios --profile production
```

#### 2. Submit to App Store Connect
```bash
eas submit --platform ios
```

#### 3. Set Up TestFlight
1. Go to App Store Connect
2. Navigate to your app → TestFlight
3. Add internal/external testers
4. Testers will receive invitation via email

#### 4. Testers Install
- Testers install TestFlight app from App Store
- Accept invitation
- Install ListarPro from TestFlight

---

## Troubleshooting

### "No development team selected"
**Solution:** Sign in to Xcode with your Apple ID
```
Xcode → Settings → Accounts → Add Apple ID
```

### "Failed to install CocoaPods"
**Solution:** Install/update CocoaPods
```bash
sudo gem install cocoapods
cd ios && pod install
```

### "Unable to boot simulator"
**Solution:** Reset simulator
```bash
xcrun simctl erase all
```

### "Code signing error"
**Solution:** In Xcode, select automatic signing:
- Target → Signing & Capabilities → Automatically manage signing

---

## Quick Command Reference

```bash
# Start development server
npm start

# Run iOS simulator
npm run ios

# Run on specific simulator
npx expo run:ios --device "iPhone 15 Pro"

# List available simulators
xcrun simctl list devices available

# Build with EAS
eas build --platform ios --profile development

# Update existing build
eas update --branch production

# View build status
eas build:list

# Run build on device
eas build:run --profile development --platform ios
```

---

## Testing Checklist

### Functional Testing
- [ ] User authentication (login/register)
- [ ] Browse listings
- [ ] Search and filters
- [ ] Listing details
- [ ] Image gallery
- [ ] Contact seller
- [ ] User profile
- [ ] Post new listing
- [ ] Edit/delete listings
- [ ] Location services
- [ ] Camera/photo upload
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Theme switching (light/dark)

### Performance Testing
- [ ] App launch time
- [ ] Image loading performance
- [ ] Scroll performance
- [ ] Memory usage
- [ ] Network error handling
- [ ] Offline functionality

### Device Testing
- [ ] iPhone SE (small screen)
- [ ] iPhone 14/15 (standard)
- [ ] iPhone 14/15 Pro Max (large)
- [ ] iPad (tablet)
- [ ] Different iOS versions (15, 16, 17, 18)

---

## Recommended Testing Flow

### Phase 1: Development (Simulator)
1. Use iOS Simulator for rapid development
2. Test core functionality
3. Fix bugs quickly with hot reload

### Phase 2: Internal Testing (Physical Device)
1. Build development client
2. Test on 2-3 physical iPhones
3. Test camera, location, notifications
4. Verify performance on real hardware

### Phase 3: Beta Testing (TestFlight)
1. Build production version
2. Distribute to beta testers (5-10 people)
3. Gather feedback
4. Fix critical issues

### Phase 4: Production
1. Final testing on TestFlight
2. Submit to App Store
3. Monitor crash reports and reviews

---

## Need Help?

- **Expo Documentation**: https://docs.expo.dev
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **React Native iOS Guide**: https://reactnative.dev/docs/running-on-device

---

## Notes

- **Expo SDK Version**: 53.0.19
- **iOS Deployment Target**: 15.1+
- **Bundle Identifier**: com.passionui.listarpro
- **Development Build**: Includes dev tools and debugging
- **Production Build**: Optimized, no dev tools
