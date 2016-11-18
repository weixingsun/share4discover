/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "RCTRootView.h"
//#import "CodePush.h"
//#import "RCTOneSignal.h"
//#import "ReactNativeTencentXG.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <BaiduMapAPI_Map/BMKMapComponent.h>
//#import "../Libraries/LinkingIOS/RCTLinkingManager.h"
#import "RCTLinkingManager.h"
#import <UserNotifications/UserNotifications.h>
#import "OpenShare-Swift.h"

BMKMapManager* mapManager;

@implementation AppDelegate

//@synthesize oneSignal = _oneSignal;
#define APPKEY @"WAqWASmCo1GO6uA2AWkjs868PVDRaQOO"
    /** 注册用户通知 */
- (void)registerUserNotification {
  // 注册通知(推送) 申请App需要接受来自服务商提供推送消息  iOS8 下需要使用新的 API
  if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 10.0) {
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionBadge|UNAuthorizationOptionSound|UNAuthorizationOptionAlert)
                          completionHandler:^(BOOL granted,NSError *_Nullable error){
                            if(!error) NSLog(@"request push authorization succeeded!");
                          }];
  }/*else if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
    UIUserNotificationType myTypes = UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert;
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:myTypes categories:nil];
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
  }else {
    UIRemoteNotificationType myTypes = UIRemoteNotificationTypeBadge|UIRemoteNotificationTypeAlert|UIRemoteNotificationTypeSound;
    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:myTypes];
  }*/
}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  //NSURL *jsCodeLocation = [NSURL URLWithString:@"http://10.32.57.7:8081/index.ios.bundle?platform=ios&dev=true"];
  // register APNS for push
  [self registerUserNotification];
  [BaiDuPush registerChannel:launchOptions apiKey:APPKEY pushMode:BPushModeDevelopment];
  [BaiDuPush disableLbs];
  NSMutableDictionary *appProperties = [NSMutableDictionary dictionary];
  if (launchOptions != nil) {
      // Get Local Notification used to launch application.
      NSDictionary *notification = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
      if (notification) {
        [BaiDuPush handleNotification:notification];
        [appProperties setObject:notification forKey:@"initialNotification"];
        //NSMutableDictionary *kv=notification[@"custom"][@"a"][@"p2p_notification"][@"key"];
        //type:lat,lng:ctime#rtime
        //NSString *str=[NSString stringWithFormat:@"share://shareplus.co.nf/i/%@", kv];
        //str=@"share://shareplus.co.nf/c/"; //encodeURI(dict.toString)
        //NSURL *url = [NSURL URLWithString:str];
        //NSDictionary *options = @{UIApplicationOpenURLOptionUniversalLinksOnly : @YES};
        //[[UIApplication sharedApplication] openURL:url options:@{} completionHandler:nil ];
      }
  }
  //角标清0
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"SharePlus"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.appProperties = appProperties;
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;

  //self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
  //                                                       appId:@"beed51f1-1763-4ab3-bcd2-da4364786ceb"];
  //[OneSignal initWiLaunchOptions:launchOptions appId:@"beed51f1-1763-4ab3-bcd2-da4364786ceb"];
    BMKMapManager *mapManager = [[BMKMapManager alloc] init];
    //BOOL ret = [mapManager start:@"6MbvSM9MLCPIOYK4I05Ox0FGoggM5d9L" generalDelegate:nil];
    BOOL ret = [mapManager start:@"Cyq8AKxGeAVNZSzV0Dk74dGpRsImpIHu" generalDelegate:nil];
    if (!ret) {
      NSLog(@"map manager start failed");
    }
    // generalDelegate: network + authentication 
  //Add the navigation controller's view to the window and display.
  //[self.window addSubview:navigationController.view];
  [self.window makeKeyAndVisible];
  return [[FBSDKApplicationDelegate sharedInstance] application:application
          didFinishLaunchingWithOptions:launchOptions];
}
// Facebook SDK
- (void)applicationDidBecomeActive:(UIApplication *)application {
    [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
    // FacebookSignin
    if ([[url scheme] hasPrefix:@"fb"])
    {
      NSLog(@"facebook url: %@", [url scheme]);
      return [[FBSDKApplicationDelegate sharedInstance]
                application:application
                    openURL:url
          sourceApplication:sourceApplication
                 annotation:annotation];
    }
    // GoogleSignin
    /*else if ([[url scheme] hasPrefix:@"com.googleusercontent.apps"])
    {
      NSLog(@"google url: %@", [url scheme]);
      return [RNGoogleSignin
                application:application
                    openURL:url
          sourceApplication:sourceApplication
                 annotation:annotation];
    }*/
    // Weibo
    else if ([[url scheme] hasPrefix:@"wb"])
    {
      NSLog(@"sina weibo url: %@", [url scheme]);
      return [RCTLinkingManager 
                application:application
                    openURL:url
          sourceApplication:sourceApplication
                 annotation:annotation];
    }
    // Open App from URL
    else if ([[url scheme] hasPrefix:@"share"])
    {
      //NSLog(@"open app from url: %@", url );
      return [RCTLinkingManager
              application:application
                  openURL:url
        sourceApplication:sourceApplication
               annotation:annotation];
    }
    //NSLog([url scheme]);
  return YES;
}

//[Universal Links]
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
  NSLog(@"continueUserActivity:");
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}
//百度云推送添加
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UNNotificationSettings *)notificationSettings
{
  [application registerForRemoteNotifications];
  //[TencentXG didRegisterUserNotificationSettings:notificationSettings];
}
//百度云推送添加
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  //[TencentXG didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  NSLog(@"device_token:%@",deviceToken);
  [BaiDuPush registerDeviceToken:deviceToken];
}
//百度云推送添加
- (void)application:(UIApplication *)app didFailToRegisterForRemoteNotificationsWithError:(NSError *)err
{
  //[TencentXG didFailToRegisterForRemoteNotificationsWithError:err];
  NSLog(@"Failed to get DeviceToken, error:%@",err);
}
// 此方法是 用户点击了通知，应用在前台 或者开启后台并且应用在后台 时调起
- (void)application:(UIApplication*)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  //[TencentXG didReceiveRemoteNotification:notification];
  //[RCTPushNotificationManager didReceiveRemoteNotification:notification];
  //[RCTOneSignal didReceiveRemoteNotification:notification];
  completionHandler(UIBackgroundFetchResultNewData);
  // 应用在前台，不跳转页面，让用户选择。
  if (application.applicationState == UIApplicationStateActive) {
    NSDictionary* data = [userInfo objectForKey:@"aps"];
    NSString* msg = [data objectForKey:@"alert"];
    //[BaiDuPush receivePushMessages:msg];
    [BaiDuPush pushNotificationMessages:msg];
  }
  //杀死状态下，直接跳转到跳转页面。
  if (application.applicationState == UIApplicationStateInactive) {
    //NSDictionary* data = [userInfo objectForKey:@"aps"];
    //NSString* msg = [data objectForKey:@"alert"];
    //[BaiDuPush pushNotificationMessages:msg];
  }
  [BaiDuPush saveNotificationMessages:userInfo];
}

//-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
//{
//  [TencentXG didReceiveLocalNotification:notification];
//}

@end
