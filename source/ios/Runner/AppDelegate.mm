#import "AppDelegate.h"
#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTBundleURLProvider.h>
#import "RNSplashScreen.h"
#import <Firebase.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"Runner";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  bool didFinish = [super application:application didFinishLaunchingWithOptions:launchOptions];

  [FIRApp configure];
  [GMSServices provideAPIKey:@"AIzaSyDg1evvc68xACuU2RsbBiV5uoF0vwVNM8Y"];
  [RNSplashScreen show];

  return didFinish;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end
