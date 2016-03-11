package com.share;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.AirMaps.AirPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.magus.fblogin.FacebookLoginPackage;

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
      new AirPackage(),
      new FacebookLoginPackage(),
      new VectorIconsPackage()
    );
  }
}
