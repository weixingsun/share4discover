package com.share;

import com.burnweb.rnpermissions.RNPermissionsPackage;
import com.facebook.react.ReactActivity;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.bridge.ActivityEventListener;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.app.Activity;

public class MainActivity extends ReactActivity implements ActivityEventListener {

    //private static final int PERMISSION_REQUEST_COARSE_LOCATION = 1;

    @Override
    protected String getMainComponentName(){
        return "SharePlus";
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        RNPermissionsPackage.onRequestPermissionsResult(requestCode, permissions, grantResults); // event callback
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    
    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        //super.onActivityResult(requestCode, resultCode, data);
        //mCallbackManager.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
    @Override
    public void onNewIntent(Intent intent) {
        this.setIntent(intent);
        Bundle bundle = intent.getExtras();
        for (String key : bundle.keySet()) {
            Object value = bundle.get(key);
            String log = String.format("%s %s (%s)", key, value.toString(), value.getClass().getName());
            Log.e("MainActivity.onNewIntent()", log );
        }
    }
}
