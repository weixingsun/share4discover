package com.share;

//import com.burnweb.rnpermissions.RNPermissionsPackage;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.app.Activity;

public class MainActivity extends ReactActivity { // implements ActivityEventListener {

    private static final String LOG_TAG = "MainActivity";

    @Override
    protected String getMainComponentName(){
        return "Xshare";
    }

    //@Override
    //public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    //    RNPermissionsPackage.onRequestPermissionsResult(requestCode, permissions, grantResults); // event callback
    //    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    //}

    /*@Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        //super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }*/
    @Override  // >33
    public void onActivityResult(int requestCode, int resultCode, Intent data) { //Activity activity, 
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
    @Override  // >33
    public void onNewIntent(Intent intent) {}
}
