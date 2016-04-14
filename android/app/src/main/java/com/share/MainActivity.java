package com.share;

import co.apptailor.googlesignin.RNGoogleSigninModule;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.AirMaps.AirPackage;
import com.facebook.react.ReactActivity;
import com.aerofs.reactnativeautoupdater.ReactNativeAutoUpdaterPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.theweflex.react.WeChatPackage;
import com.keyee.datetime.*;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactNativeAutoUpdaterActivity { //ReactActivity {

  @Override
  protected String getMainComponentName(){
    return "Share";
  }

  @Override
  protected boolean getUseDeveloperSupport(){
    return BuildConfig.DEBUG;
  }
 /**
  *  Name of the JS Bundle file shipped with the app.
  *  This file has to be added as an Android Asset.
  * */
  @Nullable
  @Override
  protected String getBundleAssetName() {
    return "main.android.jsbundle";
  }

  /**
   *  URL for the metadata of the update.
   * */
  @Override
  protected String getUpdateMetadataUrl() {
    return "https://www.aerofs.com/u/8691535/update.android.json";
  }

  /**
   * Name of the metadata file shipped with the app.
   * This metadata is used to compare the shipped JS code against the updates.
   * */
  @Override
  protected String getMetadataAssetName() {
    return "metadata.android.json";
  }

  @Override 
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new ReactNativeAutoUpdaterPackage(),
      new ReactNativeLocalizationPackage(),
      new RCTDateTimePickerPackage(this),
      new RNGoogleSigninPackage(this),
      new FacebookLoginPackage(),
      new WeChatPackage(),
      new VectorIconsPackage()
      new AirPackage(),
    );
  }
  // for google login
  @Override
  public void onActivityResult(int requestCode, int resultCode, android.content.Intent data) {
    if (requestCode == RNGoogleSigninModule.RC_SIGN_IN) {
        RNGoogleSigninModule.onActivityResult(data);
    }
    super.onActivityResult(requestCode, resultCode, data);
  }
}
