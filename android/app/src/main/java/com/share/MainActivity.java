package com.share;

import co.apptailor.googlesignin.RNGoogleSigninModule;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.AirMaps.AirPackage;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.theweflex.react.WeChatPackage;

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

  @Override 
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new RNGoogleSigninPackage(this),
      new WeChatPackage(),
      new AirPackage(),
      new FacebookLoginPackage(),
      new VectorIconsPackage()
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
