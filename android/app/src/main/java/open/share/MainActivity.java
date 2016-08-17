package open.share;

import com.burnweb.rnpermissions.RNPermissionsPackage;
import com.facebook.react.ReactActivity;

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
