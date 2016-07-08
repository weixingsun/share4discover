iSuns-iMac:share weixingsun$ code-push app add Share-iOS
©°©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©Ð©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©´
©¦ Name       ©¦ Deployment Key                        ©¦
©À©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©à©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©È
©¦ Production ©¦ 6YPM2XjaZYbIF46yk_cRt67fSh-G4yG-vGnJ- ©¦
©À©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©à©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©È
©¦ Staging    ©¦ 7bZ4UvOx6K8Q_bPuLSKeff2ZaSbX4yG-vGnJ- ©¦
©¸©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©Ø©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¼
Insert: Info.plist  
{
    CodePushDeploymentKey: <key>,
    bundleVersion: "1.0.0"
}

//import CodePush from "react-native-code-push";  
//componentDidMount() {  
//	CodePush.sync();  
//}

react-native bundle --platform ios --entry-file index.ios.js --bundle-output ./release/index.android.bundle --dev true //--assets-dest ./release_ios

#code-push release Share-iOS ./release 1.0.1 --description "release v1.0.1" --mandatory true
