package com.share;

import cn.reactnative.modules.weibo.WeiboPackage;
import co.apptailor.googlesignin.RNGoogleSigninModule;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.burnweb.rnpermissions.RNPermissionsPackage;
import com.facebook.react.ReactActivity;
import com.projectseptember.RNGL.RNGLPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.yiyang.reactnativebaidumap.ReactMapPackage;
//import com.mapbox.reactnativemapboxgl.ReactNativeMapboxGLPackage;
import com.imagepicker.ImagePickerPackage;
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

    //private static final int PERMISSION_REQUEST_COARSE_LOCATION = 1;

    @Override
    protected String getMainComponentName(){
        return "Share";
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        RNPermissionsPackage.onRequestPermissionsResult(requestCode, permissions, grantResults); // event callback
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
