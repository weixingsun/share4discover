package com.share;

import co.apptailor.googlesignin.RNGoogleSigninModule;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.AirMaps.AirPackage;
import com.facebook.react.ReactActivity;
import com.microsoft.codepush.react.CodePush;
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

public class MainActivity extends ReactActivity {

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
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new CodePush(null, this, BuildConfig.DEBUG), //new CodePush("deployment-key-here", this, BuildConfig.DEBUG)
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
