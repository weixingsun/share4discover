package com.share;

import com.burnweb.rnpermissions.RNPermissionsPackage;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ActivityEventListener;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.app.Activity;

public class MainActivity extends ReactActivity { //implements ActivityEventListener {

    private static final String LOG_TAG = "MainActivity";

    @Override
    protected String getMainComponentName(){
        return "SharePlus";
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        RNPermissionsPackage.onRequestPermissionsResult(requestCode, permissions, grantResults); // event callback
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.e("MainActivity.onActivityResult(req,res,intent)", "requestCode="+requestCode+" resultCode="+resultCode );
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
    /*@Override  // >33
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        Log.e("MainActivity.onActivityResult(act,req,res,intent):", "requestCode="+requestCode+" resultCode="+resultCode );
        //super.onActivityResult(requestCode, resultCode, data);
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
    */
}
