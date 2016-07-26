package com.share;

import com.geektime.reactnativeonesignal.ReactNativeOneSignalPackage;
import cn.reactnative.modules.weibo.WeiboPackage;
import co.apptailor.googlesignin.RNGoogleSigninModule;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.burnweb.rnpermissions.RNPermissionsPackage;
import com.facebook.react.ReactActivity;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.yiyang.reactnativebaidumap.ReactMapPackage;
//import com.mapbox.reactnativemapboxgl.ReactNativeMapboxGLPackage;
import com.imagepicker.ImagePickerPackage;
import com.microsoft.codepush.react.CodePush;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.theweflex.react.WeChatPackage;
import com.keyee.datetime.*;
import com.projectseptember.RNGL.RNGLPackage;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
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
        new ReactNativeI18n(),
        new ReactNativeOneSignalPackage(),
        new ImagePickerPackage(),
        new CodePush(stagingKey, MainApplication.this, BuildConfig.DEBUG),
        new ReactNativeLocalizationPackage(),
        //new RCTDateTimePickerPackage(this),
        new RNGoogleSigninPackage(),
        new RNPermissionsPackage(),  //Android 6.0 permission
        new FacebookLoginPackage(),
        new WeChatPackage(),
        new WeiboPackage(),
        new VectorIconsPackage(),
        new RNGLPackage(),
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
