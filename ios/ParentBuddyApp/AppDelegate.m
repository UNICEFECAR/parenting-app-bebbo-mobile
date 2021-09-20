#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"
#import <Firebase.h>
#import "ParentBuddyApp-Swift.h"
#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif


#define UIColorFromRGB(rgbValue) \
[UIColor colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 \
                green:((float)((rgbValue & 0x00FF00) >>  8))/255.0 \
                 blue:((float)((rgbValue & 0x0000FF) >>  0))/255.0 \
                alpha:1.0]


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
 
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"ParentBuddyApp"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  
  
  
  
  Dynamic *t = [Dynamic new];
   UIView *animationView = [t createAnimationViewWithRootView:rootView lottieName:@"splash"]; // change lottieName to your lottie files name
//   animationView.backgroundColor = [UIColor whiteColor]; // change backgroundColor

  CAGradientLayer *gradient = [CAGradientLayer layer];
  gradient.startPoint = CGPointMake(0.0, 0.5);
  gradient.endPoint = CGPointMake(1.0, 0.5);
  gradient.frame = animationView.bounds;
  gradient.locations = @[@0.0 , @0.3,@0.5,@0.7,@1.0];
  gradient.colors = @[
    (id) UIColorFromRGB(0x2B2F84).CGColor,
    (id)UIColorFromRGB(0x27378B).CGColor,
    (id)UIColorFromRGB(0x1F50A0).CGColor,
    (id)UIColorFromRGB(0x1277C1).CGColor,
    (id)UIColorFromRGB(0x00AEEF).CGColor,
                      ];
  [animationView.layer insertSublayer:gradient atIndex:0];

  //#2B2F84, #27378B, #1F50A0, #1277C1, #00AEEF
   // register LottieSplashScreen to RNSplashScreen
   [RNSplashScreen showLottieSplash:animationView inRootView:rootView];

   // play
   [t playWithAnimationView:animationView];

   // If you want the animation layout to be forced to remove when hide is called, use this code
   [RNSplashScreen setAnimationFinished:true];
  
  if ([FIRApp defaultApp] == nil) {
     [FIRApp configure];
   }
//  [RNSplashScreen show];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
