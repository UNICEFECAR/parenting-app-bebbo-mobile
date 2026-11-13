#import <BebboDriveAuthorizationSpec/BebboDriveAuthorizationSpec.h>
#import <React/RCTBridgeModule.h>
#import <UserNotifications/UserNotifications.h>

@interface LegacyNotifications : NSObject <NativeLegacyNotificationsSpec>
@end

@implementation LegacyNotifications
RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup { return NO; }

- (void)getNotificationColor:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject {
  resolve(@"#2B2F84"); // Android-only presentation option; unused on iOS.
}

- (void)getPendingNotifications:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject {
  [[UNUserNotificationCenter currentNotificationCenter]
      getPendingNotificationRequestsWithCompletionHandler:^(NSArray<UNNotificationRequest *> *requests) {
    NSMutableArray *result = [NSMutableArray new];
    for (UNNotificationRequest *request in requests) {
      NSDictionary *info = request.content.userInfo;
      // Never migrate remote notifications or ones already owned by Notify Kit.
      if (info[@"__notifee_notification"] || !info[@"notitype"] ||
          ![request.trigger isKindOfClass:UNCalendarNotificationTrigger.class]) continue;
      NSDate *date = [(UNCalendarNotificationTrigger *)request.trigger nextTriggerDate];
      if (!date) continue;
      [result addObject:@{@"id": request.identifier,
                          @"timestamp": @([date timeIntervalSince1970] * 1000),
                          @"title": request.content.title ?: @"",
                          @"body": request.content.body ?: @"", @"data": info}];
    }
    NSError *error;
    NSData *json = [NSJSONSerialization dataWithJSONObject:result options:0 error:&error];
    if (error) reject(@"LEGACY_NOTIFICATIONS_READ", error.localizedDescription, error);
    else resolve([[NSString alloc] initWithData:json encoding:NSUTF8StringEncoding]);
  }];
}

- (void)completeMigration:(NSString *)notificationIds
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
  NSError *error;
  NSArray *ids = [NSJSONSerialization JSONObjectWithData:[notificationIds dataUsingEncoding:NSUTF8StringEncoding]
                                                options:0 error:&error];
  if (error || ![ids isKindOfClass:NSArray.class]) {
    reject(@"LEGACY_NOTIFICATIONS_CANCEL", @"Invalid notification identifiers", error);
    return;
  }
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center getPendingNotificationRequestsWithCompletionHandler:^(NSArray<UNNotificationRequest *> *requests) {
    NSMutableArray *legacyIds = [NSMutableArray new];
    for (UNNotificationRequest *request in requests) {
      // Scheduling with the same identifier replaces an old request. Do not remove that replacement.
      if ([ids containsObject:request.identifier] && request.content.userInfo[@"notitype"] &&
          !request.content.userInfo[@"__notifee_notification"]) [legacyIds addObject:request.identifier];
    }
    [center removePendingNotificationRequestsWithIdentifiers:legacyIds];
    resolve(nil);
  }];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeLegacyNotificationsSpecJSI>(params);
}
@end
