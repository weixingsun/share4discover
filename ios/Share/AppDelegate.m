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
#import "CodePush.h"
#import "RCTOneSignal.h"
#import "RNGoogleSignin.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <BaiduMapAPI_Map/BMKMapComponent.h>
//#import "../Libraries/LinkingIOS/RCTLinkingManager.h"
#import "RCTLinkingManager.h"

BMKMapManager* mapManager;

@implementation AppDelegate

@synthesize oneSignal = _oneSignal;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  //#ifdef DEBUG
  //jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  //#else
  //  jsCodeLocation = [CodePush bundleURL];
  //#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"SharePlus"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;

  self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
                                                         appId:@"beed51f1-1763-4ab3-bcd2-da4364786ceb"];
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
  //return YES;
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
    else if ([[url scheme] hasPrefix:@"com.googleusercontent.apps"])
    {
      NSLog(@"google url: %@", [url scheme]);
      return [RNGoogleSignin
                application:application
                    openURL:url
          sourceApplication:sourceApplication
                 annotation:annotation];
    }
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
      NSLog(@"open app from url: %@", url );
      return [RCTLinkingManager
              application:application
                  openURL:url
        sourceApplication:sourceApplication
               annotation:annotation];
    }
    //NSLog([url scheme]);
  return YES;
}

// Required for the notification event.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification {
    [RCTOneSignal didReceiveRemoteNotification:notification];
}
//[Universal Links]
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
  NSLog(@"continueUserActivity:");
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}
@end
