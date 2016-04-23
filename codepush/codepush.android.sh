code-push release Share ./release 1.0.0 --description "release v1.0.0" --mandatory true

react-native bundle --platform android --entry-file index.android.js --bundle-output ./release/main.jsbundle  --assets-dest ./release --dev false
#react-native bundle --platform android --entry-file index.android.js --bundle-output ./bundles/index.android.bundle --dev false
