package com.share;

import com.geektime.reactnativeonesignal.ReactNativeOneSignalPackage;
import cn.reactnative.modules.weibo.WeiboPackage;
//import co.apptailor.googlesignin.RNGoogleSigninModule;
//import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.burnweb.rnpermissions.RNPermissionsPackage;
import com.facebook.react.ReactActivity;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.yiyang.reactnativebaidumap.ReactMapPackage;
//import com.mapbox.reactnativemapboxgl.ReactNativeMapboxGLPackage;
import com.imagepicker.ImagePickerPackage;
import com.microsoft.codepush.react.CodePush;
//import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
//import com.magus.fblogin.FacebookLoginPackage;
import com.theweflex.react.WeChatPackage;
//import com.projectseptember.RNGL.RNGLPackage;
import com.wxsun.usbserial.UsbReactPackage;
//import com.reactnative.photoview.PhotoViewPackage;
import com.keyee.datetime.*;
//import it.innove.BleManagerPackage;
//import com.beacon.BeaconsAndroidPackage;
import com.corbt.keepawake.KCKeepAwakePackage;

import android.app.Application;
import android.util.Log;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
//import com.magus.fblogin.FacebookLoginPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.keyee.datetime.RCTDateTimePickerPackage;
import com.horcrux.svg.RNSvgPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static final int PERMISSION_REQUEST_COARSE_LOCATION = 1;
  private static final int RECORD_PERMISSION_REQUEST_CODE = 2;
  private static final int EXTERNAL_STORAGE_PERMISSION_REQUEST_CODE = 3;
  private static final int CAMERA_PERMISSION_REQUEST_CODE = 4;

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    //AppEventsLogger.activateApp(this);
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
    }

    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      String stagingKey = "ZplJqL1U5atxj36CLDKSEzzVmCGq4yG-vGnJ-";
      String productionKey = "eP-AeP1uJtwuy_QVdGZrpj3F2mA04yG-vGnJ-";
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new RNDeviceInfo(),
        new RNSoundPackage(),
        new RNSvgPackage(),
        new ReactNativeI18n(),
        new ReactNativeOneSignalPackage(),
        new ImagePickerPackage(),
        new CodePush(stagingKey, MainApplication.this, BuildConfig.DEBUG),
        //new ReactNativeLocalizationPackage(),
        //new FacebookLoginPackage(),
        //new RNGoogleSigninPackage(),
        //new BleManagerPackage(),
        //new BeaconsAndroidPackage(),
        new UsbReactPackage(),
        new RNPermissionsPackage(),  //Android 6.0 permission
        new FBSDKPackage(mCallbackManager),  //mCallbackManager
        new WeChatPackage(),
        new WeiboPackage(),
        new VectorIconsPackage(),
        new KCKeepAwakePackage(),
        new ReactMapPackage(),  //BaiduMap
        new MapsPackage()   //GoogleMap
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
