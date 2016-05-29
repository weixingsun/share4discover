package com.share;

import cn.reactnative.modules.weibo.WeiboPackage;
import co.apptailor.googlesignin.RNGoogleSigninModule;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.AirMaps.AirPackage;
import com.burnweb.rnpermissions.RNPermissionsPackage;
import com.facebook.react.ReactActivity;
import com.yiyang.reactnativebaidumap.ReactMapPackage;
//import com.mapbox.reactnativemapboxgl.ReactNativeMapboxGLPackage;
import com.microsoft.codepush.react.CodePush;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.theweflex.react.WeChatPackage;
import com.keyee.datetime.*;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    private static final int PERMISSION_REQUEST_COARSE_LOCATION = 1;

    @Override
    protected String getMainComponentName(){
        return "Share";
    }

    @Override
    protected boolean getUseDeveloperSupport(){
        return BuildConfig.DEBUG;
    }

    // 2. Override the getJSBundleFile method in order to let
    // the CodePush runtime determine where to get the JS
    // bundle location from on each app start
    @Override
    protected String getJSBundleFile() {
        return CodePush.getBundleUrl();
    }
  @Override 
  protected List<ReactPackage> getPackages() {
    String stagingKey = "2ssnSG7sskaaELPFLIHjvusA9Og14yG-vGnJ-";
    String productionKey = "ATk9f1lkC3zpmIqebUPi8GHGeOWE4yG-vGnJ-";
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new CodePush(stagingKey, this, BuildConfig.DEBUG),
      new ReactNativeLocalizationPackage(),
      new RCTDateTimePickerPackage(this),
      new RNGoogleSigninPackage(),
      new RNPermissionsPackage(),  //Android 6.0 permission
      new FacebookLoginPackage(),
      new WeChatPackage(),
      new WeiboPackage(),
      new VectorIconsPackage(),
      new ReactMapPackage(),  //BaiduMap
      new AirPackage()  //GoogleMap
    );
  }
  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
      RNPermissionsPackage.onRequestPermissionsResult(requestCode, permissions, grantResults); // event callback
      super.onRequestPermissionsResult(requestCode, permissions, grantResults);
  }
}
