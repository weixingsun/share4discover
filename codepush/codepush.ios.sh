Insert: Info.plist  
{
    CodePushDeploymentKey: <key>,
    bundleVersion: "1.0.0"
}

react-native bundle --platform ios --entry-file index.ios.js --bundle-output ./release/index.ios.bundle --dev true 
//--assets-dest ./release_ios

#code-push release Share-iOS ./release 1.0.1 --description "release v1.0.1" --mandatory true
