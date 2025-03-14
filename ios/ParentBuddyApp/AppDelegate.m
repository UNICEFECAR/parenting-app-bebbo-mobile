#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"
#import <Firebase.h>
#import "ParentBuddyApp-Swift.h"
#import "Orientation.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
// Add the header at the top of the file:
#import <React/RCTLinkingManager.h>
#import <React/RCTI18nUtil.h>
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
 // animationView.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"splashimg"]];
  UIImageView *img = [[UIImageView alloc]initWithFrame:rootView.bounds];
  [img setImage:[UIImage imageNamed:@"splashimg"]];
  [animationView addSubview:img];
  [animationView sendSubviewToBack:img];
//  animationView.transform = CGAffineTransformScale(CGAffineTransformIdentity, 2, 2);
//  CAGradientLayer *gradient = [CAGradientLayer layer];
//  gradient.startPoint = CGPointMake(0.0, 0.5);
//  gradient.endPoint = CGPointMake(1.0, 0.5);
//  gradient.frame = animationView.bounds;
//  gradient.locations = @[@0.0,@0.2,@0.25,@0.45,@0.65,@0.93,@1.0];
//  gradient.colors = @[
//    (id) UIColorFromRGB(0x2B2F84).CGColor,
//    (id) UIColorFromRGB(0x2B2F84).CGColor,la
//    (id)UIColorFromRGB(0x27378B).CGColor,
//    (id)UIColorFromRGB(0x1F50A0).CGColor,
//    (id)UIColorFromRGB(0x1277C1).CGColor,
//    (id)UIColorFromRGB(0x00AEEF).CGColor,
//    (id)UIColorFromRGB(0x00AEEF).CGColor,
//                      ];
//  [animationView.layer insertSublayer:gradient atIndex:0];

  //#2B2F84, #27378B, #1F50A0, #1277C1, #00AEEF
   // register LottieSplashScreen to RNSplashScreen
   [RNSplashScreen showLottieSplash:animationView inRootView:rootView];
  // casting UIView type to AnimationView type
   // play
   [t playWithAnimationView:animationView];

   // If you want the animation layout to be forced to remove when hide is called, use this code
   [RNSplashScreen setAnimationFinished:true];
  // in AppDelegate.m
  [[RCTI18nUtil sharedInstance] allowRTL:YES];
  if ([FIRApp defaultApp] == nil) {
     [FIRApp configure];
   }
//  [RNSplashScreen show];
  [[FBSDKApplicationDelegate sharedInstance] application:application
                        didFinishLaunchingWithOptions:launchOptions];
   UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
   center.delegate = self;
   [RNSplashScreen show];
  return YES;
}
//- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
//   while ([[UIDevice currentDevice] isGeneratingDeviceOrientationNotifications]) {
//       [[UIDevice currentDevice] endGeneratingDeviceOrientationNotifications];
//   }
//
//   return [Orientation getOrientation];
// }
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
 return [Orientation getOrientation];
}
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Add this above `@end`:
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
//  return [RCTLinkingManager application:application openURL:url options:options];
  if ([[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options]) {
     return YES;
   }

   if ([RCTLinkingManager application:application openURL:url options:options]) {
     return YES;
   }

   return NO;
}
// Add this above `@end`:
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}
//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}
@end
